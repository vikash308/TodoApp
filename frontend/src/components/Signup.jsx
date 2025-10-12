import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
let api = process.env.VITE_API_URL;
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
       `${api}/auth/signup`,
        formData,
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setFormData({ username: "", email: "", password: "" });

      if (res.data.message === "Account created successfully") {
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-transform hover:scale-105 animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-700 animate-pulse">
          ✨ Create Your Account ✨
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
              className="w-full px-5 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-5 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
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
              className="w-full px-5 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5 text-sm">
          Already have an account?{" "}
          <span
            className="text-pink-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
