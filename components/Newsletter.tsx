'use client';

import React from 'react';
import ButtonDark from './ButtonDark';

const Newsletter = () => {
    return (
        <section className="bg-[#ede734] py-12 px-4 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-black uppercase leading-none text-center md:text-left">
                GABUNG ADICLUB & DAPATKAN DISKON 15%
            </h2>
            <div className="flex-shrink-0">
                <ButtonDark text="DAFTAR SEKARANG" />
            </div>
        </section>
    );
};

export default Newsletter;
