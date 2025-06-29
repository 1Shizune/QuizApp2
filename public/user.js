const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: String,
  history: [
    {
      score: Number,
      date: { type: Date, default: Date.now }
    }
  ],
  totalScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);