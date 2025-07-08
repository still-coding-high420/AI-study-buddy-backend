const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema(
  {
    // Each chat history belongs to a user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a reference to our User model
    },
    // The conversation will be an array of message objects
    conversation: [
      {
        role: {
          type: String,
          enum: ['user', 'ai'], // The role can only be 'user' or 'ai'
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;
