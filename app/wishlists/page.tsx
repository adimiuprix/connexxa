"use client";

import React from 'react';
import ButtonDark from '@/components/ButtonDark';
import CloseIcon from '@mui/icons-material/Close';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

const dummyWishlists = [
    {
        id: 1,
        name: "SEPATU LOAFER HANDBALL SPEZIAL",
        price: "Rp.2.200.000,00",
        color: "Aurora Coffee / Aurora Coffee / Gum",
        image: "https://placehold.co/400x400/f5f5f5/f5f5f5", 
    },
    {
        id: 2,
        name: "Sepatu Handball Spezial",
        price: "Rp.1.900.000,00",
        color: "Earth Strata / Off White / Gum",
        image: "https://placehold.co/400x400/f5f5f5/f5f5f5",
    }
];

const WishlistsPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-[16px] sm:text-[18px] font-bold uppercase tracking-widest mb-8 flex items-center">
                WISHLIST SAYA <span className="font-normal text-gray-500 text-sm ml-2 normal-case">[2 items]</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {dummyWishlists.map((item) => (
                    <div key={item.id} className="flex flex-col group">
                        {/* Image Container */}
                        <div className="relative aspect-square bg-[#f5f5f5] mb-4">
                            {/* Close Button */}
                            <button className="absolute top-0 right-0 w-8 h-8 bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors z-10">
                                <CloseIcon sx={{ fontSize: 18 }} />
                            </button>
                            {/* Image Placeholder */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-grow">
                            <h2 className="text-[12px] uppercase tracking-wide text-black mb-1">{item.name}</h2>
                            <p className="text-[13px] text-black mb-1">{item.price}</p>
                            <p className="text-[12px] text-gray-500 mb-4">Warna: {item.color}</p>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mt-auto">
                            <ButtonDark 
                                text="Tambahkan Ke Tas" 
                                fullWidth={true} 
                                icon={<LocalMallOutlinedIcon sx={{ fontSize: 20 }} className="ml-3" />}
                                className="w-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistsPage;