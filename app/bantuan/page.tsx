'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const faqCategories = [
    {
        id: 'pengiriman',
        icon: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />,
        label: 'Pengiriman',
        items: [
            {
                q: 'Berapa lama waktu pengiriman?',
                a: 'Pesanan diproses dalam 1–2 hari kerja setelah pembayaran dikonfirmasi. Estimasi pengiriman 2–5 hari kerja untuk wilayah Jawa, dan 3–7 hari kerja untuk luar Jawa.',
            },
            {
                q: 'Apakah ada gratis ongkir?',
                a: 'Ya, kami menyediakan gratis ongkir untuk pembelian minimum Rp 1.500.000 ke seluruh wilayah Indonesia.',
            },
            {
                q: 'Bagaimana cara melacak pesanan saya?',
                a: 'Setelah pesanan dikirim, kamu akan menerima nomor resi melalui email. Gunakan nomor tersebut di halaman Pelacak Pesanan untuk memantau status pengiriman.',
            },
            {
                q: 'Apakah bisa kirim ke luar negeri?',
                a: 'Saat ini kami hanya melayani pengiriman ke seluruh wilayah Indonesia. Pengiriman internasional sedang dalam pengembangan.',
            },
        ],
    },
    {
        id: 'pengembalian',
        icon: <CachedIcon sx={{ fontSize: 18 }} />,
        label: 'Pengembalian',
        items: [
            {
                q: 'Bagaimana cara mengembalikan produk?',
                a: 'Produk dapat dikembalikan dalam 30 hari setelah diterima. Pastikan produk belum digunakan, tag masih terpasang, dan dalam kemasan asli. Hubungi tim kami untuk memulai proses pengembalian.',
            },
            {
                q: 'Berapa lama proses refund?',
                a: 'Setelah produk diterima dan diverifikasi, refund akan diproses dalam 5–7 hari kerja ke metode pembayaran asal.',
            },
            {
                q: 'Produk apa yang tidak bisa dikembalikan?',
                a: 'Produk yang sudah digunakan, produk sale dengan label "Final Sale", dan produk yang rusak akibat kesalahan pengguna tidak dapat dikembalikan.',
            },
        ],
    },
    {
        id: 'pembayaran',
        icon: <CreditCardOutlinedIcon sx={{ fontSize: 18 }} />,
        label: 'Pembayaran',
        items: [
            {
                q: 'Metode pembayaran apa saja yang tersedia?',
                a: 'Kami menerima transfer bank, kartu kredit/debit (Visa, Mastercard), dompet digital (GoPay, OVO, Dana), dan QRIS.',
            },
            {
                q: 'Apakah transaksi saya aman?',
                a: 'Ya, semua transaksi dienkripsi dengan SSL dan diproses melalui payment gateway yang telah tersertifikasi PCI-DSS.',
            },
            {
                q: 'Bisakah saya mencicil?',
                a: 'Tersedia cicilan 0% untuk kartu kredit tertentu dengan minimum pembelian Rp 500.000. Pilihan cicilan akan muncul saat checkout.',
            },
        ],
    },
    {
        id: 'akun',
        icon: <PersonOutlinedIcon sx={{ fontSize: 18 }} />,
        label: 'Akun',
        items: [
            {
                q: 'Bagaimana cara membuat akun?',
                a: 'Klik ikon profil di header, lalu pilih "Daftar Sekarang". Isi email dan kata sandi, kemudian verifikasi email kamu.',
            },
            {
                q: 'Saya lupa kata sandi, bagaimana cara menggantinya?',
                a: 'Klik "Lupa sandi Anda?" di halaman login, masukkan email terdaftar, dan ikuti instruksi yang dikirim ke email kamu.',
            },
            {
                q: 'Bagaimana cara menghapus akun?',
                a: 'Untuk menghapus akun, hubungi tim dukungan kami melalui email dengan subjek "Hapus Akun". Proses penghapusan membutuhkan waktu 7 hari kerja.',
            },
        ],
    },
];

