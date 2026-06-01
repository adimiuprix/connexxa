'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category {
    id: number;
    name: string;
    slug: string;
}

const Footer = () => {
    const pathname = usePathname();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((data: Category[]) => setCategories(data))
            .catch(() => setCategories([]));
    }, []);

    if (pathname?.startsWith('/admin')) return null;

    const footerSections = [
        {
            title: 'DUKUNGAN',
            links: ['Bantuan', 'Pelacak Pesanan', 'Pencari Toko', 'Pengembalian'],
            hrefs: ['/bantuan', '#', '#', '#'],
        },
        {
            title: 'INFO PERUSAHAAN',
            links: ['Tentang Kami', 'Kontak', 'Keberlanjutan'],
            hrefs: ['#', '#', '#'],
        },
    ];

    return (
        <footer className="bg-white text-black border-t border-gray-100">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-20 py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

                {/* Dynamic PRODUK section */}
                <div>
                    <h4 className="font-black text-sm mb-6 tracking-wider adineue-bold uppercase">PRODUK</h4>
                    <ul className="space-y-3">
                        {categories.length === 0 ? (
                            // Skeleton saat loading
                            Array.from({ length: 4 }).map((_, i) => (
                                <li key={i}>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                                </li>
                            ))
                        ) : (
                            categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/category/${cat.slug}`}
                                        className="text-[13px] hover:underline font-normal text-gray-700"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Static sections */}
                {footerSections.map((section) => (
                    <div key={section.title}>
                        <h4 className="font-black text-sm mb-6 tracking-wider adineue-bold uppercase">{section.title}</h4>
                        <ul className="space-y-3">
                            {section.links.map((link, i) => (
                                <li key={link}>
                                    <Link href={section.hrefs[i]} className="text-[13px] hover:underline font-normal text-gray-700">
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
                    <Link href="/terms_and_conditions" className="hover:text-white hover:underline transition-colors">Syarat dan Ketentuan</Link>
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
