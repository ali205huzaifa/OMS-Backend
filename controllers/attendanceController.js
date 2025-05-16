const Attendance = require('../models/attendance');
const User = require('../models/user');
const moment = require('moment');

exports.markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type } = req.body;
        const today = moment().startOf('day').toDate();
        const currentTime = new Date();

        if (!type || !['onsite', 'remote'].includes(type)) {
            return res.status(400).json({ message: 'Attendance type must be onsite or remote' });
        }

        let attendance = await Attendance.findOne({ userId, date: today });

        if (!attendance) {
            let status;
            const checkInHour = moment(currentTime).hour();
            const checkInMinute = moment(currentTime).minute();

            if (checkInHour < 11) {
                status = 'present';
            } else if (checkInHour < 13 || (checkInHour === 13 && checkInMinute === 0)) {
                status = 'half-day';
            } else {
                status = 'half-day';
            }

            attendance = await Attendance.create({
                userId,
                date: today,
                checkIn: currentTime,
                status,
                type
            });

        } else if (!attendance.checkOut) {
            attendance.checkOut = currentTime;

            const checkOutHour = moment(currentTime).hour();
            if (
                checkOutHour >= 13 &&
                checkOutHour < 15 &&
                attendance.status !== 'half-day'
            ) {
                attendance.status = 'half-day';
            }

            await attendance.save();

        } else {
            return res.status(400).json({ message: 'Attendance already marked' });
        }

        res.status(200).json({ message: 'Attendance marked', attendance });

    } catch (err) {
        res.status(500).json({ message: 'Error marking attendance', error: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { userId, type, page = 1, limit = 10 } = req.query;
        const query = {};

        if (req.user.role === 'manager') {
            const users = await User.find({ managerId: req.user.id }, '_id');
            query.userId = { $in: users.map(u => u._id) };
        } else if (req.user.role === 'admin' && userId) {
            query.userId = userId;
        }

        if (type) query.type = type;

        const records = await Attendance.find(query)
            .populate('userId', 'name email role')
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const count = await Attendance.countDocuments(query);

        res.status(200).json({ total: count, records });

    } catch (err) {
        res.status(500).json({ message: 'Error fetching attendance', error: err.message });
    }
};

exports.attendanceReport = async (req, res) => {
    try {
        const result = await Attendance.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json({ summary: result });
    } catch (err) {
        res.status(500).json({ message: 'Failed to generate report', error: err.message });
    }
};

exports.autoMarkAbsent = async () => {
    try {
        const today = moment().startOf('day').toDate();

        const allEmployees = await User.find({ role: 'employee' }, '_id');

        const markedAttendances = await Attendance.find({ date: today }, 'userId');
        const markedUserIds = markedAttendances.map(a => a.userId.toString());

        const absentEmployees = allEmployees.filter(emp => !markedUserIds.includes(emp._id.toString()));

        const bulkAbsent = absentEmployees.map(emp => ({
            userId: emp._id,
            date: today,
            status: 'absent',
            type: 'onsite'
        }));

        if (bulkAbsent.length > 0) {
            await Attendance.insertMany(bulkAbsent);
            console.log(`Auto-marked ${bulkAbsent.length} employees as absent.`);
        } else {
            console.log(`No absentees to mark.`);
        }

    } catch (error) {
        console.error('Error in auto-marking absent:', error.message);
    }
};
