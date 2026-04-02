import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Search, X } from 'lucide-react';
import api from '../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', costPrice: '', stockQuantity: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10)
      };

      if (currentId) {
        await api.put(`/products/${currentId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Error saving product. Please check console.');
    }
  };

  const editProduct = (p) => {
    setCurrentId(p.id);
    setFormData(p);
    setShowForm(true);
  };

  const deleteProduct = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const openNewForm = () => {
    setCurrentId(null);
    setFormData({ name: '', category: '', price: '', costPrice: '', stockQuantity: '' });
    setShowForm(true);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in-up relative h-full flex flex-col">
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-900 tracking-tight flex items-center gap-3">
            <Package size={32} className="text-primary-500" /> Inventory
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your products and stock levels</p>
        </div>
        <button onClick={openNewForm} className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transform active:scale-[0.98] transition-all">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="flex-1 glass p-6 rounded-2xl flex flex-col min-h-0">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products by name or category..." 
            className="w-full bg-white/70 pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-auto rounded-xl border border-slate-200/60 shadow-inner bg-slate-50/50">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-100/80 text-slate-600 text-sm border-b border-slate-200 sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="p-5 font-semibold">Name</th>
                <th className="p-5 font-semibold">Category</th>
                <th className="p-5 font-semibold">Selling Price</th>
                <th className="p-5 font-semibold">Cost Price</th>
                <th className="p-5 font-semibold">Stock</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 bg-white/40">
              {loading ? (
                <tr><td colSpan="6" className="text-center p-8 text-slate-500 font-medium animate-pulse">Loading inventory...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-8 text-slate-500 font-medium">No products found. Start by adding one!</td></tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-white/80 transition-colors group">
                    <td className="p-5 font-semibold text-slate-800">{p.name}</td>
                    <td className="p-5">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">{p.category}</span>
                    </td>
                    <td className="p-5 text-primary-700 font-bold">${p.price?.toFixed(2)}</td>
                    <td className="p-5 text-slate-500 font-medium">${p.costPrice?.toFixed(2) || '0.00'}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center w-fit gap-1.5 ${p.stockQuantity > 15 ? 'bg-emerald-100 text-emerald-700' : p.stockQuantity > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.stockQuantity > 15 ? 'bg-emerald-500' : p.stockQuantity > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        {p.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => editProduct(p)} className="text-indigo-500 hover:text-indigo-700 transition-colors p-2 hover:bg-indigo-50 rounded-lg" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="text-rose-500 hover:text-rose-700 transition-colors p-2 hover:bg-rose-50 rounded-lg" title="Delete">
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
            <h3 className="font-bold text-2xl text-slate-800 mb-6">{currentId ? 'Edit Product' : 'Add New Product'}</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
                <input placeholder="e.g. Wireless Headphones" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <input placeholder="e.g. Electronics" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required/>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Selling Price ($)</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cost Price ($)</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock Quantity</label>
                <input type="number" min="0" placeholder="0" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} required/>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-6 py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all">Cancel</button>
              <button type="submit" className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transform active:scale-[0.98] transition-all">
                {currentId ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
