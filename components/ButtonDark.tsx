import React from 'react';

interface ButtonDarkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    outline?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

const ButtonDark = ({ text, outline = false, fullWidth = false, icon, className = "", ...props }: ButtonDarkProps) => {
    return (
        <button 
            className={`group relative flex items-center px-6 py-3 font-bold uppercase tracking-widest text-[13px] transition-colors duration-200 ${fullWidth ? 'w-full justify-between' : ''} ${outline ? 'bg-white text-black border border-black hover:text-gray-600' : 'bg-black text-white hover:text-gray-400'} ${className}`}
            {...props}
        >
            <span>{text}</span>
            {icon}
            {!outline && (
                <div className="absolute top-1 left-1 w-full h-full border border-black -z-10 group-active:top-0 group-active:left-0 transition-all"></div>
            )}
        </button>
    );
};

export default ButtonDark;
