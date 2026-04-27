"use client";

import React, { useState, useEffect } from 'react';
import ButtonDark from '@/components/ButtonDark';
import CloseIcon from '@mui/icons-material/Close';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import Link from 'next/link';
import { createClient } from '@/libs/supabaseClient';

const WishlistsPage = () => {
    const [wishlists, setWishlists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlists = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const response = await fetch('/api/wishlist');
            const data = await response.json();
            if (response.ok) {
                setWishlists(data);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlists();
    }, []);

    const handleRemove = async (productId: number) => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) return;

            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
            if (response.ok) {
                setWishlists(prev => prev.filter(item => item.productId !== productId));
            }
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center h-[50vh]">
                <p className="text-[12px] font-bold uppercase tracking-widest animate-pulse">Memuat Wishlist...</p>
            </div>
        );
    }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-[16px] sm:text-[18px] font-bold uppercase tracking-widest mb-8 flex items-center">
                WISHLIST SAYA <span className="font-normal text-gray-500 text-sm ml-2 normal-case">[{wishlists.length} items]</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {wishlists.map((item) => (
                    <div key={item.id} className="flex flex-col group">
                        {/* Image Container */}
                        <div className="relative aspect-square bg-[#f5f5f5] mb-4">
                            {/* Close Button */}
                            <button 
                                onClick={() => handleRemove(item.productId)}
                                className="absolute top-0 right-0 w-8 h-8 bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors z-10"
                            >
                                <CloseIcon sx={{ fontSize: 18 }} />
                            </button>
                            {/* Image Placeholder */}
                            <Link href={`/product_items/${item.product.slug}`}>
                                <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover mix-blend-multiply" />
                            </Link>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-grow">
                            <h2 className="text-[12px] uppercase tracking-wide text-black mb-1">{item.product.title}</h2>
                            <p className="text-[13px] text-black mb-1">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.product.price)}
                            </p>
                            <p className="text-[12px] text-gray-500 mb-4">SKU: {item.product.sku}</p>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mt-auto">
                            <Link href={`/product_items/${item.product.slug}`}>
                                <ButtonDark
                                    text="Lihat Produk"
                                    fullWidth={true}
                                    icon={<LocalMallOutlinedIcon sx={{ fontSize: 20 }} className="ml-3" />}
                                    className="w-full"
                                />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {wishlists.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Wishlist Anda masih kosong.</p>
                    <Link href="/" className="inline-block mt-4 text-black font-black underline underline-offset-8 uppercase tracking-widest text-[12px]">Belanja Sekarang</Link>
                </div>
            )}
        </div>
    );
};

export default WishlistsPage;