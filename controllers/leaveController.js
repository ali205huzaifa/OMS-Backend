const Leave = require('../models/Leave');
const User = require('../models/user');

// Employee applies for leave
exports.applyLeave = async (req, res) => {
    try {
        const { type, reason, startDate, endDate } = req.body;

        const leave = await Leave.create({
            employeeId: req.user.id,
            type,
            reason,
            startDate,
            endDate
        });

        res.status(201).json({ message: 'Leave request submitted', leave });
    } catch (err) {
        res.status(500).json({ message: 'Failed to apply for leave', error: err.message });
    }
};

// Manager updates leave status
exports.updateLeaveStatus = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id).populate('employeeId');
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        if (req.user.role === 'Manager') {
            if (leave.employeeId.managerId?.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this leave request' });
            }
        }

        leave.status = req.body.status;
        await leave.save();

        res.status(200).json({ message: 'Leave status updated', leave });

    } catch (err) {
        res.status(500).json({ message: 'Failed to update leave status', error: err.message });
    }
};

// Get leave requests (Admin sees all, Manager sees team, Employee sees own)
exports.getLeaves = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'Employee') {
            filter.employeeId = req.user.id;
        }

        const leaves = await Leave.find(filter)
            .populate('employeeId', 'name email')
            .sort({ appliedAt: -1 });

        res.status(200).json({ leaves });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch leaves', error: err.message });
    }
};
