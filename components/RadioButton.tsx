'use client';

import React, { useState } from 'react';

interface RadioButtonOption {
    label: string;
    value: string;
    disabled?: boolean;
}

interface RadioButtonProps {
    options: RadioButtonOption[];
    defaultValue?: string;
    onChange?: (value: string) => void;
    name?: string;
}

const RadioButton = ({ options, defaultValue, onChange, name = 'radio-group' }: RadioButtonProps) => {
    const [selected, setSelected] = useState<string>(defaultValue || '');

    const handleSelect = (value: string) => {
        setSelected(value);
        onChange?.(value);
    };

    return (
        <div className="flex flex-wrap gap-[2px]">
            {options.map((option) => {
                const isActive = selected === option.value;
                const isDisabled = option.disabled;

                return (
                    <label
                        key={option.value}
                        className={`
                            relative
                            ${isActive ? 'border-[2px] border-black z-10' : 'border-[2px] border-transparent'}
                            ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={isActive}
                            onChange={() => !isDisabled && handleSelect(option.value)}
                            className="sr-only"
                            disabled={isDisabled}
                        />
                        <span
                            className={`
                                flex h-8 items-center justify-center
                                border text-center text-xs w-8
                                ${isActive
                                    ? 'bg-black border-transparent text-white font-bold'
                                    : 'border-gray-300 text-black hover:bg-black hover:text-white hover:border-black'
                                }
                                ${isDisabled ? 'pointer-events-none line-through' : ''}
                            `}
                        >
                            {option.label}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

export default RadioButton;
