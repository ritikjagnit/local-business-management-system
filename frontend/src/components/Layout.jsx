import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Cookies from 'js-cookie';

export default function Layout() {
  const token = Cookies.get('token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200/50 flex items-center px-8 justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)] sticky top-0 z-20">
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Overview</h2>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/30 cursor-pointer ring-2 ring-white">
              U
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
