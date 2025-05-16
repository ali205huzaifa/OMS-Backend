const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    checkIn: Date,
    checkOut: Date,
    type: { type: String, enum: ['onsite', 'remote'], default: 'onsite' },
    status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], default: 'present' }
}, { timestamps: true });

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
