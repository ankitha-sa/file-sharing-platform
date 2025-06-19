//file.js

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: String,
  filePath: String,
  senderUsername: String,
  receiverUsername: String,  // 👈 Needed to fetch received files
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('File', fileSchema);


