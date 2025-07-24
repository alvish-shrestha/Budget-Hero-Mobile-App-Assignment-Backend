const Goal = require("../models/Goal");

// Create Goal
exports.createGoal = async (req, res) => {
    try {
        const goal = await Goal.create({ ...req.body, userId: req.user._id });
        res.status(201).json({ success: true, data: goal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Goals
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id }).sort({ deadline: 1 });
        res.status(200).json({ success: true, count: goals.length, data: goals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Goal
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });
        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Goal
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });
        res.status(200).json({ success: true, message: "Goal deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};