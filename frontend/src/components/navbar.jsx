
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem("ecodriveToken");
        const savedUser = localStorage.getItem("ecodriveUser");

        if (!token || !savedUser) {
          setUser(null);
          return;
        }

        const parsedUser = JSON.parse(savedUser);

        setUser({
          ...parsedUser,
          role: parsedUser.role?.trim().toLowerCase(),
        });
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      }
    };

    loadUser();

    // Update navbar when login/logout changes are announced.
    window.addEventListener("storage", loadUser);
    window.addEventListener("ecodrive-auth-change", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("ecodrive-auth-change", loadUser);
    };
  }, [location.pathname]);

  const roleLinks = {
    user: [
      { name: "Home", path: "/" },
      { name: "Track", path: "/track" },
    ],

    puc_updater: [
      { name: "Home", path: "/" },
      { name: "Upload", path: "/upload" },
    ],

    police: [
      { name: "Home", path: "/" },
      { name: "Overdue", path: "/overdue" },
    ],

    admin: [
      { name: "Home", path: "/" },
      { name: "Track", path: "/track" },
      { name: "Upload", path: "/upload" },
      { name: "Overdue", path: "/overdue" },
    ],
  };

  const links = user
    ? roleLinks[user.role] || [{ name: "Home", path: "/" }]
    : [{ name: "Home", path: "/" }];

  const handleLogout = () => {
    localStorage.removeItem("ecodriveToken");
    localStorage.removeItem("ecodriveUser");

    setUser(null);
    setDropdownOpen(false);

    window.dispatchEvent(new Event("ecodrive-auth-change"));

    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800 px-6 md:px-12 py-4">
      <div className="mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={Logo}
            alt="EcoDrive Logo"
            className="w-10 h-10 object-contain"
          />

          <h1 className="text-2xl font-bold text-green-500">
            ecoDrive
          </h1>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-5 py-2 rounded-xl border font-medium transition ${
                location.pathname === link.path
                  ? "bg-green-500 text-white border-green-500"
                  : "text-gray-300 border-gray-800 hover:bg-gray-800 hover:text-green-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* User dropdown / Login */}
        <div className="relative">
          {!user ? (
            <Link
              to="/login"
              className="bg-gray-800 border border-gray-700 text-white px-5 py-2 rounded-lg hover:bg-green-500 hover:border-green-500 transition"
            >
              Log In
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-white px-5 py-2 rounded-lg hover:border-green-500 transition"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span className="text-green-400 font-semibold">
                  {user.name}
                </span>

                <span className="text-gray-400 text-sm">
                  {dropdownOpen ? "▲" : "▼"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">

                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-white font-semibold truncate">
                      {user.name}
                    </p>

                    <p className="text-gray-400 text-xs truncate mt-1">
                      {user.email}
                    </p>

                    <p className="text-green-400 text-xs mt-2 capitalize">
                      {user.role?.replace("_", " ") || "Unknown role"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 transition font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-4 flex-wrap">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
              location.pathname === link.path
                ? "bg-green-500 text-white border-green-500"
                : "text-gray-300 border-gray-800 hover:bg-gray-800"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
