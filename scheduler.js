const cron = require('node-cron');
const { autoMarkAbsent } = require('./controllers/attendanceController');

cron.schedule('1 15 * * *', () => {
    console.log('Running auto-mark absent at 3:01 PM');
    autoMarkAbsent();
});
