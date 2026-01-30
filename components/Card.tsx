import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  active?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, active, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-6 border transition-all duration-300 bg-zinc-950/50 backdrop-blur-sm
        ${active ? 'border-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-zinc-800 hover:border-zinc-600'}
        ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {active && (
        <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-zinc-100"></div>
      )}
      {active && (
        <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-zinc-100"></div>
      )}
      
      {title && (
        <h3 className={`text-lg font-bold mb-2 font-mono uppercase tracking-tight ${active ? 'text-white' : 'text-zinc-400'}`}>
          {title}
        </h3>
      )}
      <div className="text-zinc-300 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default Card;