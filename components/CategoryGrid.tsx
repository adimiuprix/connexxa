'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
    {
        title: 'PRIA',
        image: '/slides/adidas_men_category.png',
        href: '/pria',
    },
    {
        title: 'WANITA',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
        href: '/wanita',
    },
    {
        title: 'ANAK',
        image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1000&auto=format&fit=crop',
        href: '/anak',
    },
];

const CategoryGrid = () => {
    return (
        <section className="max-w-[1920px] mx-auto px-4 lg:px-20 py-16">
            <h2 className="text-3xl md:text-4xl font-black italic mb-8 tracking-tighter uppercase text-black">
                SIAPA YANG KAMU CARI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <Link key={cat.title} href={cat.href} className="group relative overflow-hidden bg-gray-100 block aspect-[4/5]">
                        <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-6 left-6">
                            <span className="bg-white text-black px-4 py-2 font-bold text-lg tracking-widest uppercase italic group-hover:bg-black group-hover:text-white transition-colors">
                                {cat.title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
