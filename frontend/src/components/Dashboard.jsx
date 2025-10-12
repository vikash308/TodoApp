import React, { useEffect, useState } from "react";
import axios from "axios";
import TodoAdd from "./TodoAdd";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState(true); // NEW
  let api = import.meta.env.VITE_API_URL;

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${api}/dashboard`, {
        withCredentials: true,
      });
      setTodos(res.data);
      setError("");
      setIsAuth(true);
    } catch (err) {
      console.log("Error Fetching Todos", err);
      if (err.response && err.response.status === 401) {
        setError("⚠️ Please login to see your tasks.");
        setIsAuth(false); // user is not authenticated
      } else {
        setError("❌ Something went wrong while fetching todos.");
      }
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

  // If there is an error, show it
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-yellow-200 to-green-200 p-6">
      <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
        <h2 className="text-4xl font-bold mb-6 text-center text-purple-700 animate-pulse">
          ⚡ Todo List
        </h2>

        <div className="mb-6">
          {isAuth ? (
            <TodoAdd addNewTodo={addNewTodo} />
          ) : (
            <p className="text-center text-red-600 font-semibold">
              ⚠️ You need to login to add tasks.
            </p>
          )}
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
                {/* rest of your todo rendering code */}
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
