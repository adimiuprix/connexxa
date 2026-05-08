'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ButtonDark from '@/components/ButtonDark';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

export default function CartPage() {
    // Dummy data for demonstration
    const cartItems = [
        {
            id: 1,
            title: "Track Top Away Argentina 2006",
            color: "Dark Blue",
            size: "S",
            price: 1600000,
            quantity: 1,
            image: "/stack.jpg",
            stockStatus: "Persediaan sedikit"
        },
        {
            id: 2,
            title: "Samba OG Shoes",
            color: "Cloud White / Core Black",
            size: "42",
            price: 1800000,
            quantity: 1,
            image: "/Samba_OG_Shoes_White_B75806_01_standard.jpg",
            stockStatus: ""
        }
    ];

    const formatCurrency = (amount: number) => {
        // Precise format: Rp.1.600.000,00
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 2,
        }).format(amount).replace(/\s/g, '').replace('Rp', 'Rp.');
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
                                <div key={item.id} className="border border-gray-200 flex flex-col sm:flex-row h-auto sm:h-[260px] group hover:border-black transition-colors">
                                    {/* Product Image */}
                                    <div className="w-full sm:w-[260px] h-[260px] bg-[#ebedee] relative flex-shrink-0">
                                        <Image
                                            src={item.image}
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
                                                {item.stockStatus && (
                                                    <p className="text-[13px] font-bold text-[#b07000] mt-2 italic">{item.stockStatus}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-5 absolute top-5 right-5 lg:top-7 lg:right-7">
                                                <button className="text-black hover:text-gray-500 transition-colors cursor-pointer">
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
                                                <select className="appearance-none bg-white border border-black px-4 py-2.5 pr-10 text-[13px] font-bold focus:outline-none cursor-pointer w-[80px] hover:bg-gray-50 transition-colors">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                                                    <KeyboardArrowDownIcon sx={{ fontSize: 22 }} />
                                                </div>
                                            </div>
                                            <div className="text-base lg:text-[19px] font-bold text-black tracking-tighter">
                                                {formatCurrency(item.price)}
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
                                    <span className="text-black font-medium">{cartItems.length} item</span>
                                    <span className="text-black font-medium tracking-tight">{formatCurrency(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-black font-medium">Pengiriman</span>
                                    <span className="text-black font-medium">Gratis</span>
                                </div>
                            </div>

                            <div className="pt-7 border-t border-gray-100 flex justify-between items-baseline">
                                <span className="text-base font-black uppercase italic tracking-tighter">Total</span>
                                <span className="text-xl font-black tracking-tighter">{formatCurrency(totalAmount)}</span>
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
                                {/* Placeholders for payment icons with cleaner design */}
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

