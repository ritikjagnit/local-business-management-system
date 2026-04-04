import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, ShoppingBag, Calendar } from 'lucide-react';
import api from '../api/axios';
import jsPDF from 'jspdf';

export default function Orders() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get('/sales');
        // Assume API returns array of sales
        setSales(res.data.sort((a,b) => b.id - a.id));
      } catch (err) {
        console.error('Failed to fetch sales', err);
      } finally { setLoading(false); }
    };
    fetchSales();
  }, []);

  const downloadPDF = (sale) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("STORE RECEIPT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt ID: #${sale.id}`, 20, 30);
    doc.text(`Date: ${new Date(sale.date || Date.now()).toLocaleString()}`, 20, 36);
    if (sale.customer) {
      doc.text(`Customer: ${sale.customer.name} (${sale.customer.phone})`, 20, 42);
    }
    
    doc.line(20, 48, 190, 48);
    
    doc.setFont("helvetica", "bold");
    doc.text("Product", 20, 56);
    doc.text("Qty", 120, 56);
    doc.text("Price", 150, 56);
    doc.text("Total", 180, 56, { align: "right" });
    
    doc.line(20, 58, 190, 58);

    let y = 66;
    doc.setFont("helvetica", "normal");
    sale.items.forEach(item => {
      const productName = item.product?.name || 'Unknown Product';
      doc.text(productName, 20, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(`₹${item.priceAtSale.toFixed(2)}`, 150, y);
      doc.text(`₹${(item.priceAtSale * item.quantity).toFixed(2)}`, 190, y, { align: "right" });
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 10;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Grand Total:", 140, y);
    doc.text(`₹${sale.totalAmount.toFixed(2)}`, 190, y, { align: "right" });
    
    doc.save(`Order_${sale.id}_Bill.pdf`);
  };

  const filteredSales = sales.filter(s => 
    s.id.toString().includes(search) || 
    (s.customer && s.customer.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/50">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 tracking-tight">Order History</h1>
          <p className="text-slate-500 font-medium mt-1">Review past transactions and generate bills</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="mb-6 relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Name..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/70 pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
          />
        </div>

        <div className="overflow-hidden bg-white/50 rounded-2xl border border-slate-200/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-200/60 text-slate-500 text-xs uppercase tracking-widest">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Date & Time</th>
                <th className="p-4 font-bold">Items</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center p-8 text-slate-500 animate-pulse">Loading orders...</td></tr>
              ) : filteredSales.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-8 text-slate-500">No matching orders found.</td></tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-4 font-bold text-slate-800">#{sale.id}</td>
                    <td className="p-4 font-medium text-slate-700">
                      {sale.customer ? (
                        <div className="flex flex-col">
                          <span>{sale.customer.name}</span>
                          <span className="text-xs text-slate-400">{sale.customer.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Walk-in</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium flex items-center gap-2">
                       <Calendar size={14} className="text-slate-400"/>
                       {new Date(sale.date || Date.now()).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-600">
                       <div className="flex items-center gap-1.5 bg-slate-100 w-fit px-2.5 py-1 rounded-lg">
                          <ShoppingBag size={14} className="text-slate-500"/>
                          {sale.items?.length || 0} items
                       </div>
                    </td>
                    <td className="p-4 font-bold text-indigo-700 text-lg">₹{sale.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => downloadPDF(sale)}
                        className="p-2 bg-white border border-slate-200 text-emerald-600 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 rounded-xl shadow-sm transition-all focus:scale-95 group-hover:shadow-md flex items-center justify-center"
                        title="Download Bill PDF"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
