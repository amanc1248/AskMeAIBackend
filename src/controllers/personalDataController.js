const PersonalData = require('../models/personalDataModel');
const User = require('../models/userModel');
const { getAIResponse } = require('../services/aiService');

// Add personal data
exports.addPersonalData = async (req, res) => {
  try {
    const { userId, content } = req.body;
    
    // Try to find existing personal data for the user
    let personalData = await PersonalData.findOne({ userId });

    if (personalData) {
      // If exists, append the new content
      personalData.content = personalData.content + '\n\n' + content;
      const updatedData = await personalData.save();
      res.json(updatedData);
    } else {
      // If doesn't exist, create new
      const newPersonalData = new PersonalData({
        userId,
        content
      });

      const savedData = await newPersonalData.save();
      
      // Add reference to user's personalData array
      await User.findByIdAndUpdate(
        userId,
        { $push: { personalData: savedData._id } }
      );

      res.status(201).json(savedData);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all personal data for a user
exports.getPersonalData = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await PersonalData.findOne({ userId });
    res.json(data || { content: '' }); // Return empty content if no data exists
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ask question about a user
exports.askQuestion = async (req, res) => {
  try {
    const { shareableLink } = req.params;
    const { question } = req.body;

    const user = await User.findOne({ shareableLink });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the personal data directly
    const personalData = await PersonalData.findOne({ userId: user._id });
    
    if (!personalData) {
      return res.status(404).json({ message: 'No personal data found' });
    }

    // Get AI response
    const answer = await getAIResponse(personalData.content, question);
    
    res.json({
      question,
      answer,
      userName: user.name
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 