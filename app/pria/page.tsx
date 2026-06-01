'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductBox from '@/components/ProductBox';

export const dynamic = 'force-dynamic';

interface Product {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    isWishlisted?: boolean;
}

type SortOption = 'terbaru' | 'harga-asc' | 'harga-desc' | 'nama-asc';

const SORT_LABELS: Record<SortOption, string> = {
    terbaru: 'Terbaru',
    'harga-asc': 'Harga: Terendah',
    'harga-desc': 'Harga: Tertinggi',
    'nama-asc': 'Nama: A–Z',
};

function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
        </div>
    );
}

export default function PriaPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sort, setSort] = useState<SortOption>('terbaru');
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await fetch('/api/products/male', {
                    cache: 'no-store',
                });
                if (!response.ok) throw new Error('Gagal memuat produk');
                const data = await response.json();
                setProducts(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const sortedProducts = [...products].sort((a, b) => {
        switch (sort) {
            case 'harga-asc':
                return a.price - b.price;
            case 'harga-desc':
                return b.price - a.price;
            case 'nama-asc':
                return (a.title || '').localeCompare(b.title || '');
            default:
                return 0;
        }
    });

    const productsData = sortedProducts.map((product) => ({
        id: product.id,
        name: product.title || 'Product',
        slug: product.slug,
        category: 'Pria',
        price: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(product.price),
        image: product.images[0] || '/placeholder.jpg',
        hoverImage: product.images[1] || null,
        isWishlisted: product.isWishlisted || false,
    }));

    return (
        <main className="min-h-screen bg-white">
            <section className="py-16">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-20">

                    {/* Header row */}
                    <div className="flex items-end justify-between mb-8">
                        <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-black">
                            PRODUK PRIA
                        </h1>

                        {/* Sort dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen((v) => !v)}
                                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                            >
                                <span>{SORT_LABELS[sort]}</span>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                                >
                                    <path
                                        d="M2 4l4 4 4-4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {isSortOpen && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg z-20">
                                    {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSort(key);
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-[12px] uppercase tracking-wider font-medium transition-colors hover:bg-gray-50 ${sort === key ? 'font-black text-black bg-gray-50' : 'text-gray-600'
                                                }`}
                                        >
                                            {SORT_LABELS[key]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product count */}
                    {!loading && !error && (
                        <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-6">
                            {products.length} Produk
                        </p>
                    )}

                    {/* States */}
                    {error ? (
                        <div className="py-24 text-center">
                            <p className="text-lg font-black italic uppercase tracking-tighter text-black">
                                Gagal memuat produk
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Terjadi kesalahan saat mengambil data. Silakan coba lagi.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-6 px-8 py-3 bg-black text-white text-[12px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : productsData.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-lg font-black italic uppercase tracking-tighter text-black">
                                Belum ada produk
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Koleksi pria akan segera hadir. Pantau terus!
                            </p>
                            <Link
                                href="/"
                                className="mt-6 inline-block px-8 py-3 bg-black text-white text-[12px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {productsData.map((product) => (
                                <ProductBox
                                    key={product.id}
                                    product={product}
                                    active={product.isWishlisted}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </section>
        </main>
    );
}
