'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ButtonDark from '@/components/ButtonDark';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { CART_SESSION_KEY, dispatchCartSync } from '@/libs/cartSync';

interface CartItem {
    id: number;
    productId: string;
    title: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string | null;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [removingItemId, setRemovingItemId] = useState<number | null>(null);

    const fetchCart = useCallback(async () => {
        const sessionId = localStorage.getItem(CART_SESSION_KEY);
        if (!sessionId) {
            setCartItems([]);
            setTotalPrice(0);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []);
                setTotalPrice(data.totalPrice || 0);
            }
        } catch (error) {
            console.error("Gagal mengambil data cart:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleRemoveItem = async (itemId: number) => {
        const sessionId = localStorage.getItem(CART_SESSION_KEY);
        if (!sessionId || removingItemId) return;

        setRemovingItemId(itemId);
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, itemId }),
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []);
                setTotalPrice(data.totalPrice || 0);
                
                // Sinkronkan ke Header
                dispatchCartSync({
                    sessionId,
                    totalItems: data.totalItems,
                });
            }
        } catch (error) {
            console.error("Gagal menghapus item:", error);
        } finally {
            setRemovingItemId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 2,
        }).format(amount).replace(/\s/g, '').replace('Rp', 'Rp.');
    };

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[13px] font-black uppercase tracking-widest italic">Memuat Tas Belanja...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-10 py-20 text-center">
                    <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase mb-6">TAS KAMU KOSONG</h1>
                    <p className="text-sm text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
                        Sepertinya Anda belum menambahkan produk apapun ke tas. Mulai belanja sekarang untuk menemukan koleksi terbaik kami.
                    </p>
                    <Link href="/">
                        <ButtonDark text="Mulai Belanja" icon={<TrendingFlatIcon />} className="mx-auto h-[60px]" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-10 py-8 lg:py-12">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-3xl lg:text-[42px] font-black italic tracking-tighter flex items-baseline gap-3 uppercase">
                        TAS KAMU
                        <span className="text-gray-500 text-lg lg:text-xl font-normal not-italic tracking-normal lowercase">({cartItems.length} item)</span>
                    </h1>
                    <p className="text-[13px] lg:text-sm mt-3 text-black font-medium max-w-2xl">
                        Item di tas tidak direservasi — check out sekarang untuk membuatnya menjadi milikmu.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left Column: Cart Items */}
                    <div className="flex-grow lg:w-[65%]">
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className={`border border-gray-200 flex flex-col sm:flex-row h-auto sm:h-[260px] group hover:border-black transition-all ${removingItemId === item.id ? 'opacity-50 grayscale scale-[0.98]' : ''}`}>
                                    {/* Product Image */}
                                    <div className="w-full sm:w-[260px] h-[260px] bg-[#ebedee] relative flex-shrink-0">
                                        <Image
                                            src={item.image || '/stack.jpg'}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow p-5 lg:p-7 flex flex-col justify-between relative">
                                        {/* Top Info & Actions */}
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1.5">
                                                <p className="text-base lg:text-[17px] font-medium text-black leading-tight pr-12">
                                                    {item.title}
                                                </p>
                                                <p className="text-[13px] text-gray-600 font-normal">{item.color}</p>
                                                <p className="text-[13px] text-gray-600 font-normal">Ukuran: {item.size}</p>
                                            </div>
                                            <div className="flex flex-col gap-5 absolute top-5 right-5 lg:top-7 lg:right-7">
                                                <button 
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={!!removingItemId}
                                                    className="text-black hover:text-gray-500 transition-colors cursor-pointer disabled:opacity-30"
                                                >
                                                    <DeleteOutlinedIcon sx={{ fontSize: 24 }} />
                                                </button>
                                                <button className="text-black hover:text-gray-500 transition-colors cursor-pointer">
                                                    <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Bottom Controls & Price */}
                                        <div className="flex justify-between items-end mt-6">
                                            <div className="relative group/select">
                                                <select 
                                                    defaultValue={item.quantity}
                                                    className="appearance-none bg-white border border-black px-4 py-2.5 pr-10 text-[13px] font-bold focus:outline-none cursor-pointer w-[80px] hover:bg-gray-50 transition-colors"
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                        <option key={n} value={n}>{n}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                                                    <KeyboardArrowDownIcon sx={{ fontSize: 22 }} />
                                                </div>
                                            </div>
                                            <div className="text-base lg:text-[19px] font-bold text-black tracking-tighter">
                                                {formatCurrency(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-[35%] flex flex-col gap-8">
                        <div className="space-y-7">
                            <h2 className="text-2xl lg:text-[26px] font-black italic tracking-tighter uppercase">RINGKASAN PESANAN</h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-black font-medium">{cartItems.reduce((a, b) => a + b.quantity, 0)} item</span>
                                    <span className="text-black font-medium tracking-tight">{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-black font-medium">Pengiriman</span>
                                    <span className="text-black font-medium">Gratis</span>
                                </div>
                            </div>

                            <div className="pt-7 border-t border-gray-100 flex justify-between items-baseline">
                                <span className="text-base font-black uppercase italic tracking-tighter">Total</span>
                                <span className="text-xl font-black tracking-tighter">{formatCurrency(totalPrice)}</span>
                            </div>

                            <div className="pt-2">
                                <button className="flex items-center gap-3 group cursor-pointer">
                                    <LocalOfferOutlinedIcon sx={{ fontSize: 22 }} />
                                    <span className="text-[14px] font-black uppercase tracking-tight border-b-2 border-black pb-0.5 group-hover:text-gray-600 group-hover:border-gray-400 transition-all">
                                        Gunakan kode promo
                                    </span>
                                </button>
                            </div>

                            <div className="pt-4">
                                <ButtonDark
                                    text="Checkout"
                                    fullWidth
                                    icon={<TrendingFlatIcon sx={{ fontSize: 28 }} />}
                                    className="h-[64px] !text-[15px] !tracking-[0.1em]"
                                />
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="mt-6 pt-8 border-t border-gray-100">
                            <h4 className="text-[12px] font-black uppercase tracking-[0.15em] text-black mb-5">
                                METODE PEMBAYARAN YANG DITERIMA
                            </h4>
                            <div className="flex flex-wrap items-center gap-6 opacity-90">
                                <div className="flex items-center gap-1.5 px-2 py-1 border border-black rounded-sm bg-black text-white scale-90">
                                    <span className="text-[10px] font-black italic tracking-tighter">QRIS</span>
                                </div>
                                <div className="px-2 py-1 border border-black rounded-sm flex items-center justify-center font-black text-[10px] tracking-tighter scale-90">BANK</div>
                                <div className="text-[#1a1f71] font-black italic text-[16px] tracking-tighter">VISA</div>
                                <div className="flex items-center scale-110">
                                    <div className="w-5 h-5 bg-[#eb001b] rounded-full -mr-2 opacity-90"></div>
                                    <div className="w-5 h-5 bg-[#f79e1b] rounded-full opacity-90"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


