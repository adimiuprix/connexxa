'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FormInput from '@/components/FormInput';
import ButtonDark from '@/components/ButtonDark';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CART_SESSION_KEY } from '@/libs/cartSync';
import PaymentOption from '@/components/PaymentOption';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface CartItem {
    id: string | number;
    title: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
}

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('va');
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    useEffect(() => {
        const fetchCart = async () => {
            const sessionId = localStorage.getItem(CART_SESSION_KEY);
            if (!sessionId) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/cart?sessionId=${sessionId}`);
                const data = await response.json();
                if (data.items) {
                    setCartItems(data.items);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, []);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // Gratis Ongkir
    const total = subtotal + shipping;

    useGSAP(() => {
        gsap.from('.checkout-container', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from('.stagger-item', {
            opacity: 0,
            x: -20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.3
        });
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="bg-white min-h-screen pt-10 pb-20 px-4 md:px-8 lg:px-16 checkout-container">
            {/* Header / Breadcrumbs */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex items-center gap-2 mb-6">
                    <Link href="/cart" className="flex items-center text-[12px] font-bold uppercase tracking-widest hover:underline">
                        <ArrowBackIosNewIcon sx={{ fontSize: 14, mr: 1 }} />
                        Kembali ke Keranjang
                    </Link>
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
                    Checkout
                </h1>
                <br />
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    <span className={step >= 1 ? 'text-black underline decoration-2 underline-offset-4' : ''}>Pengiriman</span>
                    <ChevronRightIcon sx={{ fontSize: 16 }} />
                    <span className={step >= 2 ? 'text-black underline decoration-2 underline-offset-4' : ''}>Pembayaran</span>
                    <ChevronRightIcon sx={{ fontSize: 16 }} />
                    <span className={step >= 3 ? 'text-black underline decoration-2 underline-offset-4' : ''}>Selesai</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Forms */}
                <div className="lg:col-span-7 space-y-12">
                    {step === 1 && (
                        <section className="stagger-item">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black italic">1</div>
                                <h2 className="text-xl font-black italic uppercase tracking-tight">Informasi Pengiriman</h2>
                            </div>

                            <div className="space-y-4">
                            <FormInput
                                label="Alamat Email"
                                placeholder="nama@email.com"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Nama Depan"
                                    placeholder="Masukkan nama depan"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                                <FormInput
                                    label="Nama Belakang"
                                    placeholder="Masukkan nama belakang"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>

                            <FormInput
                                label="Alamat Lengkap"
                                placeholder="Jalan, Nomor Rumah, Apartemen, dsb."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Kota"
                                    placeholder="Contoh: Jakarta"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                                <FormInput
                                    label="Kode Pos"
                                    placeholder="12345"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                />
                            </div>

                            <FormInput
                                label="Nomor Telepon"
                                placeholder="0812xxxxxxx"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        </section>
                    )}

                    {step === 2 && (
                        <section className="stagger-item">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black italic">2</div>
                                <h2 className="text-xl font-black italic uppercase tracking-tight">Metode Pembayaran</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <PaymentOption
                                    id="va"
                                    title="Virtual Account (Transfer Bank)"
                                    description="BCA, Mandiri, BNI, BRI"
                                    isSelected={paymentMethod === 'va'}
                                    onSelect={setPaymentMethod}
                                    icon={<AccountBalanceOutlinedIcon />}
                                />
                                <PaymentOption
                                    id="cc"
                                    title="Kartu Kredit / Debit"
                                    description="Visa, Mastercard, JCB"
                                    isSelected={paymentMethod === 'cc'}
                                    onSelect={setPaymentMethod}
                                    icon={<CreditCardOutlinedIcon />}
                                />
                                <PaymentOption
                                    id="wallet"
                                    title="E-Wallet"
                                    description="GoPay, OVO, Dana, ShopeePay"
                                    isSelected={paymentMethod === 'wallet'}
                                    onSelect={setPaymentMethod}
                                    icon={<WalletOutlinedIcon />}
                                />
                            </div>
                        </section>
                    )}

                    <div className="pt-4 stagger-item">
                        {step === 1 ? (
                            <ButtonDark
                                text="Lanjutkan ke Pembayaran"
                                fullWidth
                                className="py-5 text-[15px]"
                                icon={<ChevronRightIcon />}
                                onClick={() => setStep(2)}
                            />
                        ) : step === 2 ? (
                            <>
                                <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                                    Dengan mengklik 'Bayar Sekarang', Anda menyetujui <Link href="/terms" className="underline hover:text-black">Syarat dan Ketentuan</Link> serta <Link href="/privacy" className="underline hover:text-black">Kebijakan Privasi</Link> Connexxa. Kami akan memproses pesanan Anda sesuai dengan data yang Anda berikan.
                                </p>
                                <ButtonDark
                                    text="Bayar Sekarang"
                                    fullWidth
                                    className="py-5 text-[15px]"
                                    icon={<ChevronRightIcon />}
                                    onClick={() => setStep(3)}
                                />
                                <button 
                                    onClick={() => setStep(1)}
                                    className="mt-6 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors block mx-auto underline underline-offset-4"
                                >
                                    Kembali ke Pengiriman
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-10">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Pembayaran Berhasil!</h2>
                                <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-8">Terima kasih telah berbelanja di Connexxa. Nomor pesanan Anda adalah #CNX-{Math.floor(Math.random() * 100000)}</p>
                                <Link href="/">
                                    <ButtonDark text="Lanjut Belanja" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-gray-50 p-6 md:p-8 border border-gray-100">
                            <h2 className="text-xl font-black italic uppercase tracking-tight mb-8">Ringkasan Pesanan</h2>

                            {/* Items List */}
                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex gap-4 animate-pulse">
                                                <div className="w-20 h-24 bg-gray-200" />
                                                <div className="flex-grow space-y-2">
                                                    <div className="h-3 bg-gray-200 w-3/4" />
                                                    <div className="h-2 bg-gray-200 w-1/2" />
                                                    <div className="h-2 bg-gray-200 w-1/4" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={item.image || '/placeholder-product.png'}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-bold text-[12px] uppercase tracking-wider leading-tight truncate">
                                                    {item.title}
                                                </h3>
                                                <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">
                                                    Warna: {item.color}
                                                </p>
                                                <p className="text-[11px] text-gray-500 uppercase tracking-widest">
                                                    Ukuran: {item.size}
                                                </p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-[11px] font-bold">QTY: {item.quantity}</span>
                                                    <span className="font-bold text-[12px]">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Keranjang Kosong</p>
                                        <Link href="/" className="inline-block mt-4 text-[10px] underline uppercase tracking-widest font-black italic">
                                            Mulai Belanja
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Pricing Details */}
                            <div className="space-y-3 pt-6 border-t border-gray-200">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-gray-600 uppercase tracking-widest">Subtotal</span>
                                    <span className="font-bold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-gray-600 uppercase tracking-widest">Pengiriman</span>
                                    <span className="font-bold text-green-600 uppercase tracking-widest">Gratis</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-gray-600 uppercase tracking-widest">Pajak (Termasuk)</span>
                                    <span className="font-bold">{formatPrice(0)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black italic uppercase tracking-tighter pt-4 border-t border-gray-200 mt-4">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="KODE PROMO"
                                        className="flex-grow p-3 bg-white border border-gray-200 outline-none focus:border-black text-[12px] font-bold tracking-widest"
                                    />
                                    <button className="px-6 py-3 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                        Gunakan
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Badges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center p-4 border border-gray-100 text-center">
                                <LockOutlinedIcon className="mb-2 text-gray-400" sx={{ fontSize: 24 }} />
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Keamanan Terjamin</span>
                            </div>
                            <div className="flex flex-col items-center p-4 border border-gray-100 text-center">
                                <VerifiedUserOutlinedIcon className="mb-2 text-gray-400" sx={{ fontSize: 24 }} />
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Produk 100% Original</span>
                            </div>
                        </div>

                        {/* Shipping Info Card */}
                        <div className="p-6 border border-gray-100 flex items-start gap-4">
                            <LocalShippingOutlinedIcon className="text-black" sx={{ fontSize: 20 }} />
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">Pengiriman Standar</h4>
                                <p className="text-[11px] text-gray-500 leading-relaxed uppercase tracking-wider">
                                    Estimasi tiba dalam 2-4 hari kerja (Gratis Ongkir ke seluruh Indonesia).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;
