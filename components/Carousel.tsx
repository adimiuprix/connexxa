'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import ButtonDark from './ButtonDark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
    const container = useRef<HTMLElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

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

    useGSAP(() => {
        images.forEach((_, index) => {
            if (index === currentIndex) {
                // Active slide
                gsap.to(`.slide-${index}`, { opacity: 1, zIndex: 10, duration: 1, ease: 'power2.inOut' });

                // Zoom effect on image
                gsap.fromTo(`.image-${index}`,
                    { scale: 1 },
                    { scale: 1.05, duration: 8, ease: 'none' }
                );

                // Text animation (translateY + opacity)
                gsap.fromTo(`.text-${index}`,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
                );
            } else {
                // Inactive slides
                gsap.to(`.slide-${index}`, { opacity: 0, zIndex: 0, duration: 1, ease: 'power2.inOut' });
            }
        });

        // Progress indicator animation
        if (progressRef.current) {
            gsap.fromTo(progressRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 8, ease: 'none' }
            );
        }
    }, { dependencies: [currentIndex], scope: container });

    return (
        <section ref={container} className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-[#ebedee]">
            {/* Slides */}
            <div className="relative w-full h-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`slide slide-${index} absolute inset-0 w-full h-full opacity-0 z-0`}
                    >
                        <Image
                            src={image.src}
                            alt={image.title}
                            fill
                            className={`image-${index} object-cover object-center`}
                            priority={index === 0}
                        />
                        {/* Adidas Style Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 lg:px-32 z-20">
                            <div className={`text-${index} max-w-xl opacity-0 translate-y-8`}>
                                <h2 className="text-4xl md:text-6xl font-[900] text-black mb-4 tracking-tighter leading-none bg-white inline-block px-4 py-2 uppercase italic shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                    {image.title}
                                </h2>
                                <div className="mt-6 mb-8">
                                    <p className="text-lg md:text-xl text-black font-bold bg-white inline-block px-3 py-1 uppercase tracking-tight">
                                        {image.subtitle}
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <ButtonDark text={image.cta} icon={<ArrowForwardIcon className="ml-3 transition-transform duration-200 group-hover:translate-x-1" sx={{ fontSize: 20 }} />} />
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
                    ref={progressRef}
                    className="h-full bg-black origin-left"
                />
            </div>
        </section>
    );
}

