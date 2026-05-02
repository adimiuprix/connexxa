"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import ButtonDark from "@/components/ButtonDark";
import FormInput from "@/components/FormInput";
import MediaUpload from "@/components/MediaUpload";

export default function AddProductPage() {
    const containerRef = useRef(null);
    const router = useRouter();
    const [productName, setProductName] = useState<string>('');
    const [productDescription, setProductDescription] = useState<string>('');
    const [productPrice, setProductPrice] = useState<string>('');
    const [productStock, setProductStock] = useState<string>('');
    const [productSku, setProductSku] = useState<string>('');
    const [productCategory, setProductCategory] = useState<string>('footwear');
    const [productColors, setProductColors] = useState<string>('');
    const [productImage, setProductImage] = useState<File[]>([]);
    const [productSizes, setProductSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(e.target.value);
    };

    const handleProductDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProductDescription(e.target.value);
    };

    const handleProductPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductPrice(e.target.value);
    };

    const handleProductStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductStock(e.target.value);
    };

    const handleProductSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductSku(e.target.value);
    };

    const handleProductCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProductCategory(e.target.value);
    };

    const handleProductColorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductColors(e.target.value);
    };

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

    const handleAddProduct = async () => {
        // kirim ke api /api/admin/product
        const response = await fetch('/api/admin/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: productName,
                description: productDescription,
                price: productPrice,
                stock: productStock,
                sku: productSku,
                categorySlug: productCategory,
                colors: productColors.split(',').map(c => c.trim()).filter(c => c !== ''),
                sizes: selectedSizes,
                images: [], 
            }),
        });
        const data = await response.json();
        if (response.ok) {
            router.push('/admin/product');
            // Reset form
            setProductName('');
            setProductDescription('');
            setProductPrice('');
            setProductStock('');
            setProductSku('');
            setProductCategory('footwear');
            setProductColors('');
            setSelectedSizes([]);
            setProductImage([]);
        } else {
            console.error("API Error:", data);
            alert(`Gagal menyimpan produk: ${data.message || data.error || 'Terjadi kesalahan server'}`);
        }
    };

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
                                    <FormInput
                                        type="text"
                                        id="productName"
                                        label="Nama Produk"
                                        value={productName}
                                        onChange={handleProductNameChange}
                                        placeholder="CONTOH: ADICOLOR CLASSICS HOODIE"
                                        className="!border-2 !border-transparent hover:!border-black focus:!border-black !px-6 !py-4 !text-sm !font-black !italic !uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Deskripsi</label>
                                    <textarea
                                        rows={5}
                                        value={productDescription}
                                        onChange={handleProductDescriptionChange}
                                        placeholder="DESKRIPSIKAN DETAIL MATERIAL, POTONGAN, DAN GAYA PRODUK..."
                                        className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-sm font-bold outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Media / Images */}
                        <MediaUpload onImagesChange={(files) => setProductImage(files)} />

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
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-black italic z-10">$</span>
                                        <FormInput
                                            type="number"
                                            value={productPrice}
                                            onChange={handleProductPriceChange}
                                            placeholder="0.00"
                                            className="!border-2 !border-transparent hover:!border-black focus:!border-black !pl-10 !pr-6 !py-4 !text-sm !font-black !italic"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Kuantitas Stok</label>
                                    <FormInput
                                        type="number"
                                        value={productStock}
                                        onChange={handleProductStockChange}
                                        placeholder="0"
                                        className="!border-2 !border-transparent hover:!border-black focus:!border-black !px-6 !py-4 !text-sm !font-black !italic"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">SKU (Opsional)</label>
                                    <FormInput
                                        type="text"
                                        value={productSku}
                                        onChange={handleProductSkuChange}
                                        placeholder="CONTOH: FTR-092-BLK"
                                        className="!border-2 !border-transparent hover:!border-black focus:!border-black !px-6 !py-4 !text-sm !font-black !italic !uppercase"
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
                                    <select
                                        value={productCategory}
                                        onChange={handleProductCategoryChange}
                                        className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-[12px] font-black italic uppercase outline-none transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="footwear">Footwear (Sepatu)</option>
                                        <option value="apparel">Apparel (Pakaian)</option>
                                        <option value="equipment">Equipment (Peralatan)</option>
                                        <option value="accessories">Accessories (Aksesoris)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Warna (Pisahkan dengan koma)</label>
                                    <FormInput
                                        type="text"
                                        value={productColors}
                                        onChange={handleProductColorsChange}
                                        placeholder="CONTOH: Black, White, Red"
                                        className="!border-2 !border-transparent hover:!border-black focus:!border-black !px-6 !py-4 !text-sm !font-black !italic !uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">Ukuran Tersedia</label>
                                    <div className="flex flex-wrap gap-3">
                                        {productSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => toggleSize(size)}
                                                className={`w-12 h-12 flex items-center justify-center border-2 font-black italic text-sm transition-all ${selectedSizes.includes(size)
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
                                onClick={() => { handleAddProduct() }}
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