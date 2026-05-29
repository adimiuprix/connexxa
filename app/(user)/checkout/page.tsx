'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { CART_SESSION_KEY, dispatchCartSync } from '@/libs/cartSync';
import PaymentOption from '@/components/PaymentOption';
import { createClient } from '@/libs/supabaseClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface CartItem {
    id: number;
    title: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
    productId: number;
}

interface FormData {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
}

interface FormErrors {
    email?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
}

const CheckoutPage = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [isPaid, setIsPaid] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('va');
    const [orderNumber, setOrderNumber] = useState('');
    const [orderError, setOrderError] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    // 1. Cek autentikasi — redirect ke login jika belum login
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Simpan halaman tujuan agar bisa kembali setelah login
                router.replace('/?auth=login&redirect=/checkout');
                return;
            }

            // Pre-fill email dari Supabase
            setFormData((prev) => ({ ...prev, email: user.email ?? '' }));
            setIsAuthChecking(false);
        };

        checkAuth();
    }, [router]);

    // 2. Ambil cart dari API
    useEffect(() => {
        if (isAuthChecking) return;

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
    }, [isAuthChecking]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0;
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

    // Animasi transisi antar step
    useGSAP(() => {
        gsap.from('.step-content', {
            opacity: 0,
            y: 16,
            duration: 0.4,
            ease: 'power2.out',
        });
    }, [step]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // 3. Validasi form Step 1
    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!formData.email) {
            errors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Format email tidak valid';
        }

        if (!formData.firstName.trim()) errors.firstName = 'Nama depan wajib diisi';
        if (!formData.lastName.trim()) errors.lastName = 'Nama belakang wajib diisi';
        if (!formData.address.trim()) errors.address = 'Alamat wajib diisi';
        if (!formData.city.trim()) errors.city = 'Kota wajib diisi';

        if (!formData.postalCode.trim()) {
            errors.postalCode = 'Kode pos wajib diisi';
        } else if (!/^\d{5}$/.test(formData.postalCode)) {
            errors.postalCode = 'Kode pos harus 5 digit angka';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Nomor telepon wajib diisi';
        } else if (!/^(\+62|62|0)[0-9]{8,12}$/.test(formData.phone.replace(/\s/g, ''))) {
            errors.phone = 'Format nomor telepon tidak valid';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleContinueToPayment = () => {
        if (validateForm()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 4. Proses order ke database
    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;

        setIsSubmitting(true);
        setOrderError('');

        const sessionId = localStorage.getItem(CART_SESSION_KEY);
        if (!sessionId) {
            setOrderError('Session tidak ditemukan. Silakan refresh halaman.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    cartItemIds: cartItems.map((item) => item.id),
                    shippingInfo: formData,
                    paymentMethod,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setOrderError(data.error || 'Terjadi kesalahan saat memproses pesanan.');
                setIsSubmitting(false);
                return;
            }

            // Sukses — simpan nomor order dan perbarui state cart
            setOrderNumber(data.orderNumber);

            // Update cart items local — hapus yang sudah di-order
            const orderedIds = new Set(cartItems.map((item) => item.id));
            const remainingItems = cartItems.filter((item) => !orderedIds.has(item.id));
            setCartItems(remainingItems);

            // Dispatch event agar Header cart count ikut ter-update
            dispatchCartSync({
                sessionId,
                totalItems: remainingItems.reduce((sum, item) => sum + item.quantity, 0),
            });

            if (paymentMethod === 'whatsapp') {
                const adminPhone = '6289635601497'; // Nomor WhatsApp Admin
                const itemList = cartItems.map(item => `- ${item.quantity}x ${item.title} (${item.size}, ${item.color}) - ${formatPrice(item.price * item.quantity)}`).join('\n');
                const message = `Halo Admin Connexxa,\n\nSaya ingin mengonfirmasi pesanan dengan metode Manual (WhatsApp).\n\n*Nomor Pesanan:* ${data.orderNumber}\n*Total Tagihan:* ${formatPrice(total)}\n\n*Rincian Pesanan:*\n${itemList}\n\n*Dikirim ke:*\n${formData.firstName} ${formData.lastName}\n${formData.address}, ${formData.city} ${formData.postalCode}\n${formData.phone}\n\nMohon informasi rekening untuk transfer. Terima kasih.`;
                const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
                window.open(waUrl, '_blank');
                setIsPaid(true);
            } else {
                setIsPaid(false);
            }

            setStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error('Order error:', err);
            setOrderError('Koneksi gagal. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tampilkan loading auth check
    if (isAuthChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Memverifikasi akun...</p>
                </div>
            </div>
        );
    }

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
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
                    Checkout
                </h1>

                {/* Step Indicator */}
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-black' : 'text-gray-300'}`}>
                        <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-black border-2 ${step >= 1 ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-300'}`}>
                            {step > 1 ? '✓' : '1'}
                        </span>
                        <span className={step >= 1 ? 'underline decoration-2 underline-offset-4' : ''}>Pengiriman</span>
                    </div>
                    <span className="text-gray-300 text-xs">›</span>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>
                        <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-black border-2 ${step >= 2 ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-300'}`}>
                            {step > 2 ? '✓' : '2'}
                        </span>
                        <span className={step >= 2 ? 'underline decoration-2 underline-offset-4' : ''}>Pembayaran</span>
                    </div>
                    <span className="text-gray-300 text-xs">›</span>
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-black' : 'text-gray-300'}`}>
                        <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-black border-2 ${step >= 3 ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-300'}`}>
                            3
                        </span>
                        <span className={step >= 3 ? 'underline decoration-2 underline-offset-4' : ''}>Selesai</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-12">

                    {/* STEP 1 — Informasi Pengiriman */}
                    {step === 1 && (
                        <section className="stagger-item step-content">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black italic">1</div>
                                <h2 className="text-xl font-black italic uppercase tracking-tight">Informasi Pengiriman</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <FormInput
                                        label="Alamat Email"
                                        placeholder="nama@email.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                                        }}
                                    />
                                    {formErrors.email && <p className="mt-1 text-[11px] font-bold text-red-500 uppercase tracking-wider">{formErrors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <FormInput
                                            label="Nama Depan"
                                            placeholder="Masukkan nama depan"
                                            value={formData.firstName}
                                            onChange={(e) => {
                                                setFormData({ ...formData, firstName: e.target.value });
                                                if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: undefined });
                                            }}
                                        />
                                        {formErrors.firstName && <p className="mt-1 text-[11px] font-bold text-red-500 uppercase tracking-wider">{formErrors.firstName}</p>}
                                    </div>
                                    <div>
                                        <FormInput
                                            label="Nama Belakang"
                                            placeholder="Masukkan nama belakang"
                                            value={formData.lastName}
                                            onChange={(e) => {
                                                setFormData({ ...formData, lastName: e.target.value });
                                                if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: undefined });
                                            }}
                                        />
                                        {formErrors.lastName && <p className="mt-1 text-[11px] font-bold text-red-500 uppercase tracking-wider">{formErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <FormInput
                                        label="Alamat Lengkap"
                                        placeholder="Jalan, Nomor Rumah, Apartemen, dsb."
                                        value={formData.address}
                                        onChange={(e) => {
                                            setFormData({ ...formData, address: e.target.value });
                                            if (formErrors.address) setFormErrors({ ...formErrors, address: undefined });
                                        }}
                                    />
                                    {formErrors.address && <p className="mt-1 text-[11px] font-bold text-red-500 uppercase tracking-wider">{formErrors.address}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FormInput
                                            label="Kota"
                                            placeholder="Contoh: Jakarta"
                                            value={formData.city}
                                            onChange={(e) => {
                                                setFormData({ ...formData, city: e.target.value });
                                                if (formErrors.city) setFormErrors({ ...formErrors, city: undefined });
                                            }}
                                        />
                                        {formErrors.city && <p className="mt-1 text-[11px] font-bold text-red-500 uppercase tracking-wider">{formErrors.city}</p>}
                                    </div>
                                    <div>
                                        <FormInput
                                            label="Kode Pos"
                                            placeholder="12345"
                                            value={formData.postalCode}
                                            onChange={(e) => {
                                                setFormData({ ...formData, postalCode: e.target.value });
                                                if (formErrors.postalCode) setFormErrors({ ...formErrors, postalCode: undefined });
                                            }}
                                        />
                                        {formErrors.postalCode && <p className="mt-1 text-[11px] font-bold text-red-500 uppercase tracking-wider">{formErrors.postalCode}</p>}
                                    </div>
                                </div>

                                <div>
                                    <FormInput
                                        label="Nomor Telepon"
                                        placeholder="0812xxxxxxx"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData({ ...formData, phone: e.target.value });
                                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                                        }}
                                    />
                                    {formErrors.phone && <p className="mt-1 text-[11px] font-bold text-red-500 uppercase tracking-wider">{formErrors.phone}</p>}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* STEP 2 — Metode Pembayaran */}
                    {step === 2 && (
                        <section className="stagger-item step-content">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black italic">2</div>
                                <h2 className="text-xl font-black italic uppercase tracking-tight">Metode Pembayaran</h2>
                            </div>

                            {/* Ringkasan Pengiriman */}
                            <div className="mb-6 p-4 bg-gray-50 border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Dikirim ke</p>
                                        <p className="text-[13px] font-bold">{formData.firstName} {formData.lastName}</p>
                                        <p className="text-[12px] text-gray-500">{formData.address}, {formData.city} {formData.postalCode}</p>
                                        <p className="text-[12px] text-gray-500">{formData.phone}</p>
                                    </div>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-[10px] font-black uppercase tracking-widest underline underline-offset-2 hover:text-gray-600 transition-colors"
                                    >
                                        Ubah
                                    </button>
                                </div>
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
                                <PaymentOption
                                    id="whatsapp"
                                    title="Manual (WhatsApp)"
                                    description="Transfer manual dan konfirmasi via WhatsApp"
                                    isSelected={paymentMethod === 'whatsapp'}
                                    onSelect={setPaymentMethod}
                                    icon={<WhatsAppIcon />}
                                />
                            </div>

                            {/* Error message */}
                            {orderError && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200">
                                    <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">{orderError}</p>
                                </div>
                            )}
                        </section>
                    )}

                    {/* STEP 3 — Konfirmasi Berhasil & Invoice */}
                    {step === 3 && (
                        <section className="step-content">
                            {!isPaid ? (
                                <div className="py-10 flex flex-col items-center text-center">
                                    <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-3">
                                        Selesaikan Pembayaran
                                    </h2>
                                    <p className="text-[12px] text-gray-500 uppercase tracking-widest mb-6">
                                        Silakan selesaikan pembayaran sesuai metode yang Anda pilih
                                    </p>

                                    <div className="my-6 w-full max-w-md border-2 border-black p-6 text-left bg-white">
                                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Tagihan</span>
                                            <span className="text-2xl font-black italic tracking-tighter">{formatPrice(total)}</span>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Nomor Pesanan</span>
                                            <span className="text-[14px] font-bold">{orderNumber}</span>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Metode Pembayaran</span>
                                            <span className="text-[14px] font-bold uppercase tracking-widest">
                                                {paymentMethod === 'va' ? 'Virtual Account' : paymentMethod === 'cc' ? 'Kartu Kredit / Debit' : paymentMethod === 'wallet' ? 'E-Wallet' : paymentMethod}
                                            </span>
                                        </div>

                                        {paymentMethod === 'va' && (
                                            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 text-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Nomor Virtual Account</span>
                                                <span className="text-xl font-black tracking-widest">8077 1234 5678 9012</span>
                                            </div>
                                        )}

                                        {paymentMethod === 'wallet' && (
                                            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 text-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Pindai QRIS Berikut</span>
                                                <div className="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center border-2 border-dashed border-gray-400">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase">QRIS Dummy</span>
                                                </div>
                                            </div>
                                        )}

                                        <ButtonDark 
                                            text="Simulasi Bayar Berhasil" 
                                            fullWidth 
                                            onClick={() => {
                                                setIsPaid(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }} 
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-10 flex flex-col items-center text-center">
                                    <div className="mb-6">
                                        {/* <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'black' }} /> */}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-3">
                                        Pesanan Diterima!
                                    </h2>
                                    <p className="text-[12px] text-gray-500 uppercase tracking-widest mb-2">
                                        Terima kasih telah berbelanja di Connexxa
                                    </p>
                                    <div className="my-6 px-8 py-4 border-2 border-black">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Nomor Pesanan</p>
                                        <p className="text-2xl font-black italic tracking-tighter">{orderNumber}</p>
                                    </div>
                                    <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-8 max-w-sm leading-relaxed">
                                        Konfirmasi pesanan akan dikirim ke <span className="font-bold text-black">{formData.email}</span>. Estimasi pengiriman 2–4 hari kerja.
                                    </p>
                                    <Link href="/">
                                        <ButtonDark text="Lanjut Belanja" />
                                    </Link>
                                </div>
                            )}
                        </section>
                    )}

                    {/* CTA Buttons */}
                    {step !== 3 && (
                        <div className="pt-4 stagger-item">
                            {step === 1 ? (
                                <ButtonDark
                                    text="Lanjutkan ke Pembayaran"
                                    fullWidth
                                    className="py-5 text-[15px]"
                                    icon={<ChevronRightIcon />}
                                    onClick={handleContinueToPayment}
                                    disabled={cartItems.length === 0}
                                />
                            ) : (
                                <>
                                    <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                                        Dengan mengklik &apos;Bayar Sekarang&apos;, Anda menyetujui{' '}
                                        <Link href="/terms_and_conditions" className="underline hover:text-black">Syarat dan Ketentuan</Link>{' '}
                                        serta Kebijakan Privasi Connexxa. Kami akan memproses pesanan Anda sesuai dengan data yang Anda berikan.
                                    </p>
                                    <ButtonDark
                                        text={isSubmitting ? "Memproses..." : "Bayar Sekarang"}
                                        fullWidth
                                        className="py-5 text-[15px]"
                                        icon={isSubmitting ? undefined : <ChevronRightIcon />}
                                        onClick={handlePlaceOrder}
                                        disabled={isSubmitting || cartItems.length === 0}
                                    />
                                    <button
                                        onClick={() => setStep(1)}
                                        disabled={isSubmitting}
                                        className="mt-6 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors block mx-auto underline underline-offset-4 disabled:opacity-50"
                                    >
                                        Kembali ke Pengiriman
                                    </button>
                                </>
                            )}
                        </div>
                    )}
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
                                                    unoptimized
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
                                ) : step === 3 ? (
                                    <div className="text-center py-6">
                                        {/* <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#ccc' }} /> */}
                                        <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                            {isPaid ? 'Semua item berhasil di-order' : 'Menunggu Pembayaran'}
                                        </p>
                                    </div>
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

                            {/* Promo Code — hanya tampil di step 1 & 2 */}
                            {step < 3 && (
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
                            )}
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

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
            `}</style>
        </div>
    );
};

export default CheckoutPage;
