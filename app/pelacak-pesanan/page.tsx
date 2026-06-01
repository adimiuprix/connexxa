'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ── Dummy data ────────────────────────────────────────────────────────────────
const DUMMY_ORDERS: Record<string, DummyOrder> = {
    'CNX-20260512-001': {
        orderNumber: 'CNX-20260512-001',
        status: 'delivered',
        estimatedDelivery: '14 Mei 2026',
        courier: 'JNE REG',
        trackingNumber: '1234567890123',
        recipient: 'Budi Santoso',
        address: 'Jl. Sudirman No. 45, Jakarta Pusat, DKI Jakarta 10220',
        items: [
            {
                title: 'Connexxa Running Tee',
                size: 'M',
                color: 'Black',
                qty: 1,
                price: 450000,
                image: '/placeholder.jpg',
            },
            {
                title: 'Connexxa Sport Shorts',
                size: 'L',
                color: 'White',
                qty: 2,
                price: 380000,
                image: '/placeholder.jpg',
            },
        ],
        timeline: [
            { label: 'Pesanan Diterima', date: '12 Mei 2026, 09:14', done: true },
            { label: 'Diproses Gudang', date: '12 Mei 2026, 14:30', done: true },
            { label: 'Diserahkan ke Kurir', date: '13 Mei 2026, 08:00', done: true },
            { label: 'Dalam Pengiriman', date: '13 Mei 2026, 11:45', done: true },
            { label: 'Terkirim', date: '14 Mei 2026, 15:22', done: true },
        ],
    },
    'CNX-20260520-042': {
        orderNumber: 'CNX-20260520-042',
        status: 'shipping',
        estimatedDelivery: '23 Mei 2026',
        courier: 'SiCepat BEST',
        trackingNumber: '9876543210987',
        recipient: 'Sari Dewi',
        address: 'Jl. Gatot Subroto No. 12, Bandung, Jawa Barat 40262',
        items: [
            {
                title: 'Connexxa Classic Hoodie',
                size: 'XL',
                color: 'Navy',
                qty: 1,
                price: 750000,
                image: '/placeholder.jpg',
            },
        ],
        timeline: [
            { label: 'Pesanan Diterima', date: '20 Mei 2026, 10:05', done: true },
            { label: 'Diproses Gudang', date: '20 Mei 2026, 16:00', done: true },
            { label: 'Diserahkan ke Kurir', date: '21 Mei 2026, 09:30', done: true },
            { label: 'Dalam Pengiriman', date: '21 Mei 2026, 13:00', done: true },
            { label: 'Terkirim', date: '—', done: false },
        ],
    },
    'CNX-20260525-088': {
        orderNumber: 'CNX-20260525-088',
        status: 'processing',
        estimatedDelivery: '28 Mei 2026',
        courier: 'AnterAja',
        trackingNumber: '—',
        recipient: 'Rizky Pratama',
        address: 'Jl. Pemuda No. 7, Surabaya, Jawa Timur 60271',
        items: [
            {
                title: 'Connexxa Trail Jacket',
                size: 'S',
                color: 'Olive',
                qty: 1,
                price: 1200000,
                image: '/placeholder.jpg',
            },
        ],
        timeline: [
            { label: 'Pesanan Diterima', date: '25 Mei 2026, 08:50', done: true },
            { label: 'Diproses Gudang', date: '25 Mei 2026, 12:00', done: true },
            { label: 'Diserahkan ke Kurir', date: '—', done: false },
            { label: 'Dalam Pengiriman', date: '—', done: false },
            { label: 'Terkirim', date: '—', done: false },
        ],
    },
};

interface OrderItem {
    title: string;
    size: string;
    color: string;
    qty: number;
    price: number;
    image: string;
}

interface TimelineStep {
    label: string;
    date: string;
    done: boolean;
}

