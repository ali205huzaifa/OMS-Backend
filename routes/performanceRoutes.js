const express = require('express');
const {
    addReview,
    getMyReviews,
    getEmployeeReviews,
    getPerformanceReport
} = require('../controllers/performanceController');

const { protect, restrictTo, restrictToAny } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, restrictTo('manager'), addReview);

router.get('/my', protect, restrictTo('employee'), getMyReviews);

router.get('/:employeeId', protect, restrictToAny('manager', 'admin'), getEmployeeReviews);

router.get('/', protect, restrictToAny('manager', 'admin'), getPerformanceReport);

module.exports = router;
