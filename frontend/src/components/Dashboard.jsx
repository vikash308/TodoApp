import React, { useEffect, useState } from "react";
import axios from "axios";
import TodoAdd from "./TodoAdd";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.log("Error Fetching Todos", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addNewTodo = () => fetchTodos();
  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const buttonClicked = e.target.closest(".menu-button");
      const menuClicked = e.target.closest(".menu-dropdown");
      if (!buttonClicked && !menuClicked) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/dashboard/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await axios.put(
        `${API_URL}/dashboard/${id}`,
        { status: "completed" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditClick = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(
        `${API_URL}/dashboard/${id}`,
        { text: editText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEditId(null);
      setEditText("");
      fetchTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const statusBg = {
    pending: "bg-red-500/30 border border-red-400",
    progress: "bg-blue-500/30 border border-blue-400",
    completed: "bg-green-500/30 border border-green-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-yellow-200 to-green-200 p-6">
      <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
        <h2 className="text-4xl font-bold mb-6 text-center text-purple-700 animate-pulse">
          ⚡ Todo List
        </h2>

        <div className="mb-6">
          <TodoAdd addNewTodo={addNewTodo} />
        </div>

        <h3 className="text-2xl font-semibold mb-4 border-b border-white/30 pb-2 text-black">
          Your Todos:
        </h3>

        <div className="space-y-4">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`flex justify-between items-center p-4 rounded-xl shadow-lg transform transition-transform duration-150 relative ${
                  statusBg[todo.status] ||
                  "bg-gray-800/40 border border-gray-700"
                }`}
              >
                <div className="flex-1">
                  {editId === todo._id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border px-2 py-1 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-black font-medium">{todo.text}</p>
                  )}
                  <p className="text-sm text-black/70 mt-1">
                    {todo.date
                      ? new Date(todo.date).toLocaleDateString()
                      : "No date"}{" "}
                    | Status:{" "}
                    <span className="font-semibold">{todo.status}</span>
                  </p>
                </div>

                <div className="relative">
                  {/* Menu button: transparent normally, solid when open */}
                  <button
                    onClick={() => toggleMenu(todo._id)}
                    className={`menu-button p-2 rounded-full transition ${
                      openMenuId === todo._id
                        ? " text-black bold"
                        : "hover:bg-white/20"
                    }`}
                  >
                    &#x22EE;
                  </button>

                  {openMenuId === todo._id && (
                    <div className="menu-dropdown absolute right-0 text-black mt-2 w-44  border border-gray-300 rounded-xl shadow-lg flex flex-col z-20 bg-gradient-to-r from-pink-200 via-yellow-200 to-green-200 ">
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="px-4 py-2 text-left text-black font-semibold  rounded-t-xl"
                      >
                        ❌ Delete
                      </button>
                      <button
                        onClick={() => handleMarkDone(todo._id)}
                        className="px-4 py-2 text-left  text-black font-semibold transition-colors"
                      >
                        ✅ Mark as Done
                      </button>
                      <button
                        onClick={() =>
                          editId === todo._id
                            ? handleEditSave(todo._id)
                            : handleEditClick(todo)
                        }
                        className="px-4 py-2 text-left text-black font-semibold transition-colors rounded-b-xl"
                      >
                        ✏️ {editId === todo._id ? "Save" : "Edit"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-black/70">No todos yet. Add one above! 🌟</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
