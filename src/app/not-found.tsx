'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Home, Building2, Map, Layout, BookOpen, ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/property?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    { name: 'Properties', path: '/property', icon: <Building2 size={20} /> },
    { name: 'Land & Plots', path: '/land', icon: <Map size={20} /> },
    { name: 'Ready Flats', path: '/ready-flat', icon: <Layout size={20} /> },
    { name: 'Insights & Blog', path: '/blog', icon: <BookOpen size={20} /> }
  ];

  const floatingVariants: any = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  const floatReverseVariants: any = {
    animate: {
      y: [0, 15, 0],
      transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center relative overflow-hidden pt-20 pb-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#1E466B]/5 to-transparent blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#D4AF37]/10 to-transparent blur-3xl"></div>
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-8"
        >
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e2e8f0] shadow-sm mb-6"
            >
              <Compass size={16} className="text-[#D4AF37]" />
              <span className="text-sm font-semibold text-[#1E466B]">Lost in the city?</span>
            </motion.div>
            
            <h1 className="text-[clamp(4rem,10vw,8rem)] font-bold text-[#1E466B] leading-none mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              4<span className="text-[#D4AF37]">0</span>4
            </h1>
            <h2 className="text-3xl font-bold text-[#0D0D0D] mb-4">Page Not Found</h2>
            <p className="text-lg text-gray-500 max-w-md">
              The page you're looking for could not be found. It might have been moved, deleted, or never existed.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties, locations..."
              className="w-full pl-5 pr-14 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#1E466B] text-white rounded-lg hover:bg-[#163552] transition-colors"
            >
              <Search size={20} />
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1E466B] text-white font-medium hover:bg-[#163552] transition-colors shadow-md">
              <Home size={18} /> Back Home
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-gray-200 max-w-md">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Suggested Destinations</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, idx) => (
                <Link key={idx} href={cat.path} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:border-[#D4AF37]/50 hover:shadow-md transition-all group">
                  <div className="text-[#1E466B] group-hover:text-[#D4AF37] transition-colors">
                    {cat.icon}
                  </div>
                  <span className="font-medium text-sm text-gray-700 group-hover:text-[#1E466B]">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Content - Abstract Floating Architecture */}
        <div className="hidden lg:flex relative h-[600px] w-full justify-center items-center perspective-1000">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-[400px] h-[400px]"
          >
            {/* Center Circle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1E466B] to-[#67BAF4] rounded-full opacity-5 blur-2xl"></div>

            {/* Main Building Card */}
            <motion.div 
              variants={floatingVariants}
              animate="animate"
              className="absolute top-10 left-10 right-10 bottom-10 bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-[0_20px_50px_rgba(30,70,107,0.1)] p-6 z-20 flex flex-col justify-end"
            >
              <div className="w-full h-3/4 rounded-xl overflow-hidden mb-4 relative bg-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4f8] to-[#e2e8f0]"></div>
                <Building2 size={64} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300" />
              </div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded-full"></div>
            </motion.div>

            {/* Floating Gold Element */}
            <motion.div
              variants={floatReverseVariants}
              animate="animate"
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#B89600] rounded-xl shadow-lg z-30 flex items-center justify-center transform rotate-12"
            >
              <Map size={32} className="text-white" />
            </motion.div>

            {/* Floating Info Card */}
            <motion.div
              variants={floatReverseVariants}
              animate="animate"
              style={{ animationDelay: '1s' }}
              className="absolute -bottom-10 -left-10 w-48 bg-white backdrop-blur-md border border-white/50 rounded-xl shadow-xl z-30 p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#1E466B]/10 flex items-center justify-center">
                  <Layout size={16} className="text-[#1E466B]" />
                </div>
                <div className="h-3 w-20 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
              <div className="h-2 w-4/5 bg-gray-100 rounded-full"></div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
