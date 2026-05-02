"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import StatCard from "@/components/StatCard";
import ButtonDark from "@/components/ButtonDark";

// Icons (Inline SVGs for reliability and styling)
const Icons = {
    Revenue: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    Orders: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
    Customers: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    Trending: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
};

export default function AdminDashboard() {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Stat Cards Entrance
        gsap.fromTo(".stat-card-item",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power4.out",
                clearProps: "all" // Clear GSAP styles after animation to let CSS take over
            }
        );

        // Section Blocks Entrance
        gsap.fromTo(".dashboard-section",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 0.4,
                stagger: 0.2,
                ease: "power4.out",
                clearProps: "all"
            }
        );
    }, { scope: containerRef });

    const router = useRouter();

    return (
        <div ref={containerRef} className="w-full bg-white font-sans selection:bg-black selection:text-white pb-32">
            {/* Internal Page Container */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-32">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-[3px] bg-black"></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Connexxa Admin Center</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase leading-[0.75]">
                            DASHBOARD<br />
                            <span className="text-gray-200 block mt-2">ANALYTICS</span>
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                        <ButtonDark
                            onClick={() => router.push("/admin/product")}
                            text="Atur Produk"
                            outline
                            className="px-12 py-5 !italic !text-xs !tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
                    <StatCard title="Total Revenue" value="$124,592" change="+12.5%" icon={Icons.Revenue} color="bg-blue-600" />
                    <StatCard title="Total Orders" value="1,240" change="+8.2%" icon={Icons.Orders} color="bg-purple-600" />
                    <StatCard title="New Customers" value="482" change="+14.1%" icon={Icons.Customers} color="bg-orange-600" />
                    <StatCard title="Avg. Order Value" value="$100.48" change="-2.4%" icon={Icons.Trending} color="bg-emerald-600" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Sales Chart Block */}
                    <div className="dashboard-section lg:col-span-2 bg-white p-12 border border-gray-100 hover:border-black transition-all group">
                        <div className="flex justify-between items-center mb-16">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Sales Performance</h2>
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Period:</span>
                                <select className="bg-white border-b-2 border-black px-4 py-2 text-[10px] font-black italic uppercase outline-none cursor-pointer hover:bg-gray-50 transition-colors">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>
                        </div>

                        <div className="h-[400px] w-full relative">
                            <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#0071ae" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#0071ae" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,150 Q100,120 200,160 T400,100 T600,130 T800,80 T1000,110 L1000,200 L0,200 Z" fill="url(#chartGrad)" />
                                <path d="M0,150 Q100,120 200,160 T400,100 T600,130 T800,80 T1000,110" fill="none" stroke="#0071ae" strokeWidth="5" strokeLinecap="round" />
                                <circle cx="200" cy="160" r="7" fill="white" stroke="#0071ae" strokeWidth="4" />
                                <circle cx="400" cy="100" r="7" fill="white" stroke="#0071ae" strokeWidth="4" />
                                <circle cx="800" cy="80" r="7" fill="white" stroke="#0071ae" strokeWidth="4" />
                            </svg>
                            <div className="flex justify-between mt-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-t border-gray-100 pt-6">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Products Sidebar */}
                    <div className="dashboard-section bg-white p-12 border border-gray-100 hover:border-black transition-all">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10">Top Selling</h2>
                        <div className="space-y-10">
                            {[
                                { name: "Superstar Classic", category: "Footwear", sales: 420, img: "👟" },
                                { name: "Adicolor Hoodie", category: "Apparel", sales: 312, img: "🧥" },
                                { name: "NMD R1 Runner", category: "Footwear", sales: 285, img: "👟" },
                                { name: "Tiro 23 Tracksuit", category: "Activewear", sales: 198, img: "👕" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-[#ebedee] flex items-center justify-center text-4xl group-hover:rotate-6 transition-transform duration-500">
                                            {item.img}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black italic uppercase tracking-tighter text-black">{item.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black italic leading-none mb-1">{item.sales}</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Units</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-12 border-t border-gray-100">
                            <h2 className="text-[11px] font-black italic uppercase mb-8 text-red-600 tracking-[0.3em]">Stock Alerts</h2>
                            <div className="space-y-5">
                                {[
                                    { name: "Samba OG (White)", stock: 3 },
                                    { name: "Forum Low (Blue)", stock: 0 },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white border border-gray-100 p-5 hover:border-red-600 transition-all shadow-sm">
                                        <span className="text-[12px] font-black text-black uppercase tracking-tight">{item.name}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 ${item.stock === 0 ? 'bg-black text-white' : 'bg-red-50 text-red-600'}`}>
                                            {item.stock === 0 ? 'SOLD OUT' : `${item.stock} LEFT`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Full Width Table */}
                    <div className="dashboard-section lg:col-span-3 bg-white p-12 border border-gray-100 hover:border-black transition-all overflow-hidden mt-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Recent Transactions</h2>
                            <button className="text-[11px] font-black italic text-black uppercase tracking-[0.2em] border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none">View All History</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead>
                                    <tr className="border-b-4 border-black">
                                        <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Order ID</th>
                                        <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Customer</th>
                                        <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Product</th>
                                        <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Amount</th>
                                        <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Status</th>
                                        <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { id: "#ORD-7721", user: "Alex Rivera", product: "Ultraboost Light", price: "$190.00", status: "Delivered" },
                                        { id: "#ORD-7722", user: "Sarah Jenkins", product: "Essentials Tee", price: "$35.00", status: "Processing" },
                                        { id: "#ORD-7723", user: "Marcus Chen", product: "Gazelle Indoor", price: "$120.00", status: "Shipped" },
                                        { id: "#ORD-7724", user: "Elena Gilbert", product: "Stan Smith Lux", price: "$145.00", status: "Delivered" },
                                    ].map((order, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-all group">
                                            <td className="py-10 text-sm font-black tracking-tight">{order.id}</td>
                                            <td className="py-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-sm font-black italic">
                                                        {order.user.charAt(0)}
                                                    </div>
                                                    <span className="text-base font-black uppercase italic tracking-tighter">{order.user}</span>
                                                </div>
                                            </td>
                                            <td className="py-10 text-xs font-bold text-gray-500 uppercase tracking-tight">{order.product}</td>
                                            <td className="py-10 text-base font-black italic">{order.price}</td>
                                            <td className="py-10">
                                                <span className={`px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em] border-2 ${order.status === 'Delivered' ? 'border-green-600 text-green-700 bg-green-50' :
                                                    order.status === 'Processing' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-orange-600 text-orange-700 bg-orange-50'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-10 text-right">
                                                <button className="px-6 py-3 bg-white border-2 border-transparent hover:border-black font-black uppercase text-[11px] transition-all tracking-widest">Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
