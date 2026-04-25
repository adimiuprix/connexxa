import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ButtonDark = ({ text, outline = false, fullWidth = false, icon, className = "" }: { text: string; outline?: boolean; fullWidth?: boolean; icon?: React.ReactNode; className?: string }) => {
    const IconComponent = icon || <ArrowForwardIcon className="ml-3 transition-transform duration-200 group-hover:translate-x-1" sx={{ fontSize: 20 }} />;
    
    if (outline) {
        return (
            <button className={`group relative flex items-center bg-white text-black px-6 py-3 border border-black font-bold uppercase tracking-widest text-[13px] hover:text-gray-600 transition-colors duration-200 ${fullWidth ? 'w-full justify-between' : ''} ${className}`}>
                <span>{text}</span>
                {IconComponent}
            </button>
        );
    }

    return (
        <button className={`group relative flex items-center bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-[13px] hover:text-gray-400 transition-colors duration-200 ${fullWidth ? 'w-full justify-between' : ''} ${className}`}>
            <span>{text}</span>
            {IconComponent}
            {/* Box shadow effect simulation logic */}
            <div className="absolute top-1 left-1 w-full h-full border border-black -z-10 group-active:top-0 group-active:left-0 transition-all"></div>
        </button>
    );
};

export default ButtonDark;
