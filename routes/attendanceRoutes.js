const express = require('express');
const {
    markAttendance,
    getAttendance,
    attendanceReport
} = require('../controllers/attendanceController');

const { protect, restrictTo, restrictToAny } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/mark', protect, restrictToAny('employee', 'manager'), markAttendance);
router.get('/', protect, restrictToAny('manager', 'admin'), getAttendance);
router.get('/report', protect, restrictToAny('manager', 'admin'), attendanceReport);

module.exports = router;
