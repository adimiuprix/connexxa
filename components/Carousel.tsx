'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Button from './Button';

const images = [
    {
        src: '/slides/adidas_banner_1.png',
        title: 'TINGKATKAN PERMAINANMU',
        subtitle: 'Koleksi terbaru untuk performa maksimal di setiap langkah.',
        cta: 'BELANJA SEKARANG',
    },
    {
        src: '/slides/adidas_banner_2.png',
        title: 'GAYA JALANAN AUTENTIK',
        subtitle: 'Temukan siluet klasik yang didefinisikan ulang untuk masa kini.',
        cta: 'LIHAT KOLEKSI',
    },
];

export default function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 8000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-[#ebedee]">
            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.45,0,0.55,1)] h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="min-w-full h-full relative">
                        <Image
                            src={image.src}
                            alt={image.title}
                            fill
                            className="object-cover object-center"
                            priority={index === 0}
                        />
                        {/* Adidas Style Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 lg:px-32">
                            <div className={`max-w-xl transition-all duration-1000 delay-300 transform ${currentIndex === index ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                                <h2 className="text-4xl md:text-6xl font-[900] text-black mb-4 tracking-tighter leading-none bg-white inline-block px-4 py-2 uppercase italic shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                    {image.title}
                                </h2>
                                <div className="mt-6 mb-8">
                                    <p className="text-lg md:text-xl text-black font-bold bg-white inline-block px-3 py-1 uppercase tracking-tight">
                                        {image.subtitle}
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <Button text={image.cta} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows (Adidas Style) */}
            <div className="absolute bottom-10 right-10 md:right-20 flex space-x-1 z-20">
                <button
                    onClick={prevSlide}
                    className="w-12 h-12 bg-white border border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="w-12 h-12 bg-white border border-black border-l-0 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-300 z-20">
                <div
                    className="h-full bg-black transition-all duration-[8000ms] ease-linear"
                    style={{
                        width: '100%',
                        transform: `scaleX(${1 / images.length})`,
                        transformOrigin: 'left',
                        transition: currentIndex === 0 ? 'none' : 'transform 8000ms linear'
                    }}
                    key={currentIndex}
                />
            </div>
        </section>
    );
}

