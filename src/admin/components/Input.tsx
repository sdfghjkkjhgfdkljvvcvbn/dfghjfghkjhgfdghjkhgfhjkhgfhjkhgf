import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#202124] mb-2">
            {label}
            {props.required && <span className="text-[#8F2F2F]">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-[8px] text-[#202124] placeholder-[#77736D] transition-all duration-200 focus:outline-none ${
            error 
              ? 'border-[#8F2F2F] bg-white' 
              : 'border-[#E5E1DA] bg-white hover:border-[#D4CDBF]'
          } focus:border-[#8F2F2F] focus:ring-1 focus:ring-[#8F2F2F]/20 ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#8F2F2F] font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-[#77736D]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
