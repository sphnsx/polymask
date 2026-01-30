import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-all duration-200 border relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";
  
  const variants = {
    primary: "bg-zinc-100 text-black border-zinc-100 hover:bg-white focus:ring-zinc-500",
    secondary: "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white focus:ring-zinc-700",
    danger: "bg-transparent text-red-500 border-red-900/50 hover:bg-red-950/30 hover:border-red-500 focus:ring-red-900",
    ghost: "bg-transparent text-zinc-500 border-transparent hover:text-zinc-300"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'secondary' && (
        <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out -z-0 opacity-10"></div>
      )}
    </button>
  );
};

export default Button;