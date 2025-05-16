const express = require('express');
const {
    applyLeave,
    updateLeaveStatus,
    getLeaves
} = require('../controllers/leaveController');

const { protect, restrictTo, restrictToAny } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, restrictTo('employee'), applyLeave);

router.put('/:id/status', protect, restrictTo('manager'), updateLeaveStatus);

router.get('/', protect, restrictToAny('employee', 'manager', 'admin'), getLeaves);

module.exports = router;
