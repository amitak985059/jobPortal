import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Bookmark } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, authUser, logout } = useAuthContext();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">SJ</div>
          <h1 className="text-xl font-extrabold text-white">SoftwareJobs<span className="text-blue-500">.com</span></h1>
        </Link>

        {/* Mobile toggle */}
        <button className="text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-6">
          <li><Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">Home</Link></li>
          <li><Link to="/about" className="text-gray-300 hover:text-white font-medium transition-colors">About</Link></li>
          <li><Link to="/contactus" className="text-gray-300 hover:text-white font-medium transition-colors">Contact</Link></li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/saved-jobs" className="flex items-center gap-1.5 text-gray-300 hover:text-yellow-400 font-medium transition-colors">
                  <Bookmark size={16} /> Saved Jobs
                </Link>
              </li>
              {authUser?.role === 'admin' && (
                <li><Link to="/createJob" className="text-gray-300 hover:text-white font-medium transition-colors">Admin</Link></li>
              )}
              <li>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Hi, <span className="text-white font-semibold">{authUser?.name?.split(' ')[0]}</span></span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-500/50 text-gray-300 hover:text-red-400 text-sm font-bold rounded-xl transition-all"
                  >Logout</button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">Login</Link></li>
              <li>
                <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                  Sign Up Free
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-800">
          <ul className="flex flex-col gap-4">
            <li><Link to="/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Home</Link></li>
            <li><Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">About</Link></li>
            <li><Link to="/contactus" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Contact</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/saved-jobs" onClick={() => setIsOpen(false)} className="text-yellow-400 font-medium">★ Saved Jobs</Link></li>
                {authUser?.role === 'admin' && (
                  <li><Link to="/createJob" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Admin</Link></li>
                )}
                <li><button onClick={() => { logout(); setIsOpen(false); }} className="text-red-400 font-bold">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Login</Link></li>
                <li><Link to="/register" onClick={() => setIsOpen(false)} className="text-blue-400 font-bold">Sign Up Free →</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
