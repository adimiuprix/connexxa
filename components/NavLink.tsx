"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/libs/MenuItem';

const NavLink = () => {
    const pathname = usePathname();

    return (
        <div className="hidden lg:flex items-center space-x-2 h-full">
            {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`text-[14px] font-bold tracking-[0.05em] h-full flex items-center px-4 transition-all relative group ${item.label === 'SALE' ? 'text-red-600' : 'text-black'
                        }`}
                >
                    <span className="relative z-10">{item.label}</span>
                    <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-black transition-transform duration-200 origin-left ${pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
                </Link>
            ))}
        </div>
    );
};

export default NavLink;

