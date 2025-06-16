import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

      const res = await axios.post('/users/login', { email, password });
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/createJob');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900 text-white overflow-hidden">
      {/* Polygon 1 */}
      <div className="absolute w-40 h-40 bg-blue-500 opacity-20 animate-polygonMove1 polygonShape" />

      {/* Polygon 2 */}
      <div className="absolute w-32 h-32 bg-pink-500 opacity-20 animate-polygonMove2 polygonShape" />

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="z-10 bg-gray-800 p-10 rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl mb-6 font-semibold text-center">Login</h2>
        
        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 border border-gray-600 p-3 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Input with Eye Toggle */}
        <div className="mb-6 relative">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 border border-gray-600 p-3 pr-10 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-10 right-3 text-gray-300 hover:text-white focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Login
        </button>
      </form>

      {/* Keyframes and clip-path for polygons */}
      <style>
        {`
          .polygonShape {
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          }

          @keyframes polygonMove1 {
            0% { top: 10%; left: 10%; transform: rotate(0deg); }
            50% { top: 60%; left: 70%; transform: rotate(180deg); }
            100% { top: 10%; left: 10%; transform: rotate(360deg); }
          }

          @keyframes polygonMove2 {
            0% { top: 80%; left: 80%; transform: rotate(0deg); }
            50% { top: 20%; left: 30%; transform: rotate(-180deg); }
            100% { top: 80%; left: 80%; transform: rotate(-360deg); }
          }

          .animate-polygonMove1 {
            animation: polygonMove1 18s ease-in-out infinite;
          }

          .animate-polygonMove2 {
            animation: polygonMove2 22s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
