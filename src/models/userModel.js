const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  shareableLink: {
    type: String,
    unique: true
  },
  personalData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonalData'
  }]
}, { timestamps: true });

// Generate unique shareable link before saving
userSchema.pre('save', function(next) {
  if (!this.shareableLink) {
    this.shareableLink = generateUniqueId();
  }
  next();
});

function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

module.exports = mongoose.model('User', userSchema); 