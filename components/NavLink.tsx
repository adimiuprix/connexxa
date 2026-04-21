"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
    { href: '/kaos', label: 'KAOS' },
    { href: '/celana', label: 'CELANA' },
    { href: '/sepatu', label: 'SEPATU' },
    { href: '/jaket', label: 'JAKET' },
];

const NavLink = () => {
    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center space-x-6 h-full">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold tracking-wide border-b-2 h-full flex items-center px-3 transition-all duration-200 ${pathname === link.href
                            ? 'text-black border-black'
                            : 'text-gray-600 border-transparent hover:border-black hover:text-black'
                        }`}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};

export default NavLink;
