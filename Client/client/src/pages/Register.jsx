import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../Services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    PhoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  
  const [message, setMessage] = useState("");

 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

  
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      
      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        PhoneNumber: formData.PhoneNumber,
        password: formData.password,
      });

      console.log(response.data);

      
      setMessage("Account created successfully!");

      
      setFormData({
        name: "",
        email: "",
        PhoneNumber: "",
        password: "",
        confirmPassword: "",
      });

   
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.log(error);

     
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-6xl bg-white grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">

        {/* LEFT SIDE */}
        <div className="flex items-center justify-center bg-[#F8F5F2] px-12">
          <div className="text-center">

           
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
              WELCOME TO
            </p>

            <h2 className="text-6xl font-serif font-medium tracking-tight">
              <span className="text-[#111111]">Style</span>
              <span className="text-[#C58F88]">Hive</span>
            </h2>

            <div className="flex items-center justify-center gap-4 my-8">
              <div className="w-24 h-[1px] bg-[#C58F88]"></div>

              <span className="text-[#C58F88] text-xl">
                ✦
              </span>

              <div className="w-24 h-[1px] bg-[#C58F88]"></div>
            </div>

            <p className="text-lg tracking-[5px] text-[#1A1A1A]">
              DISCOVER YOUR STYLE.
            </p>

            <p className="text-lg tracking-[5px] text-[#1A1A1A] mt-4">
              DEFINE YOUR LOOK.
            </p>

          </div>
        </div>


        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-8 py-12 md:px-14">

          <div className="w-full max-w-md">

            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-[#1A1A1A]">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Create your StyleHive account and start shopping.
              </p>
            </div>


           
            {message && (
              <p
                className={`mb-5 text-center font-medium ${
                  message === "Account created successfully!"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}


            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

           
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-[#D8A19B] transition"
                />
              </div>


          
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


           
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="PhoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-[#D8A19B] transition"
                />
              </div>


            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-[#D8A19B] transition"
                />
              </div>


            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-md outline-none focus:border-[#D8A19B] transition"
                />
              </div>


           
              <button
                type="submit"
                className="w-full bg-[#0F1115] text-white py-3 rounded-md font-medium tracking-wide hover:bg-[#D8A19B] transition duration-300"
              >
                CREATE ACCOUNT
              </button>

            </form>


            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}

                <NavLink
                  to="/login"
                  className="text-[#C58F88] font-medium hover:underline"
                >
                  Login
                </NavLink>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Register;