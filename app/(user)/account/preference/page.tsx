"use client";

import React from 'react';
import LayoutUser from '../../layout_user';

const PreferencePage = () => {
    return (
        <LayoutUser>
            <h2 className="text-[36px] font-black italic uppercase tracking-tighter mb-4 leading-none">PREFERENSIMU</h2>
            <p className="text-[14px] text-black mb-12 leading-relaxed">
                Mohon tambahkan preferensi olahramu untuk mendapatkan personalisasi konten, rekomendasi & penawaran.
            </p>

            {/* Subscription Sections */}
            <div className="space-y-16">
                {/* Buletin Adidas */}
                <section>
                    <h3 className="text-[13px] font-black uppercase tracking-[0.1em] mb-4">BULETIN ADIDAS</h3>
                    <div className="flex gap-4 items-start mb-8">
                        <div className="mt-0.5">
                            <div className="w-5 h-5 bg-black flex items-center justify-center text-white cursor-pointer">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </div>
                        <div className="text-[12px] leading-[1.6]">
                            <p className="mb-2">
                                Saya ingin agar adidas terus memberi saya informasi terkini tentang produk dan layanan adidas. <span className="font-bold">(Komunikasi Pemasaran)</span>. Saya setuju untuk menerima pesan pemasaran surel yang dipersonalisasi dari Pengontrol Data adidas <span className="font-bold">(adidas)</span>.
                            </p>
                            <button className="font-bold underline text-[13px]">Baca selengkapnya</button>
                        </div>
                    </div>
                    <div className="bg-[#ebedee] p-8">
                        <h4 className="text-[16px] font-black uppercase tracking-tight mb-2 italic">KAMU SAAT INI MENERIMA BULETIN KAMI.</h4>
                        <p className="text-[12px] text-gray-700">* Untuk berhenti berlangganan, hapus centang di kotak centang</p>
                    </div>
                </section>

                {/* Iklan yang Dipersonalisasi */}
                <section>
                    <h3 className="text-[13px] font-black uppercase tracking-[0.1em] mb-4">IKLAN YANG DIPERSONALISASI</h3>
                    <div className="flex gap-4 items-start mb-8">
                        <div className="mt-0.5">
                            <div className="w-5 h-5 bg-black flex items-center justify-center text-white cursor-pointer">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </div>
                        <div className="text-[12px] leading-[1.6]">
                            <p className="mb-2">
                                Ya, saya ingin menerima iklan yang dipersonalisasi di seluruh situs web dan media sosial berdasarkan interaksi saya dengan adidas dan platform pihak ketiga.
                            </p>
                            <button className="font-bold underline text-[13px]">Baca selengkapnya</button>
                        </div>
                    </div>
                    <div className="bg-[#ebedee] p-8">
                        <h4 className="text-[16px] font-black uppercase tracking-tight mb-2 italic">ANDA SAAT INI TELAH MEMILIH UNTUK MENERIMA IKLAN PIHAK KETIGA.</h4>
                        <p className="text-[12px] text-gray-700">* Untuk berhenti berlangganan, hapus centang di kotak centang</p>
                    </div>
                </section>

                {/* Minat Anda */}
                <section>
                    <h3 className="text-[13px] font-black uppercase tracking-[0.1em] mb-4">MINAT ANDA</h3>
                    <p className="text-[12px] mb-8">Klik setiap ikon yang sesuai untuk mendapatkan kustomisasi pengalaman adidasmu.</p>

                    <div className="flex flex-wrap border-l border-t border-gray-300">
                        <InterestIcon label="Originals" icon={<AdidasTrefoil />} />
                        <InterestIcon label="Hiking" icon={<HikingIcon />} />
                        <InterestIcon label="Y-3" icon={<span className="font-black text-[12px] italic">Y-3</span>} />
                        <InterestIcon label="Climbing" icon={<ClimbingIcon />} />
                        <InterestIcon label="Gaming" icon={<GamingIcon />} />
                        <InterestIcon label="Trail Running" icon={<TrailIcon />} />
                        <InterestIcon label="Running" icon={<RunningIcon />} />
                        <InterestIcon label="Mountain Biking" icon={<BikingIcon />} />
                        <InterestIcon label="Basketball" icon={<BasketballIcon />} />
                        <InterestIcon label="Skateboarding" icon={<SkateIcon />} />
                        <InterestIcon label="Soccer" icon={<SoccerIcon />} />
                        <InterestIcon label="Rugby" icon={<RugbyIcon />} />
                        <InterestIcon label="Train" icon={<TrainIcon />} />
                    </div>

                    {/* Progress bar at bottom */}
                    <div className="mt-12 h-[4px] w-full bg-gray-200 relative">
                        <div className="absolute left-0 top-0 h-full w-[80%] bg-black"></div>
                    </div>
                </section>
            </div>
        </LayoutUser>
    );
};

