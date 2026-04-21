'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from './Button';

const images = [
    {
        src: '/slides/banner1.png',
        title: 'Future of Footwear',
        subtitle: 'Step into the next generation of style and comfort.',
    },
    {
        src: '/slides/banner2.png',
        title: 'Timeless Elegance',
        subtitle: 'Classic silhouettes reimagined for the modern era.',
    },
    {
        src: '/slides/banner3.png',
        title: 'Urban Essentials',
        subtitle: 'Crafted for the city, designed for you.',
    },
    {
        src: '/slides/banner4.png',
        title: 'Art in Motion',
        subtitle: 'Where fashion meets abstract expressionism.',
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
        const interval = setInterval(nextSlide, 10000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <section className="relative w-full h-[300px] md:h-[450px] overflow-hidden group">
            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="min-w-full h-full relative">
                        <Image
                            src={image.src}
                            alt={image.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent">
                            <div className={`transition-all duration-1000 transform ${currentIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter uppercase italic">
                                    {image.title}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-6 font-light">
                                    {image.subtitle}
                                </p>
                                <Button text="Explore More" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <IconButton
                    onClick={prevSlide}
                    className="bg-white/20 hover:bg-white/40 text-white pointer-events-auto backdrop-blur-sm"
                    size="large"
                >
                    <ArrowBackIosNewIcon />
                </IconButton>
                <IconButton
                    onClick={nextSlide}
                    className="bg-white/20 hover:bg-white/40 text-white pointer-events-auto backdrop-blur-sm"
                    size="large"
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 transition-all duration-300 rounded-full ${currentIndex === index ? 'w-12 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
