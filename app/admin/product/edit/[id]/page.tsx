"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useRouter, useParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import ButtonDark from "@/components/ButtonDark";
import FormInput from "@/components/FormInput";
import MediaUpload from "@/components/MediaUpload";

export default function EditProductPage() {
    const containerRef = useRef(null);
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [productName, setProductName] = useState<string>('');
    const [productDescription, setProductDescription] = useState<string>('');
    const [productPrice, setProductPrice] = useState<string>('');
    const [productStock, setProductStock] = useState<string>('');
    const [productSku, setProductSku] = useState<string>('');
    const [productCategory, setProductCategory] = useState<string>('footwear');
    const [productColors, setProductColors] = useState<string>('');
    const [productImage, setProductImage] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [productSizes, setProductSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/admin/product?id=${productId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProductName(data.title);
                    setProductDescription(data.description || '');
                    setProductPrice(data.price.toString());
                    setProductStock(data.stock.toString());
                    setProductSku(data.sku);
                    setProductCategory(data.category?.slug || 'footwear');
                    setProductColors(data.colors?.join(', ') || '');
                    setExistingImages(data.images || []);
                    
                    if (data.sizes) {
                        const sizes = data.sizes.map((ps: any) => ps.size.value);
                        setSelectedSizes(sizes);
                    }
                } else {
                    alert("Gagal mengambil data produk");
                    router.push("/admin/product");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) fetchProduct();
    }, [productId, router]);

    const handleUpdate = async () => {
        try {
            // Log untuk menghindari warning unused variable dan untuk debugging
            if (productImage.length > 0) {
                console.log(`${productImage.length} gambar baru siap diunggah (implementasi Upload di langkah berikutnya)`);
            }

            const response = await fetch(`/api/admin/product?id=${productId}`, {
                method: 'PUT',
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
                    images: existingImages, // Saat ini hanya mengirim URL gambar lama yang tersisa
                }),
            });

            if (response.ok) {
                alert("Produk berhasil diperbarui!");
                router.push('/admin/product');
            } else {
                const error = await response.json();
                alert(`Gagal memperbarui produk: ${error.message || error.error}`);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Terjadi kesalahan saat memperbarui produk");
        }
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

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
                <div className="text-2xl font-black italic animate-pulse">LOADING DATA...</div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full min-h-screen bg-white font-sans selection:bg-black selection:text-white pb-32">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-32">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10 form-section">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-[3px] bg-black"></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Edit Entri: {productSku}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase leading-[0.75]">
                            EDIT<br />
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
                                <FormInput
                                    label="Nama Produk"
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="CONTOH: ADICOLOR CLASSICS HOODIE"
                                />
                                
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-black tracking-widest mb-2">Deskripsi</label>
                                    <textarea 
                                        rows={5}
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                        placeholder="DESKRIPSIKAN DETAIL MATERIAL, POTONGAN, DAN GAYA PRODUK..." 
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-black focus:bg-white px-6 py-4 text-[12px] font-bold outline-none transition-all resize-none tracking-widest"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Media / Images */}
                        <div className="form-section bg-white p-10 border border-gray-100 hover:border-black transition-all">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 pb-4 border-b-4 border-black">Media Produk</h2>
                            <MediaUpload
                                onImagesChange={setProductImage}
                            />
                            {existingImages.length > 0 && (
                                <div className="mt-10 pt-10 border-t border-gray-100">
                                    <label className="block text-[11px] font-black uppercase text-black tracking-widest mb-6">Gambar Saat Ini</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {existingImages.map((img, idx) => (
                                            <div key={idx} className="aspect-square border-2 border-black bg-gray-100 relative group overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                                                <img src={img} alt="Product" className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-white border-2 border-black flex items-center justify-center font-black opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-10">
                        
                        {/* Pricing & Stock */}
                        <div className="form-section bg-white p-10 border border-gray-100 hover:border-black transition-all">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 pb-4 border-b-4 border-black">Harga & Stok</h2>
                            
                            <div className="space-y-6">
                                <FormInput
                                    label="Harga (IDR)"
                                    type="number"
                                    value={productPrice}
                                    onChange={(e) => setProductPrice(e.target.value)}
                                    placeholder="0"
                                />
                                
                                <FormInput
                                    label="Kuantitas Stok"
                                    type="number"
                                    value={productStock}
                                    onChange={(e) => setProductStock(e.target.value)}
                                    placeholder="0"
                                />
                                
                                <FormInput
                                    label="SKU (Opsional)"
                                    type="text"
                                    value={productSku}
                                    onChange={(e) => setProductSku(e.target.value)}
                                    placeholder="CONTOH: FTR-092-BLK"
                                />
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="form-section bg-white p-10 border border-gray-100 hover:border-black transition-all">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 pb-4 border-b-4 border-black">Varian</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black uppercase text-black tracking-widest mb-3">Kategori</label>
                                    <select 
                                        value={productCategory} 
                                        onChange={(e) => setProductCategory(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 hover:border-black focus:border-black px-6 py-4 text-[11px] font-black italic uppercase outline-none transition-all cursor-pointer appearance-none tracking-widest"
                                    >
                                        <option value="footwear">Footwear (Sepatu)</option>
                                        <option value="apparel">Apparel (Pakaian)</option>
                                        <option value="equipment">Equipment (Peralatan)</option>
                                        <option value="accessories">Accessories (Aksesoris)</option>
                                    </select>
                                </div>

                                <FormInput
                                    label="Warna (Pisahkan koma)"
                                    type="text"
                                    value={productColors}
                                    onChange={(e) => setProductColors(e.target.value)}
                                    placeholder="Black, White, Blue"
                                />

                                <div>
                                    <label className="block text-[11px] font-black uppercase text-black tracking-widest mb-3">Ukuran Tersedia</label>
                                    <div className="flex flex-wrap gap-3">
                                        {productSizes.map((size) => (
                                            <button 
                                                key={size}
                                                type="button"
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
                                text="SIMPAN PERUBAHAN"
                                fullWidth
                                onClick={handleUpdate}
                                className="py-6 !text-sm !tracking-[0.3em] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
