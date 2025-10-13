import React, { useEffect, useState } from "react";
import axios from "axios";
import TodoAdd from "./TodoAdd";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
const API_URL = import.meta.env.VITE_API_URL;
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
      if (!buttonClicked && !menuClicked) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/dashboard/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
    pending: "bg-red-900/40 border border-red-600",
    progress: "bg-blue-900/40 border border-blue-600",
    completed: "bg-green-900/40 border border-green-600 shadow-green-500/20",
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-400">
          ⚡ Todo List
        </h2>

        <div className="mb-6">
          <TodoAdd addNewTodo={addNewTodo} />
        </div>

        <h3 className="text-xl font-semibold mb-2 border-b border-gray-700 pb-2">
          Your Todos:
        </h3>
        <div className="space-y-3">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`flex justify-between items-center p-4 rounded-lg shadow-xl hover:shadow-blue-500/20 transition-transform  relative ${
                  statusBg[todo.status] ||
                  "bg-gray-800/60 border border-gray-700"
                }`}
              >
                <div className="flex-1">
                  {editId === todo._id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border px-2 py-1 rounded w-full bg-gray-800 text-white"
                    />
                  ) : (
                    <p
                      className={`font-medium ${
                        todo.status === "completed"
                          ? "line-through text-gray-500"
                          : "text-gray-100"
                      }`}
                    >
                      {todo.text}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {todo.date
                      ? new Date(todo.date).toLocaleDateString()
                      : "No date"}{" "}
                    | Status:{" "}
                    <span className="text-blue-400">{todo.status}</span>
                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => toggleMenu(todo._id)}
                    className="menu-button p-2 rounded-full hover:bg-gray-700 transition"
                  >
                    &#x22EE;
                  </button>

                  {openMenuId === todo._id && (
                    <div className="menu-dropdown absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex flex-col z-20">
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="px-4 py-2 text-left hover:bg-red-600/30 text-red-400 transition-colors"
                      >
                        ❌ Delete
                      </button>
                      <button
                        onClick={() => handleMarkDone(todo._id)}
                        className="px-4 py-2 text-left hover:bg-green-600/30 text-green-400 transition-colors"
                      >
                        ✅ Mark as Done
                      </button>
                      <button
                        onClick={() =>
                          editId === todo._id
                            ? handleEditSave(todo._id)
                            : handleEditClick(todo)
                        }
                        className="px-4 py-2 text-left hover:bg-blue-600/30 text-blue-400 transition-colors"
                      >
                        ✏️ {editId === todo._id ? "Save" : "Edit"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No todos yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
