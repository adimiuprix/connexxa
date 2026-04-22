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
        <header className="w-full bg-white font-sans border-b border-gray-100 sticky top-0 z-50">
            {/* Top Promo/Utility Bar */}
            <div className="bg-black text-white text-[11px] py-1.5 flex justify-center items-center font-bold tracking-widest uppercase px-4 text-center">
                GRATIS ONGKIR DENGAN MIN. PEMBELIAN RP 1.500.000
            </div>

            <div className="hidden lg:flex justify-end items-center px-10 py-1 space-x-6 text-[10px] tracking-wider text-black bg-white uppercase font-medium border-b border-gray-100">
                <a href="#" className="hover:underline">pencari toko</a>
                <a href="#" className="hover:underline">bantuan</a>
                <a href="#" className="hover:underline">pelacak pesanan</a>
            </div>

            {/* Mobile Menu Sidebar */}
            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Main Header */}
            <div className="flex items-center justify-between px-4 lg:px-10 h-12 lg:h-16 max-w-[1920px] mx-auto relative bg-white">

                {/* Left Side: Logo (Desktop: Left, Mobile: Left) */}
                <div className="flex items-center space-x-4">
                    <button onClick={handleMenuClick} className="lg:hidden p-1 text-black">
                        <MenuIcon sx={{ fontSize: 24 }} />
                    </button>
                    <Link href="/">
                        <div className="flex-shrink-0">
                            <svg viewBox="0 0 64 36" className="w-12 h-8 lg:w-[70px] lg:h-[48px]" fill="currentColor">
                                <path d="M4 36l10-18h7l-10 18H4z" />
                                <path d="M18 36L34 8h7L25 36h-7z" />
                                <path d="M32 36L55 0h7L40 36h-8z" />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation (Centered) */}
                <nav className="absolute left-1/2 -translate-x-1/2 h-full hidden lg:flex">
                    <NavLink />
                </nav>

                {/* Right Side Icons & Search */}
                <div className="flex items-center space-x-2 lg:space-x-5">
                    {/* Desktop Search Bar */}
                    <div className="hidden lg:flex items-center bg-[#eaebed] px-3 py-1.5 w-[190px] relative transition-all border border-transparent focus-within:border-gray-400">
                        <input
                            type="text"
                            placeholder="Cari"
                            className="bg-transparent text-[13px] focus:outline-none w-full placeholder:text-gray-500 font-medium"
                        />
                        <SearchIcon sx={{ fontSize: 20, color: '#000000' }} />
                    </div>

                    <div className="flex items-center space-x-2 lg:space-x-4">
                        <button className="p-1 text-black hover:bg-gray-100 rounded-sm transition-colors">
                            <PersonOutlinedIcon sx={{ fontSize: 24 }} />
                        </button>

                        <button className="p-1 text-black hover:bg-gray-100 rounded-sm transition-colors">
                            <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                        </button>

                        <div className="relative p-1 hover:bg-gray-100 rounded-sm transition-colors cursor-pointer">
                            <ShoppingBagOutlinedIcon sx={{ fontSize: 24 }} />
                            <span className="absolute -bottom-1 -right-1 bg-[#0071ae] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">1</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;


