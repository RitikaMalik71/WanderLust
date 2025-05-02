const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    adults: Number,
    children: Number,
    days: Number,
    checkin: Date,
    checkout: Date,
    participateInSustainability: Boolean,
    cancelled: {
      type: Boolean,
      default: false,
    },
  });
  

module.exports = mongoose.model('Booking', bookingSchema);
