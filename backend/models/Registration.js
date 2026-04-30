const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['confirmed', 'waitlisted', 'cancelled'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['free', 'pending', 'paid'], default: 'free' },
  ticketId: { type: String, unique: true },
  additionalInfo: {
    teamName: String,
    teammates: [String],
    dietaryPreference: String,
    tShirtSize: String,
    notes: String,
  },
}, { timestamps: true });

// Prevent double registration
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Auto-generate ticket ID
registrationSchema.pre('save', function (next) {
  if (!this.ticketId) {
    this.ticketId = `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