const InterestIcon = ({ label, icon }: { label: string, icon: React.ReactNode }) => (
    <div className="flex flex-col items-center border-r border-b border-gray-300 w-[75px] h-[95px] pt-4 pb-2 px-1 justify-between group cursor-pointer hover:bg-black hover:text-white transition-colors">
        <div className="flex-1 flex items-center justify-center w-full">
            <div className="text-black group-hover:text-white transition-colors">
                {icon}
            </div>
        </div>
        <span className="text-[9px] font-bold text-center leading-tight mt-2 text-gray-500 group-hover:text-white uppercase truncate w-full px-1">
            {label}
        </span>
    </div>
);

// Custom SVG Icons
const AdidasTrefoil = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2C10.5,2,9.1,2.5,8,3.3C6.9,2.5,5.5,2,4,2C2.3,2,0.8,2.7,0,3.9c1,0.5,2.1,0.8,3.2,0.8c2,0,3.7-1,4.8-2.6 c1.1,1.6,2.8,2.6,4.8,2.6c2,0,3.7-1,4.8-2.6c1.1,1.6,2.8,2.6,4.8,2.6c1.1,0,2.2-0.3,3.2-0.8C23.2,2.7,21.7,2,20,2 c-1.5,0-2.9,0.5-4,1.3C14.9,2.5,13.5,2,12,2z M12,6.5c-2.5,0-4.7,1.4-5.8,3.5c-0.4,0.7-0.7,1.5-0.9,2.4 c-0.1,0.6-0.2,1.3-0.2,2h1.5c0.1-1.1,0.3-2.1,0.7-3c0.7-1.4,1.9-2.5,3.4-2.8v-2.1C11.1,6.5,11.6,6.5,12,6.5s0.9,0,1.3,0.1v2.1 c1.5,0.3,2.7,1.4,3.4,2.8c0.4,0.9,0.6,1.9,0.7,3h1.5c0-0.7-0.1-1.4-0.2-2c-0.2-0.9-0.5-1.7-0.9-2.4C16.7,7.9,14.5,6.5,12,6.5z M12,16.5c-0.4,0-0.8,0-1.2,0.1v5.4h2.4v-5.4C12.8,16.5,12.4,16.5,12,16.5z" />
    </svg>
);

const HikingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 4l-8 12h16l-8-12zM8 20h8M12 10v4" />
    </svg>
);

const ClimbingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="2" width="10" height="20" rx="5" />
        <path d="M10 8h4M12 2v20" />
    </svg>
);

const GamingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 12h4m-2-2v4m8-2h.01M16 10h.01M3 8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
);

const TrailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 18l4-4 4 4 8-8" />
        <circle cx="20" cy="8" r="1.5" />
    </svg>
);

const RunningIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 4v4l-4 4 4 4v4m0-8h7M8 12H3" />
    </svg>
);

const BikingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8m-4-4v8" />
    </svg>
);

const BasketballIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20M5 5l14 14M5 19l14-14" />
    </svg>
);

const SkateIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="9" width="20" height="6" rx="2" />
        <circle cx="6" cy="17" r="1.5" />
        <circle cx="18" cy="17" r="1.5" />
    </svg>
);

const SoccerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7l3 2v4l-3 2-3-2V9l3-2zM12 2v5M15 9l5-2M15 13l5 2M12 15v7M9 13l-5 2M9 9l-5-2" />
    </svg>
);

const RugbyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-45 12 12)" />
        <path d="M8 8l8 8" />
    </svg>
);

const TrainIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 12h12M4 8v8m16-8v8M8 6v12m8-12v12" />
    </svg>
);

export default PreferencePage;
