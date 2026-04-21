'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const footerSections = [
        {
            title: 'PRODUK',
            links: ['Sepatu', 'Pakaian', 'Aksesori', 'Rilisan Terbaru', 'Sale'],
        },
        {
            title: 'OLAHRAGA',
            links: ['Sepak Bola', 'Lari', 'Training', 'Tenis', 'Basket'],
        },
        {
            title: 'KOLEKSI',
            links: ['Ultraboost', 'Stan Smith', 'Samba', 'Gazelle', 'Predator'],
        },
        {
            title: 'DUKUNGAN',
            links: ['Bantuan', 'Pelacak Pesanan', 'Pencari Toko', 'adiclub', 'Pengembalian'],
        },
        {
            title: 'INFO PERUSAHAAN',
            links: ['Tentang Kami', 'Karier', 'Press', 'Hubungan Investor', 'Keberlanjutan'],
        },
    ];

    return (
        <footer className="bg-white text-black border-t border-gray-100">
            {/* Main Footer Links */}
            <div className="max-w-[1920px] mx-auto px-4 lg:px-20 py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                {footerSections.map((section) => (
                    <div key={section.title}>
                        <h4 className="font-black text-sm mb-6 tracking-wider adineue-bold uppercase">{section.title}</h4>
                        <ul className="space-y-3">
                            {section.links.map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-[13px] hover:underline font-normal text-gray-700">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#282c31] text-[#919496] py-6 text-center text-[11px] font-medium">
                <div className="max-w-[1920px] mx-auto px-4 flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-4 md:space-y-0">
                    <Link href="#" className="hover:text-white hover:underline transition-colors">Kebijakan Privasi</Link>
                    <span className="hidden md:block">|</span>
                    <Link href="#" className="hover:text-white hover:underline transition-colors">Syarat dan Ketentuan</Link>
                    <span className="hidden md:block">|</span>
                    <Link href="#" className="hover:text-white hover:underline transition-colors">Informasi Hukum</Link>
                    <span className="hidden md:block">|</span>
                    <span>© 2026 Connexxa Indonesia</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
