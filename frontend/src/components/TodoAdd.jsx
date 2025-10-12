import React, { useState } from "react";
import axios from "axios";

const TodoAdd = ({ addNewTodo }) => {
  const [task, setTask] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => setTask(e.target.value);

  const handleForm = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setMessage("⚠️ Please enter a task");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/dashboard",
        { text: task },
        { withCredentials: true }
      );
      setMessage(res.data.message || "✅ Task added!");
      addNewTodo();
      setTask("");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong");
    }
  };

  return (
    <div className="mb-6 bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30">
      {message && (
        <p
          className={`text-center mb-3 font-medium transition-all duration-300 ${
            message.includes("✅")
              ? "text-green-400"
              : message.includes("⚠️")
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleForm}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <input
          type="text"
          placeholder="⚡ Enter your task..."
          value={task}
          onChange={handleChange}
          className="flex-1 px-4 py-3 rounded-xl bg-white/30 border border-white/40 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-t from-purple-500 via-pink-500 to-yellow-400 text-white shadow-lg hover:scale-[1.03] active:scale-95 transition-all"
        >
          ➕ Add Task
        </button>
      </form>
    </div>
  );
};

export default TodoAdd;
