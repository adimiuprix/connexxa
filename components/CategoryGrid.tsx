'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const categories = [
    {
        title: 'PRIA',
        image: '/who-search/pria/pria-1.png',
        hoverImage: '/who-search/pria/pria-2.png',
        href: '/pria',
    },
    {
        title: 'WANITA',
        image: '/who-search/wanita/wanita-1.png',
        hoverImage: '/who-search/wanita/wanita-2.png',
        href: '/wanita',
    },
    {
        title: 'ANAK',
        image: '/who-search/anak/anak-1.png',
        hoverImage: '/who-search/anak/anak-2.png',
        href: '/anak',
    },
];

const CategoryCard = ({ cat }: { cat: any }) => {
    const containerRef = useRef<HTMLAnchorElement>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    useGSAP(() => {
        // Set state awal
        gsap.set(".hover-img", { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", scale: 1.05 });
        gsap.set(".primary-img", { scale: 1.05 });
        gsap.set(".category-text-bg", { scaleY: 0 });
    }, { scope: containerRef });

    const handleMouseEnter = contextSafe(() => {
        // 1. Efek "Curtain Up" untuk gambar kedua
        gsap.to(".hover-img", { 
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", 
            duration: 0.85, 
            ease: "expo.inOut" 
        });
        
        // 2. Efek kedalaman (Depth): Gambar pertama membesar dan blur
        gsap.to(".primary-img", { 
            scale: 1.15, 
            filter: "blur(8px)", 
            duration: 0.85, 
            ease: "expo.inOut" 
        });

        // 3. Efek blok warna mengisi teks dari bawah ke atas
        gsap.to(".category-text-bg", { 
            scaleY: 1, 
            transformOrigin: "bottom", 
            duration: 0.5, 
            ease: "expo.inOut",
        });
        gsap.to(".category-text", { 
            color: "white", 
            duration: 0.3, 
            delay: 0.1 
        });
    });

    const handleMouseLeave = contextSafe(() => {
        // 1. Gambar kedua turun lagi (Curtain Down)
        gsap.to(".hover-img", { 
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", 
            duration: 0.85, 
            ease: "expo.inOut" 
        });

        // 2. Gambar pertama kembali normal
        gsap.to(".primary-img", { 
            scale: 1.05, 
            filter: "blur(0px)", 
            duration: 0.85, 
            ease: "expo.inOut" 
        });

        // 3. Efek blok warna keluar ke atas
        gsap.to(".category-text-bg", { 
            scaleY: 0, 
            transformOrigin: "top", 
            duration: 0.5, 
            ease: "expo.inOut" 
        });
        gsap.to(".category-text", { 
            color: "black", 
            duration: 0.3 
        });

    });

    return (
        <Link 
            ref={containerRef}
            href={cat.href} 
            className="group relative overflow-hidden bg-gray-900 block aspect-[4/5] cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Primary Image */}
            <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover primary-img opacity-90"
            />
            {/* Hover Image */}
            {cat.hoverImage && (
                <Image
                    src={cat.hoverImage}
                    alt={`${cat.title} hover`}
                    fill
                    className="object-cover hover-img"
                />
            )}
            
            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Magnetic Block Text Reveal */}
            <div className="absolute bottom-8 left-8 z-10 category-text-container overflow-hidden bg-white shadow-2xl">
                <div className="absolute inset-0 bg-black category-text-bg" />
                <span className="relative z-10 px-8 py-3 block font-black text-xl md:text-2xl tracking-[0.2em] uppercase italic category-text text-black">
                    {cat.title}
                </span>
            </div>
        </Link>
    );
};

const CategoryGrid = () => {
    return (
        <section className="max-w-[1920px] mx-auto px-4 lg:px-20 py-16">
            <h2 className="text-3xl md:text-4xl font-black italic mb-8 tracking-tighter uppercase text-black">
                SIAPA YANG KAMU CARI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <CategoryCard key={cat.title} cat={cat} />
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
