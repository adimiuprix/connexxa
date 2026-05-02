"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import ButtonDark from "@/components/ButtonDark";

export default function AddProductPage() {
    const containerRef = useRef(null);
    const router = useRouter();

    const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    const toggleSize = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    useGSAP(() => {
        gsap.fromTo(".form-section",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power4.out",
                clearProps: "all"
            }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full min-h-screen bg-white font-sans selection:bg-black selection:text-white pb-32">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-32">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10 form-section">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-[3px] bg-black"></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Tambah Entri Baru</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase leading-[0.75]">
                            TAMBAH<br />
                            <span className="text-gray-200 block mt-2">PRODUK</span>
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                        <ButtonDark
                            onClick={() => router.push("/admin/product")}
                            text="Batal"
                            outline
                            className="px-8 py-5 !italic !text-xs !tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Basic Info */}
                        <div className="form-section bg-white p-10 border border-gray-100 hover:border-black transition-all">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 pb-4 border-b-4 border-black">Informasi Umum</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Nama Produk</label>
                                    <input 
                                        type="text" 
                                        placeholder="CONTOH: ADICOLOR CLASSICS HOODIE" 
                                        className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-sm font-black italic uppercase outline-none transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Deskripsi</label>
                                    <textarea 
                                        rows={5}
                                        placeholder="DESKRIPSIKAN DETAIL MATERIAL, POTONGAN, DAN GAYA PRODUK..." 
                                        className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-sm font-bold outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Media / Images */}
                        <div className="form-section bg-white p-10 border border-gray-100 hover:border-black transition-all">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 pb-4 border-b-4 border-black">Media Produk</h2>
                            
                            <div className="border-2 border-dashed border-gray-300 hover:border-black p-12 flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-50 group">
                                <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                </div>
                                <span className="text-sm font-black uppercase italic tracking-widest text-black">Klik atau Tarik Gambar</span>
                                <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-[0.1em] uppercase">PNG, JPG, WEBP (MAX. 5MB)</span>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-10">
                        
                        {/* Pricing & Stock */}
                        <div className="form-section bg-white p-10 border border-gray-100 hover:border-black transition-all">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 pb-4 border-b-4 border-black">Harga & Stok</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Harga (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-black italic">$</span>
                                        <input 
                                            type="number" 
                                            placeholder="0.00" 
                                            className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black pl-10 pr-6 py-4 text-sm font-black italic outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Kuantitas Stok</label>
                                    <input 
                                        type="number" 
                                        placeholder="0" 
                                        className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-sm font-black italic outline-none transition-all"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">SKU (Opsional)</label>
                                    <input 
                                        type="text" 
                                        placeholder="CONTOH: FTR-092-BLK" 
                                        className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-sm font-black italic uppercase outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="form-section bg-white p-10 border border-gray-100 hover:border-black transition-all">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 pb-4 border-b-4 border-black">Varian</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Kategori</label>
                                    <select className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-[12px] font-black italic uppercase outline-none transition-all cursor-pointer appearance-none">
                                        <option value="footwear">Footwear (Sepatu)</option>
                                        <option value="apparel">Apparel (Pakaian)</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Ukuran Tersedia</label>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map((size) => (
                                            <button 
                                                key={size}
                                                onClick={() => toggleSize(size)}
                                                className={`w-12 h-12 flex items-center justify-center border-2 font-black italic text-sm transition-all ${
                                                    selectedSizes.includes(size) 
                                                    ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                                                    : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section pt-6">
                            <ButtonDark
                                text="SIMPAN PRODUK"
                                fullWidth
                                className="py-6 !text-sm !tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}