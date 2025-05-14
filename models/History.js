/**
 * History model- I basically followed the example of the user model to start from
 * Defines the schema for storing user user itinarary history
 */
const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  location: {
    type: String,
    required: true
  },
  itinerary: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', HistorySchema);