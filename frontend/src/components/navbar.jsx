import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "../assets/logo.png"

const Navbar = () => {
  return (
    <div className="bg-black flex justify-between items-center px-6 py-4 ">
      <h1 className="text-green-500 text-2xl font-bold px-4 flex gap-1">
        <img 
        className='w-12 h-10 object-contain gap '
        src={Logo} alt="Logo" />
        ecoDrive
      </h1>

      <div className="flex gap-20 text-white font-medium">
        <Link 
        className="hover:text-white font-medium text-white px-5 border border-white py-1 rounded-3xl bg-gray-800 hover:bg-green-500" 
        to="/">Home</Link>
        <Link 
        className="hover:text-white font-medium text-white px-5 border border-white py-1 rounded-3xl bg-gray-800 hover:bg-green-500" 
        to="/track">Track</Link>
        <Link 
        className="hover:text-white font-medium text-white px-5 border border-white py-1 rounded-3xl bg-gray-800 hover:bg-green-500" 
        to="/upload">Upload</Link>
        <Link 
        className="hover:text-white font-medium text-white px-5 border border-white py-1 rounded-3xl bg-gray-800 hover:bg-green-500" 
        to="/overdue">Overdue</Link>
      </div>
      <div>
        <Link 
        className="hover:text-white font-medium text-white px-5 border border-white py-1 rounded-3xl bg-gray-800 hover:bg-green-500" 
        to="/login">Log In</Link>
      </div>
    </div>
  )
}

export default Navbar