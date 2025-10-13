const express = require("express");
const Todo = require("../models/todo");
const User = require("../models/user")
const isAuth = require("../middlewares");
const router = express.Router();


router.post("/", isAuth, async (req, res) => {
    const { text } = req.body;
    const userId = req.user._id;

    // 1. Create new todo
    const newTodo = new Todo({ text, date: new Date() });
    await newTodo.save();

    // 2. Push todo into user's todos array
    const user = await User.findById(userId);
    user.todos.push(newTodo._id);
    await user.save();

    res.json({ message: "Task added successfully", todo: newTodo });
});

router.get("/", isAuth, async (req, res) => {
    try {
        // Find the logged-in user and populate todos
        const user = await User.findById(req.user._id).populate("todos");

        if (!user) return res.status(404).json({ message: "User not found" });

        // Send the populated todos
        res.json(user.todos);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", isAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the todo
        await Todo.findByIdAndDelete(id);

        // Remove reference from user's todos
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { todos: id },
        });

        res.json({ message: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id", isAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, text } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (text) updateData.text = text;

        const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedTodo)
            return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo updated successfully", todo: updatedTodo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;

