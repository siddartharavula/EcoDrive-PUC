import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Overdue from "./pages/Overdue";
import Track from "./pages/Track";
import Upload from "./pages/Upload";

const App = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/overdue" element={<Overdue />} />
        <Route path="/track" element={<Track />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;