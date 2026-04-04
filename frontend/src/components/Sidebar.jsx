import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, FileText } from 'lucide-react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function Sidebar() {
  const token = Cookies.get('token');
  let role = 'STAFF';
  try {
    if (token) {
      const decoded = jwtDecode(token);
      role = decoded.role || 'STAFF';
    }
  } catch(e) {}

  const logout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-primary-600/10 text-primary-500 font-semibold shadow-[0_0_10px_rgba(99,102,241,0.1)]' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-medium'
    }`;

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-full flex flex-col items-stretch px-4 py-6 shadow-2xl relative overflow-hidden z-20">
      {/* Subtle glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-primary-900/40 filter blur-3xl opacity-50 z-0 pointer-events-none"></div>

      <div className="relative z-10 text-2xl font-bold text-white mb-10 px-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <span className="text-white text-sm">AI</span>
        </div>
        <span className="tracking-tight">GrowthSys</span>
      </div>
      
      <nav className="flex-1 space-y-1 relative z-10">
        {role === 'ADMIN' && (
          <NavLink to="/dashboard" className={navClass} end>
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" /> Dashboard
          </NavLink>
        )}
        <NavLink to="/sales" className={navClass}>
          <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" /> Sales / POS
        </NavLink>
        {role === 'ADMIN' && (
          <>
            <NavLink to="/products" className={navClass}>
              <Package size={20} className="group-hover:scale-110 transition-transform" /> Products
            </NavLink>
            <NavLink to="/customers" className={navClass}>
              <Users size={20} className="group-hover:scale-110 transition-transform" /> Customers
            </NavLink>
          </>
        )}
        <NavLink to="/orders" className={navClass}>
          <FileText size={20} className="group-hover:scale-110 transition-transform" /> Order History
        </NavLink>
      </nav>

      <button onClick={logout} className="relative z-10 flex items-center justify-center gap-3 w-full py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 font-medium mt-auto transition-colors group">
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
      </button>
    </div>
  );
}
