import React from "react";

type ButtonVariant = "primary" | "secondary" | "send" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export const Button = ({
    variant = "primary",
    size = "md",
    onClick,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles =
        "font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary:
            "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
        send: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost:
            "bg-transparent text-gray-500 hover:bg-gray-100 focus:text-gray-700 focus:ring-gray-200",
    };

    const sizeStyles: Record<ButtonSize, string> = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
        icon: "p-2 w-10 h-10",
    };

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

    return (
        <button className={combinedStyles} onClick={onClick} disabled={disabled} {...props}>
            {children}
        </button>
    );
};
