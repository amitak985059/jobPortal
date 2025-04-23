import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Optional: for icons

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <Link to="/">
          <h1 className="text-3xl font-bold text-white">SoftwareJobs.com</h1>
        </Link>
        {/* Mobile menu toggle button */}
        <button
          className="text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {/* Desktop menu */}
        <ul className="hidden md:flex items-center space-x-6">
          <li><Link to="/" className="text-white hover:text-gray-300">Home</Link></li>
          <li><Link to="/about" className="text-white hover:text-gray-300">About Us</Link></li>
          <li><Link to="/contactus" className="text-white hover:text-gray-300">Contact Us</Link></li>
          <li><Link to="/login" className="text-white hover:text-gray-300">Admin Login</Link></li>
        </ul>
      </div>

      {/* Mobile menu (visible when isOpen is true) */}
      {isOpen && (
        <ul className="flex flex-col mt-4 space-y-3 md:hidden">
          <li><Link to="/" onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">Home</Link></li>
          <li><Link to="/about" onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">About Us</Link></li>
          <li><Link to="/contactus" onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">Contact Us</Link></li>
          <li><Link to="/login" onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">Admin Login</Link></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
