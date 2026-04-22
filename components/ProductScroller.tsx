'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const products = [
    {
        id: 1,
        name: 'Elegant Dress 1',
        category: 'Women',
        price: 'Rp 2.200.000',
        image: '/product-images/dress1.1.jpg',
        hoverImage: '/product-images/dress1.2.jpg',
    },
    {
        id: 2,
        name: 'Casual Dress 1',
        category: 'Women',
        price: 'Rp 4.000.000',
        image: '/product-images/dress2.1.jpg',
        hoverImage: '/product-images/dress2.2.jpg',
    },
];

const ProductBox = ({ product }: { product: typeof products[0] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    useGSAP(() => {
        // Set awal: Gambar kedua berada di bawah (tersembunyi)
        if (product.hoverImage) {
            gsap.set(".hover-img", { yPercent: 100 });
        }
        gsap.set(".primary-img", { yPercent: 0 });
    }, { scope: containerRef });

    const handleMouseEnter = contextSafe(() => {
        if (!product.hoverImage) return;
        // Animasi slide ke atas
        gsap.to(".primary-img", { yPercent: -100, duration: 0.6, ease: "expo.inOut" });
        gsap.to(".hover-img", { yPercent: 0, duration: 0.6, ease: "expo.inOut" });
    });

    const handleMouseLeave = contextSafe(() => {
        if (!product.hoverImage) return;
        // Animasi slide kembali ke bawah
        gsap.to(".primary-img", { yPercent: 0, duration: 0.6, ease: "expo.inOut" });
        gsap.to(".hover-img", { yPercent: 100, duration: 0.6, ease: "expo.inOut" });
    });

    return (
        <div 
            ref={containerRef}
            className="min-w-[280px] md:min-w-[320px] bg-white group cursor-pointer border border-transparent hover:border-black transition-all p-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="aspect-square relative overflow-hidden bg-[#ebedee]">
                {/* Primary Image */}
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover primary-img"
                />
                
                {/* Hover Image */}
                {product.hoverImage && (
                    <Image
                        src={product.hoverImage}
                        alt={`${product.name} hover`}
                        fill
                        className="object-cover hover-img"
                    />
                )}
                <div className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </div>
            </div>
            <div className="mt-4 space-y-1">
                <h3 className="text-sm font-semibold uppercase tracking-tight">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.category}</p>
                <p className="text-sm font-bold">{product.price}</p>
            </div>
        </div>
    );
};

const ProductScroller = ({ title }: { title: string }) => {
    return (
        <section className="py-16 overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                <h2 className="text-3xl md:text-4xl font-black italic mb-8 tracking-tighter uppercase text-black">
                    {title}
                </h2>
                <div className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide">
                    {products.map((product) => (
                        <ProductBox key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductScroller;
