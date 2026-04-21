"use client";

import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Link from 'next/link';
import Menu from './Menu';
import NavLink from './NavLink';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="w-full bg-white font-sans border-b border-gray-100">
            {/* Top Utility Bar */}
            <div className="hidden lg:flex justify-end items-center px-10 py-1 space-x-6 text-[10px] tracking-wider text-black bg-white uppercase font-medium">
                <a href="#" className="hover:underline">pencari toko</a>
                <a href="#" className="hover:underline">bantuan</a>
                <a href="#" className="hover:underline">pelacak pesanan</a>
                <a href="#" className="hover:underline">adiclub</a>
            </div>

            {/* Mobile Menu Sidebar */}
            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Main Header */}
            <div className="flex items-center justify-between px-4 lg:px-10 h-12 lg:h-20 max-w-[1920px] mx-auto relative">

                {/* Mobile Left Section: Menu & Wishlist */}
                <div className="flex lg:hidden items-center space-x-5">

                    <button onClick={handleMenuClick} className="p-1 text-gray-600">
                        <MenuIcon sx={{ fontSize: 24 }} />
                    </button>

                    <button className="p-1 text-gray-600">
                        <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                    </button>
                </div>

                {/* Logo (Centered on mobile, Left on desktop) */}
                <Link href="/">
                    <div className="lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0 flex-shrink-0">
                        <svg viewBox="0 0 64 36" className="w-10 h-7 lg:w-16 lg:h-12" fill="currentColor">
                            <path d="M4 36l10-18h7l-10 18H4z" />
                            <path d="M18 36L34 8h7L25 36h-7z" />
                            <path d="M32 36L55 0h7L40 36h-8z" />
                        </svg>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6 h-full">
                    <NavLink />
                </nav>

                {/* Right Side Icons & Search */}
                <div className="flex items-center space-x-2 lg:space-x-4">
                    <div className="hidden lg:flex items-center bg-[#eaebed] px-3 py-2 w-48 relative group transition-all">
                        <input
                            type="text"
                            placeholder="Cari"
                            className="bg-transparent text-sm focus:outline-none w-full"
                        />
                        <SearchIcon sx={{ fontSize: 20, color: '#4b5563' }} />
                    </div>

                    <div className="flex items-center space-x-3 lg:space-x-4">
                        {/* Profile Icon with Badge */}
                        <div className="relative p-1">
                            <PersonOutlinedIcon sx={{ fontSize: 24 }} />
                            <span className="absolute -top-1 -right-1 bg-[#4b7a6e] text-white text-[9px] w-4 h-[16px] rounded-full flex items-center justify-center font-bold border-2 border-white lg:border-none">1</span>
                        </div>

                        {/* Mobile Search Icon */}
                        <button className="lg:hidden p-1">
                            <SearchIcon sx={{ fontSize: 24 }} />
                        </button>

                        {/* Desktop Heart Icon */}
                        <button className="hidden lg:block p-1">
                            <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                        </button>

                        {/* Bag Icon (Solid on mobile, Outline on desktop) */}
                        <div className="relative p-1 flex items-center">
                            {/* Desktop Bag (Outline) */}
                            <ShoppingBagOutlinedIcon className="hidden lg:block" sx={{ fontSize: 24 }} />
                            <span className="absolute -top-1 -right-1 bg-[#4b7a6e] text-white text-[9px] w-4 h-[16px] rounded-full flex items-center justify-center font-bold border-2 border-white lg:border-none">1</span>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

