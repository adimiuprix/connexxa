"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
    { href: '/pria', label: 'PRIA' },
    { href: '/wanita', label: 'WANITA' },
    { href: '/anak', label: 'ANAK' },
    { href: '/sale', label: 'SALE' },
];

const NavLink = () => {
    const pathname = usePathname();

    return (
        <div className="hidden lg:flex items-center space-x-2 h-full">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[14px] font-bold tracking-[0.05em] h-full flex items-center px-4 transition-all relative group ${link.label === 'SALE' ? 'text-red-600' : 'text-black'
                        }`}
                >
                    <span className="relative z-10">{link.label}</span>
                    <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-black transition-transform duration-200 origin-left ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
                </Link>
            ))}
        </div>
    );
};

export default NavLink;

