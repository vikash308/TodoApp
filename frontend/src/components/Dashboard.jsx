import React, { useEffect, useState } from "react";
import axios from "axios";
import TodoAdd from "./TodoAdd";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isAuth, setIsAuth] = useState(true); // Track login
  let api = import.meta.env.VITE_API_URL;

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${api}/dashboard`, {
        withCredentials: true,
      });
      setTodos(res.data);
      setIsAuth(true);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsAuth(false); // not logged in
        setTodos([]); // clear todos
      } else {
        console.log("Error Fetching Todos", err);
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

  const statusBg = {
    pending: "bg-red-500/30 border border-red-400",
    progress: "bg-blue-500/30 border border-blue-400",
    completed: "bg-green-500/30 border border-green-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-yellow-200 to-green-200 p-6">
      <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn">
        <h2 className="text-4xl font-bold mb-2 text-center text-purple-700 animate-pulse">
          ⚡ Todo List
        </h2>

        {!isAuth && (
          <p className="text-center text-red-600 mb-4 font-semibold">
            ⚠️ Please login to add and view tasks.
          </p>
        )}

        <div className="mb-6">
          <TodoAdd addNewTodo={addNewTodo} disabled={!isAuth} />
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
                {/* your todo item content */}
              </div>
            ))
          ) : (
            <p className="text-black/70">
              {isAuth
                ? "No todos yet. Add one above! 🌟"
                : "Login to see your tasks."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
