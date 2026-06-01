"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import Link from 'next/link';

interface SearchProduct {
    id: number;
    title: string;
    slug: string;
    price: number;
    images: string[];
    gender?: string | null;
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    // Fetch results when debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(
                    `/api/products?q=${encodeURIComponent(debouncedQuery)}`,
                    { cache: 'no-store' }
                );
                if (!res.ok) throw new Error();
                const data: SearchProduct[] = await res.json();
                setResults(data);
                setIsOpen(true);
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchResults();
    }, [debouncedQuery]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClear = useCallback(() => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    }, []);

    const handleSelect = useCallback(() => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    }, []);

    return (
        <div ref={containerRef} className="hidden lg:block relative">
            {/* Input */}
            <div className="flex items-center bg-[#eaebed] px-3 py-1.5 w-[190px] transition-all border border-transparent focus-within:border-gray-400 focus-within:w-[260px]">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder="Cari"
                    className="bg-transparent text-[13px] focus:outline-none w-full placeholder:text-gray-500 font-medium"
                    autoComplete="off"
                />
                {query ? (
                    <button onClick={handleClear} className="text-gray-400 hover:text-black transition-colors flex-shrink-0">
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                ) : (
                    <SearchIcon sx={{ fontSize: 20, color: '#000000' }} className="flex-shrink-0" />
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-[320px] bg-white border border-gray-200 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] z-50">
                    {isLoading ? (
                        <div className="px-4 py-6 text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 animate-pulse">
                            Mencari...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-black">
                                Tidak ditemukan
                            </p>
                            <p className="text-[11px] text-gray-500 mt-1">
                                Coba kata kunci lain
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {results.length} hasil untuk &ldquo;{debouncedQuery}&rdquo;
                                </p>
                            </div>
                            <ul className="max-h-[360px] overflow-y-auto">
                                {results.map((product) => (
                                    <li key={product.id}>
                                        <Link
                                            href={`/product_items/${product.slug}`}
                                            onClick={handleSelect}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative w-12 h-12 flex-shrink-0 bg-[#ebedee] overflow-hidden">
                                                {product.images[0] && (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.title}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[12px] font-bold uppercase tracking-tight text-black truncate">
                                                    {product.title}
                                                </p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 capitalize">
                                                    {product.gender ?? 'Semua'}
                                                </p>
                                                <p className="text-[12px] font-bold text-black mt-0.5">
                                                    {formatCurrency(product.price)}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