function AccordionItem({ index, q, a }: { index: number; q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border-b border-gray-200 ${open ? 'bg-[#f7f7f7]' : 'bg-white'} transition-colors`}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-start gap-6 px-6 py-5 text-left group"
            >
                {/* Index number */}
                <span className="text-[11px] font-black text-gray-300 tracking-widest pt-0.5 w-5 flex-shrink-0">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-[13px] font-bold text-black uppercase tracking-tight leading-snug">
                    {q}
                </span>
                <span className="flex-shrink-0 mt-0.5">
                    {open
                        ? <RemoveIcon sx={{ fontSize: 18 }} className="text-black" />
                        : <AddIcon sx={{ fontSize: 18 }} className="text-gray-400 group-hover:text-black transition-colors" />
                    }
                </span>
            </button>
            {open && (
                <div className="pl-[68px] pr-6 pb-6">
                    <p className="text-[13px] text-gray-600 leading-relaxed border-l-2 border-black pl-4">
                        {a}
                    </p>
                </div>
            )}
        </div>
    );
}

const contactItems = [
    {
        icon: <EmailOutlinedIcon sx={{ fontSize: 22 }} />,
        label: 'Email',
        sub: 'Respons dalam 1×24 jam',
        cta: 'support@connexxa.id',
        href: 'mailto:support@connexxa.id',
        external: false,
    },
    {
        icon: <WhatsAppIcon sx={{ fontSize: 22 }} />,
        label: 'WhatsApp',
        sub: 'Chat langsung, setiap hari 08.00–21.00',
        cta: '+62 812-3456-7890',
        href: 'https://wa.me/6281234567890',
        external: true,
    },
    {
        icon: <StorefrontOutlinedIcon sx={{ fontSize: 22 }} />,
        label: 'Kunjungi Toko',
        sub: 'Senin–Minggu, 10.00–21.00 WIB',
        cta: 'Cari Toko Terdekat',
        href: '#',
        external: false,
    },
];

export default function BantuanPage() {
    const [activeCategory, setActiveCategory] = useState('pengiriman');
    const active = faqCategories.find((c) => c.id === activeCategory)!;

    return (
        <main className="min-h-screen bg-white">

            {/* Hero — black strip */}
            <section className="bg-black text-white py-16">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                    <nav className="text-[11px] tracking-wider text-gray-500 uppercase mb-4 flex items-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <span>/</span>
                        <span className="text-gray-300 font-semibold">Bantuan</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                        PUSAT BANTUAN
                    </h1>
                    <p className="mt-4 text-[13px] text-gray-400 max-w-lg leading-relaxed">
                        Temukan jawaban atas pertanyaan umum seputar pesanan, pengiriman, pengembalian, dan akun kamu.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Tab navigation — kiri */}
                        <aside className="flex flex-row lg:flex-col gap-0 lg:w-52 flex-shrink-0 overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-gray-200 pb-2 lg:pb-0">
                            {faqCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-5 py-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap transition-all text-left border-b border-gray-100 last:border-b-0 lg:border-r-2 lg:-mr-px ${activeCategory === cat.id
                                        ? 'lg:border-r-black text-black bg-gray-50'
                                        : 'lg:border-r-transparent text-gray-400 hover:text-black hover:bg-gray-50'
                                        }`}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </aside>

                        {/* FAQ list — kanan */}
                        <div className="flex-1">
                            <div className="mb-6">
                                <h2 className="text-xl font-black italic tracking-tighter uppercase text-black">
                                    {active.label}
                                </h2>
                            </div>
                            <div className="border-t border-gray-200">
                                {active.items.map((item, i) => (
                                    <AccordionItem key={item.q} index={i} q={item.q} a={item.a} />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="py-16 border-t border-gray-200">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-black">
                                MASIH BUTUH BANTUAN?
                            </h2>
                            <p className="text-[13px] text-gray-500 mt-2">
                                Tim kami siap membantu setiap hari pukul 08.00–21.00 WIB.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
                        {contactItems.map((item) => (
                            <div
                                key={item.label}
                                className="bg-white p-8 flex flex-col gap-5 group hover:bg-black transition-colors duration-300"
                            >
                                <div className="text-black group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-[13px] font-black uppercase tracking-wider text-black group-hover:text-white transition-colors">
                                        {item.label}
                                    </p>
                                    <p className="text-[12px] text-gray-500 group-hover:text-gray-400 mt-1 transition-colors">
                                        {item.sub}
                                    </p>
                                </div>
                                <a
                                    href={item.href}
                                    target={item.external ? '_blank' : undefined}
                                    rel={item.external ? 'noopener noreferrer' : undefined}
                                    className="mt-auto flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-black group-hover:text-white transition-colors"
                                    onClick={(e) => item.href === '#' && e.preventDefault()}
                                >
                                    <span>{item.cta}</span>
                                    <ArrowForwardIcon sx={{ fontSize: 14 }} className="transition-transform group-hover:translate-x-1" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
