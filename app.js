const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/attendance', require('./routes/attendanceRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/performance', require('./routes/performanceRoutes'));
app.use('/leaves', require('./routes/leaveRoutes'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

module.exports = app;
