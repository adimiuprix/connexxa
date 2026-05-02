"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import ButtonDark from "@/components/ButtonDark";
import type { Product } from "@/generated/prisma";

export default function AdminProduk() {
    const containerRef = useRef(null);
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data as Product[]);
                } else {
                    console.error("Failed to fetch products");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchProducts();
    }, []);

    useGSAP(() => {
        // Section Blocks Entrance
        gsap.fromTo(".dashboard-section",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 0.2,
                stagger: 0.2,
                ease: "power4.out",
                clearProps: "all"
            }
        );
    }, { scope: containerRef });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div ref={containerRef} className="w-full bg-white font-sans selection:bg-black selection:text-white pb-32">
            {/* Internal Page Container */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-32">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl dashboard-section">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-[3px] bg-black"></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Connexxa Admin Center</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase leading-[0.75]">
                            MANAJEMEN<br />
                            <span className="text-gray-200 block mt-2">PRODUK</span>
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2 dashboard-section">
                        <ButtonDark
                            onClick={() => router.push("/admin/dashboard")}
                            text="Kembali ke Dashboard"
                            outline
                            className="px-8 py-5 !italic !text-xs !tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] mr-4"
                        />
                        <ButtonDark
                            onClick={() => router.push("/admin/product/add")}
                            text="Tambah Produk"
                            className="px-12 py-5 !italic !text-xs !tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                        />
                    </div>
                </div>

                {/* Full Width Table */}
                <div className="dashboard-section bg-white p-12 border border-gray-100 hover:border-black transition-all overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Daftar Produk</h2>
                        <div className="flex items-center gap-6">
                            <input
                                type="text"
                                placeholder="CARI PRODUK..."
                                className="bg-gray-50 border-b-2 border-black px-6 py-3 text-[11px] font-black italic uppercase outline-none tracking-[0.2em] w-64 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead>
                                <tr className="border-b-4 border-black">
                                    <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Kode</th>
                                    <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Produk</th>
                                    <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Kategori</th>
                                    <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Harga</th>
                                    <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Stok</th>
                                    <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Status</th>
                                    <th className="pb-8 text-[11px] font-black uppercase text-gray-400 tracking-[0.3em] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center font-bold uppercase tracking-widest text-gray-500 text-sm">
                                            MEMUAT DATA...
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center font-bold uppercase tracking-widest text-gray-500 text-sm">
                                            Belum ada produk di database
                                        </td>
                                    </tr>
                                ) : products.map((product, i) => {
                                    // Derived and formatted values
                                    const status = product.stock > 10 ? 'Active' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';
                                    const img = product.images.length > 0 ? product.images[0] : "👕";
                                    const price = formatCurrency(product.price);
                                    
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-all group">
                                            <td className="py-10 text-sm font-black tracking-tight">{product.sku}</td>
                                            <td className="py-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-[#ebedee] flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform duration-500 overflow-hidden relative">
                                                        {(img.startsWith('http') || img.startsWith('/')) ? (
                                                            <img src={img} alt={product.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            img
                                                        )}
                                                    </div>
                                                    <span className="text-base font-black uppercase italic tracking-tighter">{product.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-10 text-xs font-bold text-gray-500 uppercase tracking-tight">General</td>
                                            <td className="py-10 text-base font-black italic">{price}</td>
                                            <td className="py-10 text-sm font-black">{product.stock}</td>
                                            <td className="py-10">
                                                <span className={`px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em] border-2 ${
                                                    status === 'Active' ? 'border-green-600 text-green-700 bg-green-50' :
                                                    status === 'Low Stock' ? 'border-orange-600 text-orange-700 bg-orange-50' :
                                                    'border-red-600 text-red-700 bg-red-50'
                                                }`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="py-10 text-right">
                                                <button
                                                    onClick={() => router.push(`/admin/product/edit/${product.id}`)}
                                                    className="px-5 py-3 mr-2 bg-white border-2 border-transparent hover:border-black font-black uppercase text-[11px] transition-all tracking-widest"
                                                >
                                                    Edit
                                                </button>
                                                <button className="px-5 py-3 bg-red-50 text-red-600 border-2 border-transparent hover:border-red-600 font-black uppercase text-[11px] transition-all tracking-widest">Hapus</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}