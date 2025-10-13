import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // Signup page load hone par
  useEffect(() => {
    // Remove JWT on page load
    localStorage.removeItem("token");
  }, []);

  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        { username: formData.username, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );
      const token = res.data.token;
      localStorage.setItem("token", token);
      setMessage(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-yellow-200 to-green-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-transform hover:scale-105 animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-700 animate-pulse">
          ✨ Welcome Back! ✨
        </h2>

        {message && (
          <p
            className={`mb-4 text-center font-medium ${
              message.includes("success") ? "text-green-600" : "text-red-500"
            } animate-pulse`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleForm} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-5 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-5 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5 text-sm">
          Don't have an account?{" "}
          <span
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
