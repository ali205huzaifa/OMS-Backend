const PerformanceReview = require('../models/PerformanceReview');
const User = require('../models/user');

exports.addReview = async (req, res) => {
    try {
        const { employeeId, rating, feedback } = req.body;

        if (req.user.role === 'manager') {
            const employee = await User.findOne({ _id: employeeId, managerId: req.user.id });
            if (!employee) {
                return res.status(403).json({ message: 'You can only review your direct reports' });
            }
        }

        const review = await PerformanceReview.create({
            employeeId,
            reviewerId: req.user.id,
            rating,
            feedback
        });

        res.status(201).json({ message: 'Review added', review });

    } catch (err) {
        res.status(500).json({ message: 'Failed to add review', error: err.message });
    }
};

exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await PerformanceReview.find({ employeeId: req.user.id })
            .populate('reviewerId', 'name');

        res.status(200).json({ reviews });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

exports.getEmployeeReviews = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const reviews = await PerformanceReview.find({ employeeId })
            .populate('reviewerId', 'name')
            .populate('employeeId', 'name');

        res.status(200).json({ reviews });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch employee reviews' });
    }
};

exports.getPerformanceReport = async (req, res) => {
    try {
        const report = await PerformanceReview.aggregate([
            {
                $group: {
                    _id: '$employeeId',
                    avgRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            {
                $project: {
                    employeeName: '$employee.name',
                    avgRating: 1,
                    totalReviews: 1
                }
            },
            { $sort: { avgRating: -1 } }
        ]);

        res.status(200).json({ report });
    } catch (err) {
        res.status(500).json({ message: 'Failed to generate report', error: err.message });
    }
};
