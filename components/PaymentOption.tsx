import React from 'react';

interface PaymentOptionProps {
    id: string;
    title: string;
    description: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    icon: React.ReactNode;
}

const PaymentOption = ({ id, title, description, isSelected, onSelect, icon }: PaymentOptionProps) => {
    return (
        <label 
            className={`flex items-center p-5 border-2 cursor-pointer transition-all ${isSelected ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
            onClick={() => onSelect(id)}
        >
            <input type="radio" name="payment" className="sr-only" checked={isSelected} readOnly />
            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${isSelected ? 'border-black' : 'border-gray-300'}`}>
                {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
            </div>
            <div className="flex-grow">
                <div className="font-bold text-[13px] uppercase tracking-widest">{title}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider">{description}</div>
            </div>
            <div className="text-gray-400">
                {icon}
            </div>
        </label>
    );
};

export default PaymentOption;
