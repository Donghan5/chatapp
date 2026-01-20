import React, { forwardRef, ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: ReactNode;
  variant?: "outline" | "filled" | "ghost";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      label, 
      error, 
      containerClassName = "", 
      className = "", 
      leftIcon, 
      variant = "outline", 
      ...props 
    },
    ref,
  ) => {
    const baseStyles = "w-full py-2 transition-colors focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed";
    
    const variantStyles = {
      outline: `border rounded px-3 ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 focus:ring-2"}`,
      filled: "bg-gray-100 border-transparent rounded-lg px-3 focus:bg-white focus:ring-2 focus:ring-gray-200",
      ghost: "bg-transparent border-none px-0 focus:ring-0",
    };

    const paddingLeft = leftIcon ? "pl-10" : "";

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              ${baseStyles}
              ${variantStyles[variant]}
              ${paddingLeft}
              ${className} 
            `}
            {...props}
          />
        </div>

        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";