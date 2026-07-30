import React from 'react'
import { Routes, Route, useLocation} from 'react-router-dom'
import Navbar from "./components/navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Overdue from "./pages/Overdue"
import Track from "./pages/Track"
import Upload from "./pages/Upload"

const App = () => {
  return (
    <div>
      <div className="bg-gray-900 text-white content-center ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/overdue" element={<Overdue />} />
          <Route path="/track" element={<Track />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  )
}

export default App