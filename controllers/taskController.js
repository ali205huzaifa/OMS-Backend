const Task = require('../models/task');
const User = require('../models/user');

exports.createTask = async (req, res) => {
    try {
        const assignedEmployee = await User.findOne({
            _id: req.body.assignedTo,
            managerId: req.user.id
        });

        if (!assignedEmployee) {
            return res.status(403).json({
                message: 'You can only assign tasks to your team members'
            });
        }

        const task = await Task.create({
            ...req.body,
            assignedBy: req.user.id
        });

        res.status(201).json({ message: 'Task created', task });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create task',
            error: err.message
        });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, assignedTo: req.user.id },
            { status: req.body.status },
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found or not assigned to you' });

        res.status(200).json({ message: 'Status updated', task });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update status' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.user.role === 'Manager' && task.assignedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not the manager who assigned this task' });
        }
        if (req.user.role === 'Employee' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not assigned to this task' });
        }

        task.comments.push({ userId: req.user.id, text: req.body.text });
        await task.save();

        res.status(200).json({ message: 'Comment added', task });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add comment' });
    }
};

exports.listTasks = async (req, res) => {
    try {
        const query = {};
        if (req.user.role === 'Manager') {
            query.assignedBy = req.user.id;
        } else if (req.user.role === 'Employee') {
            query.assignedTo = req.user.id;
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name')
            .populate('assignedBy', 'name')
            .sort({ dueDate: 1 });

        res.status(200).json({ tasks });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};
