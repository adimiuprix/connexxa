'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CART_SESSION_KEY, dispatchCartSync } from '@/libs/cartSync';
import { createClient } from '@/libs/supabaseClient';
import RadioButton from '@/components/RadioButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Page = () => {
    const params = useParams();
    const detail = params.detail as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('Black');
    const [showDescription, setShowDescription] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${detail}`);
                const data = await response.json();
                if (response.ok) {
                    setProduct(data);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (detail) {
            fetchProduct();
        }
    }, [detail]);

    // Generate atau ambil sessionId dari localStorage
    const getSessionId = useCallback(() => {
        if (typeof window === 'undefined') return '';
        let sessionId = localStorage.getItem(CART_SESSION_KEY);
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem(CART_SESSION_KEY, sessionId);
        }
        return sessionId;
    }, []);

    // Handler: Simpan ke Wishlist
    const handleAddToWishlist = async () => {
        if (!product) return;

        // Cek auth
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setCartMessage('⚠️ Silakan login terlebih dahulu untuk menyimpan ke Wishlist');
            setTimeout(() => setCartMessage(''), 4000);
            return;
        }

        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id }),
            });

            const data = await response.json();

            if (response.ok) {
                const icon = data.action === 'added' ? '✅' : '🗑️';
                setCartMessage(`${icon} ${data.message}`);
            } else {
                setCartMessage(`❌ ${data.error || 'Gagal memproses wishlist'}`);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            setCartMessage('❌ Terjadi kesalahan koneksi. Coba lagi.');
        } finally {
            setTimeout(() => setCartMessage(''), 4000);
        }
    };

    // Handler: Tambahkan ke Cart
    const handleAddToCart = async () => {
        if (!product) return;

        // Cek apakah user sudah login
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setCartMessage('⚠️ Silakan login terlebih dahulu untuk belanja');
            setTimeout(() => setCartMessage(''), 4000);
            return;
        }

        if (!selectedSize) {
            setCartMessage('⚠️ Silakan pilih ukuran terlebih dahulu');
            setTimeout(() => setCartMessage(''), 3000);
            return;
        }

        setIsAddingToCart(true);
        setCartMessage('');

        try {
            const sessionId = getSessionId();
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    productId: product.id,
                    title: product.title,
                    size: selectedSize,
                    color: selectedColor,
                    price: product.price,
                    quantity: 1,
                    image: product.images[0],
                }),
            });

            const data = await response.json();

            if (response.ok) {
                dispatchCartSync({
                    sessionId,
                    totalItems: data.totalItems,
                });
                setCartMessage(`✅ ${data.message} (${data.totalItems} item di tas)`);
            } else {
                setCartMessage(`❌ ${data.error}`);
            }
        } catch (error) {
            setCartMessage('❌ Gagal menambahkan ke tas. Coba lagi.');
        } finally {
            setIsAddingToCart(false);
            setTimeout(() => setCartMessage(''), 4000);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-white text-black font-bold uppercase tracking-widest">Memuat...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center bg-white text-black font-bold uppercase tracking-widest">Produk tidak ditemukan</div>;
    }

    const productImages: string[] = product.images.length > 0 ? product.images : ['/placeholder.jpg'];

    const sizeOptions: { label: string; value: string; disabled: boolean }[] = product.sizes.map((ps: any) => ({
        label: ps.size.value,
        value: ps.size.value,
        disabled: ps.available !== 'true'
    }));

    const reviewCount = product.tot_review || 0;
    const averageRating = reviewCount > 0
        ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount
        : 0;

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center text-black">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= Math.round(rating)
                        ? <StarIcon key={star} sx={{ fontSize: 16 }} />
                        : <StarBorderIcon key={star} sx={{ fontSize: 16 }} />
                ))}
            </div>
        );
    };

    return (
        <div className="pt-6 pb-20">
            {/* Breadcrumb */}
            <nav className="px-4 lg:px-12 py-3 text-[11px] tracking-wider text-gray-500 uppercase">
                <ol className="flex items-center gap-2">
                    <li><Link href="/" className="hover:text-black transition-colors">Beranda</Link></li>
                    <li>/</li>
                    <li><Link href="/" className="hover:text-black transition-colors">Wanita</Link></li>
                    <li>/</li>
                    <li><Link href="/" className="hover:text-black transition-colors">Pakaian</Link></li>
                    <li>/</li>
                    <li className="text-black font-semibold">{product.title}</li>
                </ol>
            </nav>

            {/* Main Product Section */}
            <div className="flex flex-col lg:flex-row">

                {/* Left: Image Gallery */}
                <div className="lg:w-[60%] flex flex-col-reverse lg:flex-row">

                    {/* Thumbnail Strip */}
                    <div className="flex lg:flex-col gap-1 px-4 lg:px-2 lg:pl-4 mt-2 lg:mt-0 overflow-x-auto lg:overflow-y-auto lg:max-h-[700px]">
                        {productImages.map((img: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`
                                    relative flex-shrink-0 w-16 h-16 lg:w-[72px] lg:h-[72px] overflow-hidden
                                    border-2 transition-all duration-150
                                    ${selectedImage === i ? 'border-black' : 'border-transparent hover:border-gray-400'}
                                `}
                            >
                                <Image
                                    src={img}
                                    alt={`Product thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 px-4 lg:px-2">
                        <div className="relative aspect-[3/4] bg-[#ebedee] overflow-hidden group">
                            <Image
                                src={productImages[selectedImage]}
                                alt="Product image"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            {/* Wishlist button on image */}
                            <button className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200">
                                <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="lg:w-[40%] px-4 lg:px-12 lg:pr-16 mt-8 lg:mt-0">

                    {/* Category badge */}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">Wanita • Pakaian</span>
                    </div>

                    {/* Product Title */}
                    <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-black leading-tight not-italic">
                        {product.title}
                    </h1>

                    {/* Price */}
                    <div className="mt-3 flex items-center gap-3">
                        <span className="text-xl font-bold text-black">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                        </span>
                    </div>

                    {/* Ratings */}
                    <div className="mt-3 flex items-center gap-2">
                        {renderStars(averageRating)}
                        <span className="text-xs font-medium text-gray-500">({reviewCount} Ulasan)</span>
                    </div>

                    {/* Color */}
                    <div className="mt-6">
                        <p className="text-xs font-semibold text-black uppercase tracking-wider mb-2">Warna: <span className="font-normal text-gray-600">{selectedColor}</span></p>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedColor('Black')} className={`w-8 h-8 bg-black border-2 transition-colors ${selectedColor === 'Black' ? 'border-black' : 'border-gray-300 hover:border-black'}`} title="Black" />
                            <button onClick={() => setSelectedColor('White')} className={`w-8 h-8 bg-white border-2 transition-colors ${selectedColor === 'White' ? 'border-black' : 'border-gray-300 hover:border-black'}`} title="White" />
                            <button onClick={() => setSelectedColor('Brown')} className={`w-8 h-8 bg-[#8B4513] border-2 transition-colors ${selectedColor === 'Brown' ? 'border-black' : 'border-gray-300 hover:border-black'}`} title="Brown" />
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-semibold text-black uppercase tracking-wider">Ukuran</p>
                            <button className="text-[11px] font-semibold text-black underline uppercase tracking-wider hover:no-underline">
                                Panduan ukuran
                            </button>
                        </div>
                        <RadioButton
                            name="size"
                            options={sizeOptions}
                            onChange={(val) => setSelectedSize(val)}
                        />
                        {!selectedSize && (
                            <p className="text-[11px] text-red-600 mt-2 font-medium">Silakan pilih ukuran</p>
                        )}
                        {sizeOptions.find(s => s.value === selectedSize && !s.disabled) && (
                            <p className="text-[11px] text-green-700 mt-2 font-medium">Stok tersedia</p>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-6 space-y-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            className={`group w-full h-[52px] font-bold uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 transition-colors duration-200 ${isAddingToCart
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            <span>{isAddingToCart ? 'Menambahkan...' : 'Tambahkan ke Tas'}</span>
                            {!isAddingToCart && (
                                <ArrowForwardIcon className="transition-transform duration-200 group-hover:translate-x-1" sx={{ fontSize: 18 }} />
                            )}
                        </button>

                        {cartMessage && (
                            <p className={`text-[12px] font-medium text-center py-2 ${cartMessage.startsWith('✅') ? 'text-green-700 bg-green-50' :
                                cartMessage.startsWith('⚠️') ? 'text-yellow-700 bg-yellow-50' :
                                    'text-red-700 bg-red-50'
                                }`}>
                                {cartMessage}
                            </p>
                        )}

                        <button onClick={handleAddToWishlist} className="w-full h-[52px] bg-white text-black border border-black font-bold uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all duration-200">
                            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                            <span>Simpan ke Wishlist</span>
                        </button>
                    </div>

                    {/* Delivery Info */}
                    <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">
                        <div className="flex items-start gap-3">
                            <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} className="mt-0.5 text-black" />
                            <div>
                                <p className="text-xs font-bold text-black uppercase tracking-wide">Gratis Ongkir</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">Untuk pesanan di atas Rp 1.000.000</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CachedIcon sx={{ fontSize: 20 }} className="mt-0.5 text-black" />
                            <div>
                                <p className="text-xs font-bold text-black uppercase tracking-wide">Pengembalian Gratis</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">Pengembalian gratis dalam 30 hari</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <VerifiedOutlinedIcon sx={{ fontSize: 20 }} className="mt-0.5 text-black" />
                            <div>
                                <p className="text-xs font-bold text-black uppercase tracking-wide">Produk Original</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">100% produk asli bergaransi</p>
                            </div>
                        </div>
                    </div>

                    {/* Share */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <button className="flex items-center gap-2 text-xs font-semibold text-black uppercase tracking-wider hover:text-gray-600 transition-colors">
                            <ShareIcon sx={{ fontSize: 16 }} />
                            <span>Bagikan</span>
                        </button>
                    </div>

                    {/* Accordion: Description */}
                    <div className="mt-6 border-t border-gray-200">
                        <button
                            onClick={() => setShowDescription(!showDescription)}
                            className="w-full flex justify-between items-center py-5"
                        >
                            <span className="text-sm font-bold text-black uppercase tracking-wider">Deskripsi</span>
                            {showDescription
                                ? <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />
                                : <KeyboardArrowDownIcon sx={{ fontSize: 24 }} />
                            }
                        </button>
                        {showDescription && (
                            <div className="pb-6 text-[13px] text-gray-700 leading-relaxed space-y-4">
                                <p>
                                    {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                </p>
                                <ul className="space-y-2 text-[12px]">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 bg-black rounded-full mt-1.5 flex-shrink-0" />
                                        <span>Potongan reguler dengan siluet yang menyanjung</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 bg-black rounded-full mt-1.5 flex-shrink-0" />
                                        <span>Bahan katun premium dengan sentuhan lembut</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 bg-black rounded-full mt-1.5 flex-shrink-0" />
                                        <span>Resleting tersembunyi di bagian belakang</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1 h-1 bg-black rounded-full mt-1.5 flex-shrink-0" />
                                        <span>Panjang: 110 cm (ukuran M)</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Accordion: Details */}
                    <div className="border-t border-gray-200">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="w-full flex justify-between items-center py-5"
                        >
                            <span className="text-sm font-bold text-black uppercase tracking-wider">Detail Produk</span>
                            {showDetails
                                ? <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />
                                : <KeyboardArrowDownIcon sx={{ fontSize: 24 }} />
                            }
                        </button>
                        {showDetails && (
                            <div className="pb-6 text-[12px] text-gray-700 space-y-2">
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="font-semibold text-black">SKU</span>
                                    <span>{product.sku}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="font-semibold text-black">Warna</span>
                                    <span>Core Black</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="font-semibold text-black">Material</span>
                                    <span>95% Katun, 5% Elastane</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="font-semibold text-black">Negara Asal</span>
                                    <span>Indonesia</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Accordion: Delivery & Returns */}
                    <div className="border-t border-gray-200">
                        <button
                            onClick={() => setShowDelivery(!showDelivery)}
                            className="w-full flex justify-between items-center py-5"
                        >
                            <span className="text-sm font-bold text-black uppercase tracking-wider">Pengiriman & Pengembalian</span>
                            {showDelivery
                                ? <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />
                                : <KeyboardArrowDownIcon sx={{ fontSize: 24 }} />
                            }
                        </button>
                        {showDelivery && (
                            <div className="pb-6 text-[12px] text-gray-700 leading-relaxed space-y-3">
                                <p>
                                    Pesanan dikirim dalam 1-3 hari kerja setelah pembayaran dikonfirmasi.
                                    Gratis ongkos kirim untuk seluruh wilayah Indonesia dengan minimum pembelian Rp 1.000.000.
                                </p>
                                <p>
                                    Produk dapat dikembalikan dalam waktu 30 hari setelah diterima dengan kondisi tag masih terpasang
                                    dan produk belum pernah digunakan.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-gray-200" />

                </div>
            </div>
        </div>
    );
};

export default Page;
