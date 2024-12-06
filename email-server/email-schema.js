const mongoose = require("mongoose");

// Email Schema definition
const emailSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  room_type: { type: String },
  checkin_date: { type: Date },
  checkout_date: { type: Date },
  name: { type: String },
  room_price: { type: String },
  isPaid: { type: Boolean, default: false },
});

// Create model from the schema
const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
