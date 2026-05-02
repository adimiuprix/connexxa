"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Render plain children for login page without admin navigation
    if (pathname === '/admin/login') {
        return <main className="min-h-screen bg-gray-50">{children}</main>;
    }

    useGSAP(() => {
        if (!menuRef.current) return;
        
        if (isMobileMenuOpen) {
            // Slide down the main container
            gsap.fromTo(menuRef.current, 
                { y: "-100%", opacity: 0, display: "none" },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 0.5,
                    ease: "power4.out",
                    display: "block"
                }
            );
            
            // Stagger animate the links for a premium feel
            gsap.fromTo(".mobile-menu-item",
                { y: -20, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    stagger: 0.05, 
                    ease: "power3.out",
                    delay: 0.1,
                    clearProps: "all"
                }
            );
        } else {
            gsap.to(menuRef.current, {
                y: "-100%",
                opacity: 0,
                duration: 0.3,
                ease: "power3.in",
                display: "none"
            });
        }
    }, [isMobileMenuOpen]);

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} /> },
        { name: 'Produk', path: '/admin/product', icon: <CheckroomOutlinedIcon sx={{ fontSize: 20 }} /> },
        { name: 'Pesanan', path: '/admin/orders', icon: <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} /> },
        { name: 'Pelanggan', path: '/admin/customers', icon: <PeopleOutlinedIcon sx={{ fontSize: 20 }} /> },
        { name: 'Promosi', path: '/admin/promotions', icon: <LocalOfferOutlinedIcon sx={{ fontSize: 20 }} /> },
        { name: 'Pengaturan', path: '/admin/settings', icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} /> },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Global Admin Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full bg-white border-b-4 border-black z-50 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between bg-white relative z-50">
                    
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black italic text-xl">
                            C
                        </div>
                        <span className="text-xl font-black italic tracking-tighter uppercase hidden sm:block">
                            Connexxa<span className="text-gray-400 ml-2 text-sm tracking-[0.2em]">Admin</span>
                        </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.path);
                            return (
                                <Link 
                                    key={item.path} 
                                    href={item.path}
                                    className={`relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] h-20 px-2 transition-colors ${
                                        isActive ? 'text-black' : 'text-gray-400 hover:text-black'
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.name}
                                    {/* Active Indicator */}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 w-full h-[4px] bg-black"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Profile & Mobile Toggle */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] font-black uppercase tracking-widest text-black">Super Admin</p>
                                <p className="text-[9px] font-bold uppercase text-gray-400">admin@connexxa.com</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 border-2 border-black flex items-center justify-center font-black">
                                SA
                            </div>
                        </div>
                        
                        <button className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-600 px-4 py-2 transition-colors">
                            Keluar
                        </button>

                        {/* Hamburger Button (Mobile) */}
                        <button 
                            className="lg:hidden w-10 h-10 border-2 border-black flex flex-col items-center justify-center gap-[3px] bg-white hover:bg-gray-50 active:translate-y-[2px] transition-all"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className={`w-4 h-[2px] bg-black transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
                            <span className={`w-4 h-[2px] bg-black transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-4 h-[2px] bg-black transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
                        </button>
                    </div>

                </div>
            </nav>

            {/* Mobile Navigation Dropdown (GSAP Animated) */}
            <div 
                ref={menuRef} 
                className="fixed top-20 left-0 w-full bg-white border-b-4 border-black z-40 lg:hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] pt-2"
                style={{ transform: "translateY(-100%)", opacity: 0, display: "none" }}
            >
                <div className="flex flex-col px-6 py-2">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        return (
                            <Link 
                                key={item.path} 
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`mobile-menu-item flex items-center gap-4 py-5 border-b border-gray-100 last:border-b-0 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                                    isActive ? 'text-black' : 'text-gray-400'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                    <button className="mobile-menu-item sm:hidden mt-4 mb-4 w-full text-[11px] font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 py-4 transition-colors">
                        Keluar
                    </button>
                </div>
            </div>

            {/* Page Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