interface DummyOrder {
    orderNumber: string;
    status: 'processing' | 'shipping' | 'delivered';
    estimatedDelivery: string;
    courier: string;
    trackingNumber: string;
    recipient: string;
    address: string;
    items: OrderItem[];
    timeline: TimelineStep[];
}

const STATUS_CONFIG = {
    processing: {
        label: 'Diproses',
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: <InventoryOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    shipping: {
        label: 'Dalam Pengiriman',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    delivered: {
        label: 'Terkirim',
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />,
    },
};

const formatCurrency = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

// ── Components ────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DummyOrder['status'] }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
    const lastDone = steps.reduce((acc, s, i) => (s.done ? i : acc), -1);
    return (
        <div className="flex flex-col gap-0">
            {steps.map((step, i) => {
                const isActive = i === lastDone;
                const isDone = step.done;
                return (
                    <div key={step.label} className="flex gap-4">
                        {/* Connector */}
                        <div className="flex flex-col items-center">
                            <div className={`flex-shrink-0 mt-1 rounded-full transition-all ${isActive
                                    ? 'w-4 h-4 bg-black ring-2 ring-black ring-offset-2'
                                    : isDone
                                        ? 'w-3 h-3 bg-black'
                                        : 'w-3 h-3 bg-white border-2 border-gray-300'
                                }`} />
                            {i < steps.length - 1 && (
                                <div className={`w-px flex-1 my-1 ${isDone ? 'bg-black' : 'bg-gray-200'}`} style={{ minHeight: 28 }} />
                            )}
                        </div>
                        {/* Content */}
                        <div className="pb-6">
                            <p className={`text-[12px] font-black uppercase tracking-tight ${isDone ? 'text-black' : 'text-gray-300'}`}>
                                {step.label}
                            </p>
                            <p className={`text-[11px] mt-0.5 ${isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                                {step.date}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PelacakPesananPage() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<DummyOrder | null | 'not-found'>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        if (!input.trim()) return;
        setLoading(true);
        setResult(null);

        // Simulasi delay network
        setTimeout(() => {
            const found = DUMMY_ORDERS[input.trim().toUpperCase()];
            setResult(found ?? 'not-found');
            setLoading(false);
        }, 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const order = result !== null && result !== 'not-found' ? result : null;

    return (
        <main className="min-h-screen bg-white">

            {/* Hero */}
            <section className="bg-black text-white py-16">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                    <nav className="text-[11px] tracking-wider text-gray-500 uppercase mb-4 flex items-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <span>/</span>
                        <span className="text-gray-300 font-semibold">Pelacak Pesanan</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                        LACAK PESANAN
                    </h1>
                    <p className="mt-4 text-[13px] text-gray-400 max-w-lg leading-relaxed">
                        Masukkan nomor pesanan untuk melihat status dan estimasi pengiriman kamu.
                    </p>

                    {/* Search input */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-0 max-w-xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Contoh: CNX-20260512-001"
                            className="flex-1 bg-white text-black px-5 py-4 text-[13px] font-medium placeholder:text-gray-400 focus:outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading || !input.trim()}
                            className="flex items-center justify-center gap-2 bg-white text-black px-6 py-4 border-l border-gray-200 text-[12px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed sm:w-auto w-full"
                        >
                            {loading ? (
                                <span className="animate-pulse">Mencari...</span>
                            ) : (
                                <>
                                    <SearchIcon sx={{ fontSize: 18 }} />
                                    Lacak
                                </>
                            )}
                        </button>
                    </div>

                    {/* Hint */}
                    <p className="mt-3 text-[11px] text-gray-600 uppercase tracking-wider">
                        Coba: CNX-20260512-001 &nbsp;·&nbsp; CNX-20260520-042 &nbsp;·&nbsp; CNX-20260525-088
                    </p>
                </div>
            </section>

            {/* Result */}
            {result === 'not-found' && (
                <section className="py-16">
                    <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                        <div className="max-w-xl">
                            <p className="text-lg font-black italic uppercase tracking-tighter text-black">
                                Pesanan tidak ditemukan
                            </p>
                            <p className="text-[13px] text-gray-500 mt-2">
                                Pastikan nomor pesanan yang kamu masukkan sudah benar. Nomor pesanan dapat ditemukan di email konfirmasi.
                            </p>
                            <Link href="/bantuan" className="mt-6 inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-black underline underline-offset-4 hover:no-underline">
                                Butuh bantuan? <ArrowForwardIcon sx={{ fontSize: 14 }} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {order && (
                <section className="py-16">
                    <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* Kiri: info + timeline */}
                            <div className="lg:w-[320px] flex-shrink-0 flex flex-col gap-6">

                                {/* Order header card */}
                                <div className="bg-[#f7f7f7] p-6">
                                    <div className="flex items-start justify-between gap-3 mb-5">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Nomor Pesanan</p>
                                            <p className="text-[14px] font-black tracking-tight text-black">{order.orderNumber}</p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    {/* 3 stat mini */}
                                    <div className="grid grid-cols-3 gap-px bg-gray-200">
                                        <div className="bg-white px-3 py-3">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Kurir</p>
                                            <p className="text-[12px] font-black text-black leading-tight">{order.courier}</p>
                                        </div>
                                        <div className="bg-white px-3 py-3">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">No. Resi</p>
                                            <p className="text-[12px] font-black text-black leading-tight truncate">{order.trackingNumber}</p>
                                        </div>
                                        <div className="bg-white px-3 py-3">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Est. Tiba</p>
                                            <p className="text-[12px] font-black text-black leading-tight">{order.estimatedDelivery}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline card */}
                                <div className="bg-[#f7f7f7] p-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-black mb-6">Riwayat Pengiriman</p>
                                    <Timeline steps={order.timeline} />
                                </div>
                            </div>

                            {/* Kanan: Produk + alamat */}
                            <div className="flex-1 flex flex-col gap-6">

                                {/* Produk */}
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-black mb-4">Item Pesanan</p>
                                    <div className="border-t border-gray-200">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex gap-5 py-5 border-b border-gray-100">
                                                <div className="relative w-20 h-20 flex-shrink-0 bg-[#ebedee] overflow-hidden">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="text-[13px] font-black uppercase tracking-tight text-black truncate">{item.title}</p>
                                                    <p className="text-[11px] text-gray-500 mt-1">
                                                        Ukuran {item.size} &nbsp;·&nbsp; {item.color} &nbsp;·&nbsp; Qty {item.qty}
                                                    </p>
                                                </div>
                                                <p className="text-[13px] font-black text-black flex-shrink-0 self-center">
                                                    {formatCurrency(item.price * item.qty)}
                                                </p>
                                            </div>
                                        ))}
                                        <div className="flex justify-between pt-5">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-black">Total</span>
                                            <span className="text-[15px] font-black text-black">
                                                {formatCurrency(order.items.reduce((s, i) => s + i.price * i.qty, 0))}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Alamat — black card */}
                                <div className="bg-black text-white p-6 flex items-start gap-4">
                                    <StorefrontOutlinedIcon sx={{ fontSize: 20 }} className="flex-shrink-0 mt-0.5 text-gray-400" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Alamat Pengiriman</p>
                                        <p className="text-[14px] font-black text-white">{order.recipient}</p>
                                        <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">{order.address}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Empty state — belum search */}
            {result === null && !loading && (
                <section className="py-24">
                    <div className="max-w-[1920px] mx-auto px-4 lg:px-20 text-center">
                        <LocalShippingOutlinedIcon sx={{ fontSize: 48 }} className="text-gray-200 mb-4" />
                        <p className="text-[13px] text-gray-400 uppercase tracking-widest font-bold">
                            Masukkan nomor pesanan di atas untuk mulai melacak
                        </p>
                    </div>
                </section>
            )}

        </main>
    );
}
