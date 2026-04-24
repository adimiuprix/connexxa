import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

/**
 * Premium Form Input Component
 * Encapsulates the Connexxa design system for text inputs.
 */
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-black">
                        {label}
                    </label>
                )}
                <div className="group relative">
                    <input
                        ref={ref}
                        {...props}
                        className={`
                            w-full p-4 bg-gray-50 border border-gray-200 
                            focus:border-black focus:bg-white outline-none 
                            transition-all duration-200 font-bold text-[12px] 
                            tracking-widest placeholder:text-gray-400
                            ${className}
                        `}
                    />
                    {/* Subtle focus accent line */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-black transition-all duration-300 group-focus-within:w-full" />
                </div>
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;
