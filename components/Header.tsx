"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Menu from './Menu';
import Modal from './Modal';
import FormInput from './FormInput';
import NavLink from './NavLink';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { createClient } from '@/libs/supabaseClient';
import {
    CART_SESSION_KEY,
    CART_SYNC_CHANNEL,
    CART_SYNC_EVENT,
    CART_SYNC_STORAGE_KEY,
    dispatchCartSync,
    type CartSyncDetail,
} from '@/libs/cartSync';

interface CartPreviewItem {
    id: number;
    title: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image?: string | null;
}

interface CartSnapshot {
    items: CartPreviewItem[];
    totalItems: number;
    totalPrice: number;
}

const Header = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [user, setUser] = useState<any>(null);
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartPreviewItem[]>([]);
    const [cartTotalPrice, setCartTotalPrice] = useState(0);
    const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [removingCartItemId, setRemovingCartItemId] = useState<number | null>(null);

    // State untuk form dinamis
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });

    // Handler untuk perubahan input
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
    };

    const [isLoading, setIsLoading] = useState(false);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    }, []);

    const applyCartSnapshot = useCallback((data: CartSnapshot) => {
        setCartCount(data.totalItems || 0);
        setCartItems(data.items || []);
        setCartTotalPrice(data.totalPrice || 0);
    }, []);

    const fetchCartSnapshot = useCallback(async (
        sessionId?: string,
        options?: { silent?: boolean }
    ) => {
        const activeSessionId = sessionId || localStorage.getItem(CART_SESSION_KEY);

        if (!activeSessionId) {
            setCartCount(0);
            setCartItems([]);
            setCartTotalPrice(0);
            return null;
        }

        if (!options?.silent) {
            setIsCartLoading(true);
        }

        try {
            const response = await fetch(`/api/cart?sessionId=${encodeURIComponent(activeSessionId)}`, {
                cache: 'no-store',
            });

            if (!response.ok) {
                return null;
            }

            const data: CartSnapshot = await response.json();
            applyCartSnapshot(data);
            return data;
        } catch (error) {
            console.error('Gagal menyinkronkan cart:', error);
            return null;
        } finally {
            if (!options?.silent) {
                setIsCartLoading(false);
            }
        }
    }, [applyCartSnapshot]);

    const handleCartPreviewOpen = useCallback(() => {
        setIsCartPreviewOpen(true);
        void fetchCartSnapshot(undefined, { silent: false });
    }, [fetchCartSnapshot]);

    const handleCartPreviewClose = useCallback(() => {
        setIsCartPreviewOpen(false);
    }, []);

    const handleRemoveCartItem = useCallback(async (itemId: number) => {
        const sessionId = localStorage.getItem(CART_SESSION_KEY);

        if (!sessionId) {
            return;
        }

        setRemovingCartItemId(itemId);

        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    itemId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gagal menghapus item dari cart');
            }

            applyCartSnapshot(data);
            dispatchCartSync({
                sessionId,
                totalItems: data.totalItems,
            });
        } catch (error) {
            console.error('Gagal menghapus item cart:', error);
        } finally {
            setRemovingCartItemId(null);
        }
    }, [applyCartSnapshot]);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            alert("Konfirmasi kata sandi tidak cocok!");
            return;
        }

        const supabase = createClient();
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email: registerData.email,
                password: registerData.password,
            });

            if (error) throw error;

            alert("Registrasi Berhasil! Silakan cek email Anda untuk verifikasi.");

            setRegisterData({ email: '', password: '', confirmPassword: '' });
            handleSwitchMode('login');
        } catch (error: any) {
            console.error("Registrasi Gagal:", error);
            alert(error.message || "Terjadi kesalahan saat registrasi. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            });

            if (error) throw error;

            alert("Masuk Berhasil!");
            setIsAuthOpen(false);
            // Anda bisa menambahkan redirect atau refresh state user di sini
        } catch (error: any) {
            console.error("Login Gagal:", error);
            alert(error.message || "Email atau kata sandi salah.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const supabase = createClient();

        // Ambil data user saat pertama kali load
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();

        // Pantau perubahan status login/logout
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        let channel: BroadcastChannel | null = null;

        const handleCartSync: EventListener = (event) => {
            const detail = (event as CustomEvent<CartSyncDetail>).detail;
            if (typeof detail?.totalItems === 'number') {
                setCartCount(detail.totalItems);
            }
            if (isCartPreviewOpen || typeof detail?.totalItems !== 'number') {
                void fetchCartSnapshot(detail?.sessionId, { silent: true });
            }
        };

        const handleStorage = (event: StorageEvent) => {
            if (event.key === CART_SESSION_KEY) {
                void fetchCartSnapshot(event.newValue || undefined, { silent: true });
                return;
            }

            if (event.key === CART_SYNC_STORAGE_KEY && event.newValue) {
                try {
                    const detail = JSON.parse(event.newValue) as CartSyncDetail;
                    if (typeof detail.totalItems === 'number') {
                        setCartCount(detail.totalItems);
                    }
                    if (isCartPreviewOpen || typeof detail.totalItems !== 'number') {
                        void fetchCartSnapshot(detail.sessionId, { silent: true });
                    }
                } catch {
                    void fetchCartSnapshot(undefined, { silent: true });
                }
            }
        };

        const handleFocus = () => {
            void fetchCartSnapshot(undefined, { silent: true });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                void fetchCartSnapshot(undefined, { silent: true });
            }
        };

        if (typeof BroadcastChannel !== 'undefined') {
            channel = new BroadcastChannel(CART_SYNC_CHANNEL);
            channel.onmessage = (event: MessageEvent<CartSyncDetail>) => {
                if (typeof event.data?.totalItems === 'number') {
                    setCartCount(event.data.totalItems);
                }
                if (isCartPreviewOpen || typeof event.data?.totalItems !== 'number') {
                    void fetchCartSnapshot(event.data?.sessionId, { silent: true });
                }
            };
        }

        window.addEventListener(CART_SYNC_EVENT, handleCartSync);
        window.addEventListener('storage', handleStorage);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        void fetchCartSnapshot(undefined, { silent: true });

        return () => {
            window.removeEventListener(CART_SYNC_EVENT, handleCartSync);
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            channel?.close();
        };
    }, [fetchCartSnapshot, isCartPreviewOpen]);

    const handleLogout = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Gagal keluar: " + error.message);
        } else {
            alert("Anda telah keluar.");
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const handleSwitchMode = contextSafe((newMode: 'login' | 'register') => {
        if (!containerRef.current) return;
        const tl = gsap.timeline();

        tl.to(containerRef.current, { duration: 0.04, skewX: 30, x: -10, opacity: 0.8, ease: "steps(1)" })
            .to(containerRef.current, { duration: 0.04, skewX: -30, x: 10, opacity: 0.6 })
            .to(containerRef.current, { duration: 0.04, skewX: 15, x: -5, opacity: 0.4 })
            .to(containerRef.current, {
                duration: 0.04, skewX: 0, x: 0, opacity: 0,
                onComplete: () => {
                    setAuthMode(newMode);
                }
            })
            .to(containerRef.current, { duration: 0.04, skewX: -15, x: 5, opacity: 0.5 })
            .to(containerRef.current, { duration: 0.04, skewX: 30, x: -10, opacity: 0.8 })
            .to(containerRef.current, { duration: 0.04, skewX: 0, x: 0, opacity: 1, ease: "steps(1)" });
    });

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="w-full bg-white font-sans border-b border-gray-100 sticky top-0 z-50">
            {/* Top Promo/Utility Bar */}
            <div className="bg-black text-white text-[11px] py-1.5 flex justify-center items-center font-bold tracking-widest uppercase px-4 text-center">
                GRATIS ONGKIR DENGAN MIN. PEMBELIAN RP 1.500.000
            </div>

            <div className="hidden lg:flex justify-end items-center px-10 py-1 space-x-6 text-[10px] tracking-wider text-black bg-white uppercase font-medium border-b border-gray-100">
                <a href="#" className="hover:underline">pencari toko</a>
                <a href="#" className="hover:underline">bantuan</a>
                <a href="#" className="hover:underline">pelacak pesanan</a>
            </div>

            {/* Mobile Menu Sidebar */}
            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Main Header */}
            <div className="flex items-center justify-between px-4 lg:px-10 h-12 lg:h-16 max-w-[1920px] mx-auto relative bg-white">

                {/* Left Side: Logo (Desktop: Left, Mobile: Left) */}
                <div className="flex items-center space-x-4">
                    <button onClick={handleMenuClick} className="lg:hidden p-1 text-black">
                        <MenuIcon sx={{ fontSize: 24 }} />
                    </button>
                    <Link href="/">
                        <div className="flex-shrink-0">
                            <Image src="/logo.png" alt="Logo" width={70} height={70} className="object-contain" />
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation (Centered) */}
                <nav className="absolute left-1/2 -translate-x-1/2 h-full hidden lg:flex">
                    <NavLink />
                </nav>

                {/* Right Side Icons & Search */}
                <div className="flex items-center space-x-2 lg:space-x-5">
                    {/* Desktop Search Bar */}
                    <div className="hidden lg:flex items-center bg-[#eaebed] px-3 py-1.5 w-[190px] relative transition-all border border-transparent focus-within:border-gray-400">
                        <input
                            type="text"
                            placeholder="Cari"
                            className="bg-transparent text-[13px] focus:outline-none w-full placeholder:text-gray-500 font-medium"
                        />
                        <SearchIcon sx={{ fontSize: 20, color: '#000000' }} />
                    </div>

                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <Link href="/account/profile" className="p-1 text-black hover:bg-gray-100 rounded-sm transition-colors flex items-center gap-1">
                                    <PersonOutlinedIcon sx={{ fontSize: 24 }} />
                                    <span className="hidden lg:block text-[10px] font-bold uppercase tracking-tighter max-w-[100px] truncate">
                                        {user.email?.split('@')[0]}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-[10px] font-black underline underline-offset-4 hover:no-underline uppercase tracking-tighter"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setAuthMode('login');
                                    setIsAuthOpen(true);
                                }}
                                className="p-1 text-black hover:bg-gray-100 rounded-sm transition-colors"
                            >
                                <PersonOutlinedIcon sx={{ fontSize: 24 }} />
                            </button>
                        )}

                        <button
                            onClick={() => {
                                if (user) {
                                    router.push('/wishlists');
                                } else {
                                    setAuthMode('login');
                                    setIsAuthOpen(true);
                                }
                            }}
                            className="p-1 text-black hover:bg-gray-100 rounded-sm transition-colors"
                        >
                            <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                        </button>

                        {/* Implementasi Cart */}
                        <div
                            className="relative"
                            onMouseEnter={handleCartPreviewOpen}
                            onMouseLeave={handleCartPreviewClose}
                        >
                            <div className="relative p-1 hover:bg-gray-100 rounded-sm transition-colors cursor-pointer">
                                <ShoppingBagOutlinedIcon sx={{ fontSize: 24 }} />
                                <span className="absolute -bottom-1 -right-1 bg-[#0071ae] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                            </div>

                            {isCartPreviewOpen && (
                                <div className="absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] max-w-[360px] bg-white border border-gray-200 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] z-50">
                                    <div className="absolute inset-x-0 -top-3 h-3" />
                                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-widest text-black">Tas Belanja</p>
                                            <p className="text-[11px] text-gray-500 mt-1">{cartCount} item di tas</p>
                                        </div>
                                        <span className="text-[11px] font-bold text-black">{formatCurrency(cartTotalPrice)}</span>
                                    </div>

                                    <div className="max-h-[360px] overflow-y-auto">
                                        {isCartLoading ? (
                                            <div className="px-4 py-10 text-center text-[11px] font-bold uppercase tracking-widest text-gray-500 animate-pulse">
                                                Memuat tas...
                                            </div>
                                        ) : cartItems.length === 0 ? (
                                            <div className="px-4 py-10 text-center">
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-black">Tas masih kosong</p>
                                                <p className="text-[11px] text-gray-500 mt-2">Tambah produk untuk mulai belanja.</p>
                                            </div>
                                        ) : (
                                            cartItems.map((item) => (
                                                <div key={item.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0 flex gap-3">
                                                    <div className="relative w-16 h-16 flex-shrink-0 bg-[#ebedee] overflow-hidden">
                                                        {item.image ? (
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                fill
                                                                sizes="64px"
                                                                className="object-cover"
                                                            />
                                                        ) : null}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <p className="text-[11px] font-bold uppercase tracking-wide text-black truncate">
                                                                {item.title}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => void handleRemoveCartItem(item.id)}
                                                                disabled={removingCartItemId === item.id}
                                                                className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-4 hover:no-underline disabled:text-gray-400 disabled:no-underline"
                                                            >
                                                                {removingCartItemId === item.id ? 'Proses...' : 'Hapus'}
                                                            </button>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 mt-1">
                                                            Ukuran {item.size} • {item.color}
                                                        </p>
                                                        <div className="mt-2 flex items-center justify-between gap-3">
                                                            <span className="text-[11px] text-gray-500">Qty {item.quantity}</span>
                                                            <span className="text-[11px] font-bold text-black">
                                                                {formatCurrency(item.price * item.quantity)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {!isCartLoading && cartItems.length > 0 && (
                                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-black">Total</span>
                                            <span className="text-[12px] font-black text-black">{formatCurrency(cartTotalPrice)}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Authentication Modal Integration */}
            <Modal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                title={authMode === 'login' ? "MASUK" : "PENDAFTARAN"}
            >
                <div ref={containerRef}>
                    {authMode === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <p className="text-[13px] text-gray-600 leading-relaxed">
                                Silakan masukkan detail akun Anda untuk melanjutkan belanja di <span className="font-bold text-black">Connexxa</span>.
                            </p>

                            <div className="space-y-4">
                                <FormInput
                                    name="email"
                                    type="email"
                                    placeholder="ALAMAT EMAIL *"
                                    required
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                />
                                <FormInput
                                    name="password"
                                    type="password"
                                    placeholder="KATA SANDI *"
                                    required
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                />
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 accent-black cursor-pointer" />
                                    <span className="group-hover:text-gray-600 transition-colors">Ingat Saya</span>
                                </label>
                                <button type="button" className="underline decoration-1 underline-offset-4 hover:no-underline transition-all">Lupa sandi Anda?</button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.2em] text-[13px] hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "MEMPROSES..." : "MASUK"}
                            </button>

                            <div className="relative flex items-center py-1">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-[11px] font-bold tracking-widest uppercase">Atau</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <button className="w-full bg-white text-black py-4 font-black uppercase tracking-[0.1em] text-[13px] border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm">
                                <GoogleIcon sx={{ fontSize: 20 }} />
                                MASUK DENGAN GOOGLE
                            </button>

                            <div className="pt-4 border-t border-gray-100 text-center">
                                <p className="text-[12px] text-gray-500 font-medium">
                                    Belum punya akun? <button type="button" onClick={() => handleSwitchMode('register')} className="text-black font-black underline underline-offset-4 hover:no-underline">DAFTAR SEKARANG</button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-6">
                            <p className="text-[13px] text-gray-600 leading-relaxed">
                                Silakan masukkan detail akun Anda untuk melanjutkan belanja di <span className="font-bold text-black">Connexxa</span>.
                            </p>

                            <div className="space-y-4">
                                <FormInput
                                    name="email"
                                    type="email"
                                    placeholder="ALAMAT EMAIL *"
                                    required
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                />
                                <FormInput
                                    name="password"
                                    type="password"
                                    placeholder="KATA SANDI *"
                                    required
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                />
                                <FormInput
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="ULANGI KATA SANDI *"
                                    required
                                    value={registerData.confirmPassword}
                                    onChange={handleRegisterChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.2em] text-[13px] hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "MEMPROSES..." : "DAFTAR"}
                            </button>

                            <div className="relative flex items-center py-1">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-[11px] font-bold tracking-widest uppercase">Atau</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <button
                                type="button"
                                className="w-full bg-white text-black py-4 font-black uppercase tracking-[0.1em] text-[13px] border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm"
                            >
                                <GoogleIcon sx={{ fontSize: 20 }} />
                                DAFTAR DENGAN GOOGLE
                            </button>

                            <div className="pt-4 border-t border-gray-100 text-center">
                                <p className="text-[12px] text-gray-500 font-medium">
                                    Sudah punya akun? <button type="button" onClick={() => handleSwitchMode('login')} className="text-black font-black underline underline-offset-4 hover:no-underline">MASUK SEKARANG</button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </header>
    );
};

export default Header;


