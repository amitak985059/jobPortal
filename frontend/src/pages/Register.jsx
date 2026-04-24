import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const result = await register(form);
    if (!result.success) setErrorMsg(result.error || 'Registration failed.');
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0F172A] text-white overflow-hidden px-4">
      <div className="absolute w-96 h-96 bg-blue-600 rounded-full opacity-5 -top-20 -left-20 blur-3xl pointer-events-none" />
      <div className="absolute w-72 h-72 bg-purple-600 rounded-full opacity-5 -bottom-10 -right-10 blur-3xl pointer-events-none" />

      <div className="z-10 w-full max-w-md bg-[#1E293B] border border-gray-800/50 p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-2">Create Account</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Join thousands finding their dream job</p>

        {errorMsg && (
          <div className="mb-5 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Full Name</label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange} required
              placeholder="Amit Kumar"
              className="w-full bg-[#0F172A] border border-gray-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange} required
              placeholder="you@example.com"
              className="w-full bg-[#0F172A] border border-gray-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Password</label>
            <input
              type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
              placeholder="Min. 6 characters"
              className="w-full bg-[#0F172A] border border-gray-700/50 rounded-2xl px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-gray-400 hover:text-white">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
