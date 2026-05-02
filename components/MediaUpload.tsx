"use client";

import React, { useState, useRef } from "react";

interface MediaUploadProps {
    onImagesChange: (files: File[]) => void;
}

/**
 * MediaUpload Component
 * Handles drag & drop and file selection for product images with a brutalist aesthetic.
 */
const MediaUpload: React.FC<MediaUploadProps> = ({ onImagesChange }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (incomingFiles: FileList | null) => {
        if (!incomingFiles) return;
        
        const newFiles = Array.from(incomingFiles).filter(file => file.type.startsWith('image/'));
        if (newFiles.length === 0) return;

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onImagesChange(updatedFiles);

        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        
        setFiles(updatedFiles);
        setPreviews(updatedPreviews);
        onImagesChange(updatedFiles);
    };

    return (
        <div className="form-section bg-white p-10 border border-gray-100 hover:border-black transition-all">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 pb-4 border-b-4 border-black">Media Produk</h2>

            <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`
                    border-2 border-dashed p-12 flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-50 group
                    ${isDragging ? 'border-black bg-gray-100 scale-[0.99]' : 'border-gray-300 hover:border-black'}
                `}
            >
                <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => handleFiles(e.target.files)}
                    accept="image/*"
                />
                <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                </div>
                <span className="text-sm font-black uppercase italic tracking-widest text-black">
                    {isDragging ? 'Lepas Gambar Sekarang' : 'Klik atau Tarik Gambar'}
                </span>
                <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-[0.1em] uppercase text-center">PNG, JPG, WEBP (Maksimal 5MB per file)</span>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                    {previews.map((src, index) => (
                        <div key={index} className="relative group aspect-square border-2 border-black bg-[#ebedee] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                            <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                }}
                                className="absolute top-2 right-2 w-8 h-8 bg-white border-2 border-black flex items-center justify-center font-black hover:bg-red-500 hover:text-white transition-all z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaUpload;
