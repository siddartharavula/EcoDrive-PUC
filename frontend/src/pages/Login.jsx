import React, { useState } from "react";
import Home from "./Home"
import { Link } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">

      <Link className="border-white rounded-3xl bg-green-500 px-5 font-medium items-end py-1 mb-3"
        to="/">Home</Link>

      {/* Logo */}
      <h1 className="text-5xl font-bold text-green-500 mb-8">
        ecoDrive
      </h1>

      {/* Card */}
      <div className="w-105 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* Tabs */}
        <div className="relative flex bg-gray-700">

          <div
            className={`absolute top-0 h-full w-1/2 bg-green-500 transition-all duration-300 ${
              login ? "left-0" : "left-1/2"
            }`}
          ></div>

          <button
            onClick={() => setLogin(true)}
            className={`relative z-10 w-1/2 py-4 font-semibold transition-colors duration-300 ${
              login ? "text-white" : "text-gray-300"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setLogin(false)}
            className={`relative z-10 w-1/2 py-4 font-semibold transition-colors duration-300 ${
              !login ? "text-white" : "text-gray-300"
            }`}
          >
            Register
          </button>

        </div>

        {/* Form */}
        <div
          key={login}
          className="p-8 transition-all duration-300"
        >
          {login ? (
            <form className="space-y-5">

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <button className="w-full py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition">
                Login
              </button>

            </form>
          ) : (
            <form className="space-y-5">
              <label className="font-medium px-2">Name</label>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <label className="font-medium px-2">Phone No.</label>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <label className="font-medium px-2">Vahicle Type</label>
              <select
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-500"
              >
                <option>Car</option>
                <option>Bike</option>
                <option>Auto</option>
                <option>Bus</option>
                <option>Truck</option>
              </select>

              <label className="font-medium px-2">Vachicle No.</label>
              <input
                type="text"
                placeholder="Vehicle Number"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <label className="font-medium px-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <button className="w-full py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition">
                Register
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;