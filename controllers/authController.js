const User = require('../models/user');
const generateToken = require('../utils/generateToken');

/*
##Endpoint to Register an Admin user

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password, role, managerId } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Admin already exists' });

        const user = await User.create({ name, email, password, role, managerId });
        res.status(201).json({ message: 'Admin registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
*/

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, managerId } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role, managerId });

        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, isDeleted: false });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email, isDeleted: false });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
