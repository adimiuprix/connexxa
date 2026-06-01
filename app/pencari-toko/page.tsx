'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import CloseIcon from '@mui/icons-material/Close';
import type { Store } from '@/components/StoreMap';

// Leaflet harus dynamic import (no SSR)
const StoreMap = dynamic(() => import('@/components/StoreMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#f7f7f7] flex items-center justify-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
                Memuat peta...
            </p>
        </div>
    ),
});

// ── Dummy store data ──────────────────────────────────────────────────────────
const STORES: Store[] = [
    {
        id: 1,
        name: 'Connexxa Jakarta Pusat',
        address: 'Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat',
        city: 'Jakarta',
        hours: 'Senin–Minggu, 10.00–21.00',
        phone: '+62 21 1234 5678',
        lat: -6.1944,
        lng: 106.8229,
    },
    {
        id: 2,
        name: 'Connexxa Jakarta Selatan',
        address: 'Jl. Sudirman No. 52, Senayan, Jakarta Selatan',
        city: 'Jakarta',
        hours: 'Senin–Minggu, 10.00–22.00',
        phone: '+62 21 2345 6789',
        lat: -6.2297,
        lng: 106.8095,
    },
    {
        id: 3,
        name: 'Connexxa Bandung',
        address: 'Jl. Braga No. 10, Sumur Bandung, Bandung',
        city: 'Bandung',
        hours: 'Senin–Minggu, 10.00–21.00',
        phone: '+62 22 3456 7890',
        lat: -6.9175,
        lng: 107.6099,
    },
    {
        id: 4,
        name: 'Connexxa Surabaya',
        address: 'Jl. Pemuda No. 33, Genteng, Surabaya',
        city: 'Surabaya',
        hours: 'Senin–Minggu, 10.00–21.00',
        phone: '+62 31 4567 8901',
        lat: -7.2575,
        lng: 112.7521,
    },
    {
        id: 5,
        name: 'Connexxa Yogyakarta',
        address: 'Jl. Malioboro No. 18, Gedongtengen, Yogyakarta',
        city: 'Yogyakarta',
        hours: 'Senin–Minggu, 09.00–21.00',
        phone: '+62 274 5678 901',
        lat: -7.7956,
        lng: 110.3695,
    },
    {
        id: 6,
        name: 'Connexxa Medan',
        address: 'Jl. Gatot Subroto No. 30, Medan Petisah, Medan',
        city: 'Medan',
        hours: 'Senin–Minggu, 10.00–21.00',
        phone: '+62 61 6789 0123',
        lat: 3.5952,
        lng: 98.6722,
    },
    {
        id: 7,
        name: 'Connexxa Bali',
        address: 'Jl. Sunset Road No. 99, Kuta, Badung, Bali',
        city: 'Bali',
        hours: 'Senin–Minggu, 10.00–22.00',
        phone: '+62 361 7890 1234',
        lat: -8.7215,
        lng: 115.1685,
    },
    {
        id: 8,
        name: 'Connexxa Makassar',
        address: 'Jl. Sam Ratulangi No. 7, Makassar',
        city: 'Makassar',
        hours: 'Senin–Minggu, 10.00–21.00',
        phone: '+62 411 8901 2345',
        lat: -5.1477,
        lng: 119.4327,
    },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PencariTokoPage() {
    const [query, setQuery] = useState('');
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return STORES;
        return STORES.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.city.toLowerCase().includes(q) ||
                s.address.toLowerCase().includes(q)
        );
    }, [query]);

    const handleSelect = (store: Store) => {
        setSelectedStore(store);
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">

            {/* Hero */}
            <section className="bg-black text-white py-16 flex-shrink-0">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                    <nav className="text-[11px] tracking-wider text-gray-500 uppercase mb-4 flex items-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <span>/</span>
                        <span className="text-gray-300 font-semibold">Pencari Toko</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                        PENCARI TOKO
                    </h1>
                    <p className="mt-4 text-[13px] text-gray-400 max-w-lg leading-relaxed">
                        Temukan toko Connexxa terdekat di kotamu.
                    </p>
                </div>
            </section>

            {/* Main content */}
            <section className="flex-1 flex flex-col lg:flex-row min-h-0">

                {/* Sidebar */}
                <div className="lg:w-[380px] flex-shrink-0 flex flex-col border-r border-gray-200">

                    {/* Search */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center bg-[#f7f7f7] border border-transparent focus-within:border-black transition-colors">
                            <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} className="ml-3 flex-shrink-0" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari kota atau nama toko..."
                                className="flex-1 bg-transparent px-3 py-3 text-[13px] font-medium placeholder:text-gray-400 focus:outline-none"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="mr-3 text-gray-400 hover:text-black transition-colors"
                                >
                                    <CloseIcon sx={{ fontSize: 16 }} />
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-2">
                            {filtered.length} toko ditemukan
                        </p>
                    </div>

                    {/* Store list */}
                    <div className="flex-1 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-[12px] font-black uppercase tracking-widest text-black">
                                    Toko tidak ditemukan
                                </p>
                                <p className="text-[11px] text-gray-500 mt-1">
                                    Coba kata kunci lain
                                </p>
                            </div>
                        ) : (
                            filtered.map((store) => {
                                const isActive = selectedStore?.id === store.id;
                                return (
                                    <button
                                        key={store.id}
                                        onClick={() => handleSelect(store)}
                                        className={`w-full text-left px-5 py-5 border-b border-gray-100 transition-colors group ${isActive
                                                ? 'bg-black text-white'
                                                : 'bg-white hover:bg-[#f7f7f7]'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className={`text-[13px] font-black uppercase tracking-tight truncate ${isActive ? 'text-white' : 'text-black'}`}>
                                                    {store.name}
                                                </p>
                                                <div className={`mt-2 space-y-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    <div className="flex items-start gap-2">
                                                        <LocationOnOutlinedIcon sx={{ fontSize: 13 }} className="flex-shrink-0 mt-0.5" />
                                                        <p className="text-[11px] leading-snug">{store.address}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} className="flex-shrink-0" />
                                                        <p className="text-[11px]">{store.hours}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <LocalPhoneOutlinedIcon sx={{ fontSize: 13 }} className="flex-shrink-0" />
                                                        <p className="text-[11px]">{store.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <LocationOnOutlinedIcon
                                                sx={{ fontSize: 18 }}
                                                className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-black'} transition-colors`}
                                            />
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Map */}
                <div className="flex-1 h-[500px] lg:h-auto relative">
                    {/* Leaflet CSS */}
                    <link
                        rel="stylesheet"
                        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                        crossOrigin=""
                    />
                    <StoreMap
                        stores={filtered}
                        selectedStore={selectedStore}
                        onSelectStore={handleSelect}
                    />
                </div>

            </section>
        </main>
    );
}
