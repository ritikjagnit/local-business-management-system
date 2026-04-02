import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Search, X, MapPin } from 'lucide-react';
import api from '../api/axios';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email ? formData.email : null,
        phone: formData.phone ? formData.phone : null
      };
      await api.post('/customers', payload);
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '' });
      fetchCustomers();
    } catch (err) { 
      console.error('Failed to save', err); 
      alert('Error saving customer. Check console.');
    }
  };

  const deleteCustomer = async (id) => {
    if(!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) { console.error('Failed to delete', err); }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6 animate-fade-in-up relative h-full flex flex-col">
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-900 tracking-tight flex items-center gap-3">
            <Users size={32} className="text-primary-500" /> Customers
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your customer relationships and data</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transform active:scale-[0.98] transition-all">
          <Plus size={20} /> Add Customer
        </button>
      </div>

      <div className="flex-1 glass p-6 rounded-2xl flex flex-col min-h-0">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search customers by name, email, or phone..." 
            className="w-full bg-white/70 pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-auto rounded-xl border border-slate-200/60 shadow-inner bg-slate-50/50">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-100/80 text-slate-600 text-sm border-b border-slate-200 sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="p-5 font-semibold">Customer Name</th>
                <th className="p-5 font-semibold">Email Address</th>
                <th className="p-5 font-semibold">Phone Number</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 bg-white/40">
              {loading ? (
                <tr><td colSpan="4" className="text-center p-8 text-slate-500 font-medium animate-pulse">Loading customers...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-8 text-slate-500 font-medium">No customers found. Start by adding one!</td></tr>
              ) : (
                filteredCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-white/80 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-600">{c.email ? <a href={`mailto:${c.email}`} className="hover:text-primary-600 transition-colors">{c.email}</a> : <span className="text-slate-400 italic">N/A</span>}</td>
                    <td className="p-5 text-slate-600">{c.phone || <span className="text-slate-400 italic">N/A</span>}</td>
                    <td className="p-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteCustomer(c.id)} className="text-rose-500 hover:text-rose-700 transition-colors p-2 hover:bg-rose-50 rounded-lg" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-slate-100">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
            <h3 className="font-bold text-2xl text-slate-800 mb-6 flex items-center gap-2">
              <Users className="text-primary-500" /> Add New Customer
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input placeholder="e.g. John Doe" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input type="email" placeholder="e.g. john@example.com" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input placeholder="e.g. +1 (555) 000-0000" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-6 py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all">Cancel</button>
              <button type="submit" className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transform active:scale-[0.98] transition-all">
                Create Customer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
