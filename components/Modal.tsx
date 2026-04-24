'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

/**
 * Premium Dynamic Modal Component
 * Matches the Connexxa aesthetic: Bold, Clean, and Smooth GSAP animations.
 */
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const [mounted, setMounted] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle hydration mounting
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const { contextSafe } = useGSAP({ scope: overlayRef });

    // Close animation logic
    const handleClose = contextSafe(() => {
        const tl = gsap.timeline({
            onComplete: onClose
        });

        tl.to(contentRef.current, {
            y: 30,
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: "power2.in"
        });
        
        tl.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut"
        }, "-=0.2");
    });

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, handleClose]);

    // Handle scroll lock separately and more robustly
    useEffect(() => {
        if (isOpen && mounted) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, mounted]);

    // Open animation logic
    useGSAP(() => {
        if (isOpen && mounted) {
            // Reset state for entry
            gsap.set(overlayRef.current, { opacity: 0 });
            gsap.set(contentRef.current, { y: 30, opacity: 0, scale: 0.95 });

            const tl = gsap.timeline();
            
            tl.to(overlayRef.current, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            });

            tl.to(contentRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "expo.out"
            }, "-=0.2");
        }
    }, [isOpen, mounted]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div 
            ref={overlayRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6"
        >
            {/* Backdrop with premium blur */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-[4px]"
                onClick={handleClose}
            />
            
            {/* Modal Container */}
            <div 
                ref={contentRef}
                className="relative bg-white w-full max-w-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10"
            >
                {/* Header Section */}
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100">
                    {title && (
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black">
                            {title}
                        </h2>
                    )}
                    <button 
                        onClick={handleClose}
                        className="ml-auto p-2 hover:bg-black hover:text-white transition-all duration-300 group"
                        aria-label="Close modal"
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5"
                            className="group-hover:rotate-90 transition-transform duration-500"
                        >
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>

                {/* Optional subtle footer accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-black via-gray-800 to-black" />
            </div>
        </div>,
        document.body
    );
};

export default Modal;
