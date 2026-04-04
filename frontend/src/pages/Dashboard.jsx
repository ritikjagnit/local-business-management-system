import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, AlertTriangle, Lightbulb, Zap, Users, ShoppingBag } from 'lucide-react';
import api from '../api/axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function Dashboard() {
  const [aiData, setAiData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [stats, setStats] = useState({ customers: 0, products: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [predictRes, insightsRes, custRes, prodRes] = await Promise.all([
          api.get('/ai/predict-sales'),
          api.get('/ai/insights'),
          api.get('/customers'),
          api.get('/products')
        ]);
        setAiData(predictRes.data);
        setInsights(insightsRes.data.insights);
        setStats({
          customers: custRes.data.length,
          products: prodRes.data.length
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchDashboardData();

    // WebSocket real-time updates
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-endpoint'),
      onConnect: () => {
        client.subscribe('/topic/sales', (message) => {
          fetchDashboardData(); // Refreshes stats and chart automatically!
        });
      },
    });
    client.activate();

    return () => client.deactivate();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/50 gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Your business performance at a glance</p>
        </div>
        <div className="bg-gradient-to-r from-primary-500/10 to-indigo-500/10 text-primary-700 px-6 py-3 rounded-full font-bold flex items-center gap-2.5 text-sm border border-primary-100 shadow-sm transition-all hover:shadow-md hover:bg-primary-500/15 cursor-default relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <Zap size={18} className="animate-pulse text-amber-500 fill-amber-500" /> AI Engine Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-3xl border-b-4 border-b-primary-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center justify-between">
            Weekly Revenue <div className="p-2 bg-primary-50 rounded-xl text-primary-600"><TrendingUp size={16}/></div>
          </div>
          <div className="text-4xl font-black text-slate-800 mb-3 tracking-tight">₹12,500</div>
          <div className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
            <TrendingUp size={14} strokeWidth={3} /> +12.5% vs last week
          </div>
        </div>
        
        <div className="glass p-6 rounded-3xl border-b-4 border-b-fuchsia-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 opacity-5 text-fuchsia-900 group-hover:rotate-12 transition-transform duration-500"><Lightbulb size={140} /></div>
          <div className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center justify-between">
            AI Predicted Growth <div className="p-2 bg-fuchsia-50 rounded-xl text-fuchsia-600"><Zap size={16}/></div>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-500 mb-3 tracking-tight">
            {aiData?.predictedIncrease || '...'}
          </div>
          <div className="text-slate-500 text-xs font-semibold flex items-center gap-1.5 w-fit px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <Lightbulb size={14} className="text-fuchsia-500" /> Based on 6mo history
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border-b-4 border-b-emerald-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center justify-between">
            Active Customers <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Users size={16}/></div>
          </div>
          <div className="text-4xl font-black text-slate-800 mb-3 tracking-tight">{stats.customers}</div>
          <div className="text-slate-500 text-xs font-semibold flex items-center gap-1.5 w-fit px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            Current Database
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border-b-4 border-b-amber-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center justify-between">
            Products Catalog <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><ShoppingBag size={16}/></div>
          </div>
          <div className="text-4xl font-black text-slate-800 mb-3 tracking-tight">{stats.products}</div>
          <div className="text-amber-600 text-xs font-bold flex items-center gap-1.5 w-fit px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200/50">
            <AlertTriangle size={14} strokeWidth={3} /> Requires Attention
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-400/10 to-transparent rounded-full filter blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700"></div>
          <h3 className="font-extrabold text-slate-800 mb-8 text-xl tracking-tight">Monthly Sales Trajectory</h3>
          <div className="h-[350px]">
            {aiData?.historicalData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aiData.historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 13}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 13}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 700, color: '#0f172a', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#4f46e5', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorSales)" activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5', style: {filter: 'drop-shadow(0px 4px 6px rgba(79,70,229,0.5))'} }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-sm">Synthesizing Data...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-indigo-500 via-primary-600 to-purple-700 p-8 rounded-3xl shadow-lg border border-primary-400/30 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="text-white/80 font-bold mb-2 flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <AlertTriangle size={14} className="animate-pulse" /> Critical Action
            </div>
            <div className="text-lg font-bold leading-snug drop-shadow-sm">
              {aiData?.recommendedAction || 'Loading critical AI recommendation...'}
            </div>
            <button className="mt-5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors border border-white/20 hover:border-white/40">
              Apply Recommendation
            </button>
          </div>

          <div className="glass p-8 rounded-3xl flex-1 flex flex-col">
            <h3 className="font-extrabold text-slate-800 mb-6 text-lg tracking-tight flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 bg-amber-100 rounded-xl"><Lightbulb className="text-amber-500 fill-amber-500" size={20} /></div> 
              Automated Insights
            </h3>
            <ul className="space-y-4 flex-1">
              {insights ? insights.map((insight, idx) => (
                <li key={idx} className="bg-slate-50 hover:bg-indigo-50/50 p-4 rounded-2xl text-sm text-slate-700 hover:text-indigo-900 border border-slate-100 hover:border-indigo-100 font-semibold shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex gap-3 items-start">
                   <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-[10px] font-black">{idx+1}</div>
                  <span className="leading-relaxed pt-0.5">{insight}</span>
                </li>
              )) : (
                <li className="flex gap-3 animate-pulse pt-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-full mt-1"></div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
