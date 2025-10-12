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
    <div className="mb-6">
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
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          placeholder="⚡ Enter your task..."
          value={task}
          onChange={handleChange}
          className="flex-1 px-4 py-2 bg-neutral-800/70 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] hover:scale-102 active:scale-95 transition-all"
        >
          ➕ Add Task
        </button>
      </form>
    </div>
  );
};

export default TodoAdd;
