"use client";

import React from 'react';
import LayoutUser from '../../layout_user';

const ProfilePage = () => {
    return (
        <LayoutUser>
            <h2 className="text-[36px] font-black italic uppercase tracking-tighter mb-4 leading-none">INFORMASI PRIBADI</h2>
            <p className="text-[14px] text-black mb-12 leading-relaxed">
                Kelola informasi pribadi Anda, termasuk nama, email, dan nomor telepon.
            </p>
            
            <div className="border border-gray-200 p-8">
                <p className="text-[14px] text-gray-500 italic">Konten informasi pribadi akan segera hadir...</p>
            </div>
        </LayoutUser>
    );
};

export default ProfilePage;