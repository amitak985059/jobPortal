import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Bookmark, User } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, authUser, logout } = useAuthContext();
  const location = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`font-medium transition-colors ${location.pathname === to ? "text-white" : "text-gray-400 hover:text-white"}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-[#0B1222] border-b border-gray-800/70 px-4 py-3 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-900/40">
            SJ
          </div>
          <h1 className="text-lg font-extrabold text-white">
            Software<span className="text-blue-500">Jobs</span>.com
          </h1>
        </Link>

        {/* Mobile toggle */}
        <button
          className="text-white md:hidden p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-5">
          <li>{navLink("/", "Home")}</li>
          <li>{navLink("/about", "About")}</li>
          <li>{navLink("/contactus", "Contact")}</li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/saved-jobs"
                  className={`flex items-center gap-1.5 font-medium transition-colors ${location.pathname === "/saved-jobs" ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"}`}
                >
                  <Bookmark size={15} />
                  Saved
                </Link>
              </li>
              {authUser?.role === "admin" && (
                <li>{navLink("/createJob", "Admin")}</li>
              )}
              {/* Profile avatar button */}
              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 bg-[#1E293B] hover:bg-[#243147] border border-gray-700/50 hover:border-blue-500/40 rounded-xl px-3 py-1.5 transition-all group"
                  title="View Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    {authUser?.name?.[0]?.toUpperCase() || <User size={12} />}
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white font-semibold">
                    {authUser?.name?.split(" ")[0]}
                  </span>
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-500/50 text-gray-400 hover:text-red-400 text-sm font-bold rounded-xl transition-all"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>{navLink("/login", "Login")}</li>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
                >
                  Sign Up Free
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-3 pt-4 border-t border-gray-800/70 px-1">
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white font-medium"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contactus"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white font-medium"
              >
                Contact
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/saved-jobs"
                    onClick={() => setIsOpen(false)}
                    className="text-yellow-400 font-semibold"
                  >
                    ★ Saved Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-blue-400 font-semibold"
                  >
                    👤 Profile
                  </Link>
                </li>
                {authUser?.role === "admin" && (
                  <li>
                    <Link
                      to="/createJob"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-300 hover:text-white font-medium"
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-red-400 font-bold"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-white font-medium"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-blue-400 font-bold"
                  >
                    Sign Up Free →
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
