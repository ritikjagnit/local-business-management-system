import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, CreditCard, Search, Tag, PackageOpen, UserCircle2, Phone, FileDown } from 'lucide-react';
import api from '../api/axios';
import jsPDF from 'jspdf';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    if (product.stockQuantity <= 0) return;
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) return;
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1, priceAtSale: product.price }]);
    }
  };

  const updateQuantity = (productId, amount) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + amount;
        if (newQ > item.product.stockQuantity) return item;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + (item.priceAtSale * item.quantity), 0);

  const generateReceiptPDF = (customerName, total) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("STORE RECEIPT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
    if (customerName) {
      doc.text(`Customer: ${customerName}`, 20, 36);
    }
    
    doc.line(20, 42, 190, 42); // Header line
    
    doc.setFont("helvetica", "bold");
    doc.text("Product", 20, 50);
    doc.text("Qty", 120, 50);
    doc.text("Price", 150, 50);
    doc.text("Total", 180, 50, { align: "right" });
    
    doc.line(20, 52, 190, 52);

    let y = 60;
    doc.setFont("helvetica", "normal");
    cart.forEach(item => {
      doc.text(item.product.name, 20, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(`$${item.priceAtSale.toFixed(2)}`, 150, y);
      doc.text(`$${(item.priceAtSale * item.quantity).toFixed(2)}`, 190, y, { align: "right" });
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 10;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Grand Total:", 140, y);
    doc.text(`$${total.toFixed(2)}`, 190, y, { align: "right" });
    
    doc.save(`Receipt_${Date.now()}.pdf`);
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      let customerId = null;
      if (customerInfo.name && customerInfo.phone) {
        try {
          const custRes = await api.post('/customers', customerInfo);
          customerId = custRes.data.id;
        } catch(cErr) {
          console.error("Failed to link customer", cErr);
        }
      }

      const total = calculateTotal();
      const payload = {
        totalAmount: total,
        items: cart.map(item => ({ product: { id: item.product.id }, quantity: item.quantity, priceAtSale: item.priceAtSale }))
      };
      if (customerId) {
        payload.customer = { id: customerId };
      }

      await api.post('/sales', payload);
      
      // Auto Download PDF Bill
      generateReceiptPDF(customerInfo.name, total);
      
      setCart([]);
      setCustomerInfo({ name: '', phone: '' });
      
      const res = await api.get('/products');
      setProducts(res.data);
      
      alert('Sale processed. Bill generating!');
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Checkout failed!');
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-fade-in-up">
      <div className="flex-[2] glass p-6 rounded-3xl flex flex-col min-h-0 border-t-4 border-t-primary-500 shadow-xl border-x border-b border-white/50">
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-4 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products to add to cart..." 
            className="w-full bg-white/70 pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm font-medium"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-auto pr-2 pb-2 -mr-2">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
            {loading ? <div className="text-slate-500 p-8 col-span-full text-center font-medium animate-pulse">Loading catalog...</div> : 
             filteredProducts.length === 0 ? <div className="text-slate-500 p-8 col-span-full text-center font-medium bg-white/40 rounded-xl border border-slate-200 border-dashed">No products matched your search.</div> :
             filteredProducts.map(p => (
              <div key={p.id} onClick={() => addToCart(p)} className={`relative group border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${p.stockQuantity === 0 ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white/60 hover:bg-white hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-800 tracking-tight leading-tight group-hover:text-primary-700 transition-colors">{p.name}</div>
                  <Tag size={16} className="text-primary-400" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 bg-slate-100 w-fit px-2 py-0.5 rounded-md">{p.category}</div>
                <div className="flex items-end justify-between mt-auto">
                  <div className="text-2xl font-black text-slate-800">${p.price?.toFixed(2)}</div>
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-md ${p.stockQuantity > 10 ? 'bg-emerald-100 text-emerald-700' : p.stockQuantity > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {p.stockQuantity === 0 ? 'Out of Stock' : `${p.stockQuantity} Left`}
                  </div>
                </div>
                {p.stockQuantity > 0 && <div className="absolute inset-0 border-2 border-primary-500 rounded-2xl rounded-2xl opacity-0 scale-95 group-active:opacity-100 group-active:scale-100 transition-all duration-200 pointer-events-none"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-[1.2] glass p-0 rounded-3xl flex flex-col h-full border-t-4 border-t-indigo-500 shadow-xl overflow-hidden relative border-x border-b border-white/50">
        <div className="p-6 border-b border-slate-200/60 bg-white/40 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
               <ShoppingCart size={20} />
             </div>
             <div>
               <h2 className="font-bold text-slate-800 tracking-tight text-lg">Current Order</h2>
               <p className="text-xs font-medium text-slate-500">{cart.length} unique items</p>
             </div>
          </div>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors"><FileDown size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-auto p-6 space-y-4 bg-slate-50/30">
          {cart.length === 0 ? 
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <PackageOpen size={48} className="opacity-40" />
              <div className="font-medium text-sm text-center px-8">Select products from the catalog to build an order.</div>
            </div> : 
           cart.map(item => (
            <div key={item.product.id} className="flex items-center justify-between bg-white/80 p-4 rounded-2xl border border-slate-200/60 shadow-sm animate-fade-in-up hover:border-indigo-200 transition-all" style={{animationDuration: '0.3s'}}>
              <div className="flex-1 pr-4">
                <div className="font-bold text-slate-800 line-clamp-1" title={item.product.name}>{item.product.name}</div>
                <div className="text-sm font-semibold text-indigo-600">${item.priceAtSale?.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-1 bg-slate-100/50 rounded-xl p-1 border border-slate-200/60">
                <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 shadow-sm transition-all focus:scale-95">
                  <Minus size={14} strokeWidth={3}/>
                </button>
                <div className="w-8 text-center font-bold text-slate-800 tabular-nums">{item.quantity}</div>
                <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm transition-all focus:scale-95">
                  <Plus size={14} strokeWidth={3}/>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/60 relative z-20">
          {/* Customer Capture Area */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><UserCircle2 size={12}/> Attach Customer (Optional)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                 <input type="text" placeholder="Full Name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm" />
              </div>
              <div className="relative">
                 <input type="text" placeholder="Phone Number" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-end mb-6">
              <div className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Total Selected</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 tracking-tight">${calculateTotal().toFixed(2)}</div>
            </div>
            <button onClick={checkout} disabled={cart.length === 0} className="w-full bg-gradient-to-r from-indigo-600 to-primary-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-indigo-500/20 transform active:scale-[0.98] transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]"></div>
              <CreditCard size={20} className="group-hover:rotate-6 transition-transform" /> Print Bill & Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
