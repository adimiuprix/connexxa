"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ButtonDark from '@/components/ButtonDark';

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulasi proses login
        setTimeout(() => {
            setIsLoading(false);
            router.push('/admin/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 selection:bg-black selection:text-white">
            
            <div className="w-full max-w-[500px] bg-white border-2 border-black p-10 md:p-14 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black italic text-4xl mx-auto mb-6">
                        C
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                        Admin Portal
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">
                        Otorisasi Diperlukan
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em] mb-3">
                            Alamat Email
                        </label>
                        <input 
                            type="email" 
                            required
                            placeholder="ADMIN@CONNEXXA.COM" 
                            className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-[12px] font-black italic uppercase outline-none transition-all"
                        />
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <label className="block text-[11px] font-black uppercase text-gray-500 tracking-[0.2em]">
                                Kata Sandi
                            </label>
                        </div>
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••" 
                            className="w-full bg-gray-50 border-2 border-transparent hover:border-black focus:border-black px-6 py-4 text-[12px] font-black italic outline-none transition-all tracking-widest"
                        />
                    </div>

                    <div className="pt-4">
                        <ButtonDark
                            text={isLoading ? "MEMPROSES..." : "MASUK KE DASHBOARD"}
                            fullWidth
                            className="py-6 !text-sm !tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        />
                    </div>
                </form>

            </div>

            <div className="mt-12 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    &copy; 2026 Connexxa Systems
                </p>
            </div>
            
        </div>
    );
}
