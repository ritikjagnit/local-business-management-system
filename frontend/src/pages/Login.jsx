import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/authenticate';
      const payload = isRegister ? { username, password, role: 'SHOP_OWNER' } : { username, password };
      const res = await axios.post(`http://localhost:8080${endpoint}`, payload);
      Cookies.set('token', res.data.token, { expires: 1 });
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Authentication blocked. Try creating a new account.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Authentication failed. Please verify credentials or create a new account.');
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 animate-gradient-x p-4">
      <div className="w-full max-w-md glass animate-fade-in-up rounded-2xl overflow-hidden relative">
        {/* Decorative blur blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
        
        <div className="bg-white/10 backdrop-blur-md p-8 text-center border-b border-white/20 relative z-10 text-white">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">GrowthSystem</h2>
          <p className="text-primary-200 text-sm font-medium">AI-Powered Business Management</p>
        </div>
        
        <div className="p-8 relative z-10 bg-white/40">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h3>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50/80 p-3 rounded-lg border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-11 pr-4 py-3 bg-white/70 border border-white/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-11 pr-4 py-3 bg-white/70 border border-white/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transform active:scale-[0.98] transition-all"
            >
              {isRegister ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <div className="mt-8 text-center text-sm font-medium text-gray-600">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsRegister(!isRegister)} className="text-primary-600 hover:text-primary-800 font-bold hover:underline transition-colors">
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
