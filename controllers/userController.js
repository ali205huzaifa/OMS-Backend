const User = require('../models/user');

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User detail Updated!', user });
    } catch (err) {
        res.status(500).json({ message: 'Update failed', error: err.message });
    }
};

exports.softDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        res.status(200).json({ message: 'User deleted', user });
    } catch (err) {
        res.status(500).json({ message: 'Deletion failed' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 2, role, name } = req.query;
        const query = { isDeleted: false };
        if (role) query.role = role;
        if (name) query.name = { $regex: name, $options: 'i' };

        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const count = await User.countDocuments(query);

        res.status(200).json({ total: count, users });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters.' });
        }

        const searchRegex = new RegExp(query, 'i');

        const users = await User.find({
            isDeleted: false,
            $or: [
                { name: searchRegex },
                { role: searchRegex }
            ]
        });

        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Search failed', error: err.message });
    }
};
