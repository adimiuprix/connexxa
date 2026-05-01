"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => {
  const isPositive = change.startsWith("+");
  return (
    <div className="stat-card-item bg-white p-8 border border-gray-100 flex flex-col justify-between hover:border-black transition-all cursor-default relative overflow-hidden group min-h-[180px] w-full">
      {/* Background Decorative Element */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.04] -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150 duration-700`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className="p-3 border border-gray-100 text-black bg-white shadow-sm">
          {icon}
        </div>
        <span className={`text-[10px] font-black italic uppercase px-3 py-1 ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {change}
        </span>
      </div>
      
      <div className="mt-8 relative z-10">
        <p className="text-[10px] text-gray-400 font-black italic uppercase tracking-widest leading-none mb-2">{title}</p>
        <h3 className="text-4xl font-black italic tracking-tighter text-black leading-none">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
