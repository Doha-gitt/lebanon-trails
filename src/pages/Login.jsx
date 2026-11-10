import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setIsLoggedIn, setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    if (error) setError("");
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    if (error) setError("");
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate login success
    if (typeof setIsLoggedIn === "function") {
      setIsLoggedIn(true);
    }
    if (typeof setCurrentUser === "function") {
      setCurrentUser({ email, name: email.split("@")[0] });
    }

    // Ensure route exists in App.jsx
    navigate("/trails");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Login to Lebanon Trails
      </h2>
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={handleChangeEmail}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={handleChangePassword}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-emerald-600 font-medium hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}