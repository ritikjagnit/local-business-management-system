import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BarChart3, Zap, Smartphone, CheckCircle, ArrowRight, Store } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden selection:bg-primary-500 selection:text-white">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen overflow-hidden -z-10 bg-slate-50">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-indigo-200/40 to-primary-100/60 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/40 to-fuchsia-100/40 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-lg border-b border-white/50 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Store className="text-white" size={20} />
            </div>
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight">GrowthSys<span className="text-primary-600">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-primary-600 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block font-semibold text-slate-600 hover:text-primary-600 transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-95 flex items-center gap-2">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-slate-700">v2.0 with AI Analytics is live!</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 animate-fade-in-up animation-delay-100 leading-tight">
            Manage your local business <br className="hidden md:block" /> 
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Enterprise AI</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
            The all-in-one SaaS platform for GST Billing, POS, AI-driven stock insights, 
            and automated customer retention. Built for scale.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 hover:shadow-2xl hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-2 group">
              Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 shadow-sm rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
              View Demo
            </a>
          </div>
          
          {/* Mockup Image Array */}
          <div className="mt-20 relative mx-auto w-full max-w-5xl animate-fade-in-up animation-delay-500">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-50 relative z-20 h-32 bottom-0" style={{ marginTop: '-8rem'}}></div>
             <div className="glass p-4 rounded-3xl border border-white/60 shadow-2xl relative z-10 overflow-hidden transform rotate-x-12 perspective-1000 scale-105 hover:scale-110 transition-transform duration-700 ease-out">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80" alt="Dashboard Preview" className="rounded-2xl w-full h-[500px] object-cover" />
             </div>
          </div>
        </div>
      </main>

      {/* Features Showcase */}
      <section id="features" className="py-24 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight mb-6">Everything you need to grow</h2>
            <p className="text-lg text-slate-600">Ditch the spreadsheets. Automate your billing, get AI insights on dead stock, and retain customers with one powerful tool.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100', title: 'Lightning Fast POS', desc: 'Process sales in seconds. Includes integrated GST percentage and PDF invoice generation.' },
              { icon: BarChart3, color: 'text-indigo-500', bg: 'bg-indigo-100', title: 'Python AI Analytics', desc: 'Predict sales trends, track dead stock, and get actionable insights to maximize your profits.' },
              { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-100', title: 'Role-Based Access', desc: 'Secure your data. Assign ADMIN or STAFF roles to control who views critical metrics.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl border border-slate-100 hover:border-primary-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={feature.color} size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/30 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">Stop struggling with old software.</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">Join modern local businesses scaling their operations with AI-powered insights and seamless GST POS billing.</p>
            
            <Link to="/login" className="inline-flex px-8 py-4 bg-primary-500 text-white rounded-full font-bold text-lg hover:bg-primary-400 shadow-xl shadow-primary-500/20 transition-all relative z-10 active:scale-95">
              Launch Dashboard Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Store className="text-primary-600" size={24} />
            <span className="text-xl font-bold text-slate-800">GrowthSys</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 GrowthSystem MVP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
