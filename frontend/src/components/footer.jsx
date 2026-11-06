
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400 px-6 md:px-16 py-10">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        <div>
          <h1 className="text-2xl font-bold text-green-500">
            ecoDrive
          </h1>
          <p className="mt-4 leading-7 max-w-sm">
            Promoting cleaner transportation through smart vehicle
            emission tracking and timely PUC reminders.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-4">
            Quick Links
          </h2>

          <div className="flex flex-col gap-3">
            <Link className="hover:text-green-400" to="/">Home</Link>
            <Link className="hover:text-green-400" to="/track">Track</Link>
            <Link className="hover:text-green-400" to="/upload">Upload</Link>
            <Link className="hover:text-green-400" to="/overdue">Overdue</Link>
          </div>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-4">
            Contact
          </h2>
          <p>support@ecodrive.com</p>
          <p className="mt-3">Hyderabad, India</p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 text-center text-sm">
        © 2026 ecoDrive. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;
