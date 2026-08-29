import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../Services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response:", response.data);

      // Save token
      localStorage.setItem("token", response.data.token);

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);

      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl bg-white grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">
        {/* Left Side - StyleHive */}
        <div className="flex items-center justify-center bg-[#F8F5F2] px-12">
          <div className="text-center">
            {/* Hanger Icon */}
            <div className="flex justify-center mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="#C58F88"
                className="w-16 h-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v3m0 0c-1.5 0-2.5 1-2.5 2.2 0 1.2 1 2.1 2.5 2.8m0-5c1.5 0 2.5 2.2 2.5 2.2 0 1.2-1 2.1-2.5 2.8m0 0L3.5 14.5a1 1 0 0 0 .5 1.9h16a1 1 0 0 0 .5-1.9L12 8"
                />
              </svg>
            </div>

            <p className="text-lg tracking-[6px] text-[#1A1A1A] mb-5">
              WELCOME BACK TO
            </p>

            <h2 className="text-6xl font-serif font-medium tracking-tight">
              <span className="text-[#111111]">Style</span>
              <span className="text-[#C58F88]">Hive</span>
            </h2>

            <div className="flex items-center justify-center gap-4 my-8">
              <div className="w-24 h-[1px] bg-[#C58F88]"></div>

              <span className="text-[#C58F88] text-xl">✦</span>

              <div className="w-24 h-[1px] bg-[#C58F88]"></div>
            </div>

            <p className="text-lg tracking-[5px] text-[#1A1A1A]">YOUR STYLE.</p>

            <p className="text-lg tracking-[5px] text-[#1A1A1A] mt-4">
              YOUR HIVE.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center px-8 py-12 md:px-14">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-[#1A1A1A]">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Login to your StyleHive account.
              </p>
            </div>

            {/* Message */}
            {message && (
              <p
                className={`mb-5 text-center font-medium ${
                  message === "Login successful!"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-[#D8A19B] transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-[#D8A19B] transition"
                />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <NavLink
                  to="/forgot-password"
                  className="text-sm text-[#C58F88] hover:underline"
                >
                  Forgot Password?
                </NavLink>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#0F1115] text-white py-3 rounded-md font-medium tracking-wide hover:bg-[#D8A19B] transition duration-300"
              >
                LOGIN
              </button>
            </form>

            {/* Register */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <NavLink
                  to="/register"
                  className="text-[#C58F88] font-medium hover:underline"
                >
                  Create Account
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
