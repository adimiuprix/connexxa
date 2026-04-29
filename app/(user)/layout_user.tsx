"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function LayoutUser({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <div className="bg-white min-h-screen font-sans text-black pb-20">
            {/* User Info Header */}
            <div className="border-b border-gray-200">
                <div className="max-w-[1200px] mx-auto px-4 py-10 flex justify-between items-start">
                    <div className="flex flex-col">
                        <h1 className="text-[48px] font-black italic uppercase tracking-tighter leading-[0.9] mb-3">HI VEGO</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-[10px] h-[10px] rounded-full bg-[#00ff00] border border-gray-300 shadow-[0_0_5px_rgba(0,255,0,0.5)]"></div>
                            <span className="text-[12px] font-bold">50 poin untuk dibelanjakan</span>
                        </div>
                    </div>
                    
                    <div className="flex items-end gap-1">
                        <div className="flex flex-col items-end mb-2">
                            <span className="text-[14px] font-black uppercase tracking-tight leading-none">adiclub</span>
                            <span className="text-[12px] font-bold uppercase tracking-widest leading-none text-gray-500">LEVEL</span>
                        </div>
                        <div className="text-[72px] font-black italic leading-[0.8] tracking-tighter">1</div>
                    </div>
                </div>

                {/* Sub Navigation Tabs */}
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex justify-center gap-12">
                        <button className="py-4 px-2 text-[13px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">FEED</button>
                        <button className="py-4 px-2 text-[13px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">PESANAN</button>
                        <button className="py-4 px-2 text-[13px] font-bold uppercase tracking-widest text-black border-b-[4px] border-black -mb-[2px]">AKUN</button>
                    </div>
                </div>
            </div>

            {/* Main Layout Container */}
            <div className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col lg:flex-row gap-16">
                {/* Sidebar */}
                <aside className="w-full lg:w-[260px] flex-shrink-0">
                    <h2 className="text-[13px] font-black uppercase tracking-[0.1em] mb-8">RINGKASAN AKUN</h2>
                    <nav className="flex flex-col border-t border-gray-100">
                        <SidebarLink href="/account/profile" label="Informasi Pribadi" active={pathname === '/account/profile'} />
                        <SidebarLink href="/account/address" label="Buku Alamat" active={pathname === '/account/address'} />
                        <SidebarLink href="/account/preference" label="Preferensi" active={pathname === '/account/preference'} />
                        <SidebarLink href="/account/connected" label="Akun terkoneksi" active={pathname === '/account/connected'} />
                        <div className="mt-8 flex flex-col">
                            <SidebarLink href="/account/adiclub-pass" label="pass adiClub" showArrow={false} />
                            <SidebarLink href="/logout" label="Keluar" showArrow={false} />
                        </div>
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 max-w-[850px]">
                    {children}
                </main>
            </div>
        </div>
    );
}

const SidebarLink = ({ href, label, active = false, showArrow = true }: { href: string, label: string, active?: boolean, showArrow?: boolean }) => (
    <Link href={href} className={`flex items-center justify-between w-full py-5 px-1 text-left border-b border-gray-100 group transition-colors hover:bg-gray-50 ${active ? 'bg-transparent' : ''}`}>
        <span className={`text-[14px] tracking-tight transition-all ${active ? 'font-black' : 'font-medium group-hover:pl-2'}`}>
            {label}
        </span>
        {showArrow && <ChevronRightIcon sx={{ fontSize: 24, color: active ? 'black' : '#ccc' }} className="ml-2" />}
    </Link>
);