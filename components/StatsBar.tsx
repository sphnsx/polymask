import React from 'react';

interface StatsBarProps {
  label: string;
  value: number;
  max?: number;
  color: 'red' | 'blue' | 'purple' | 'green';
  icon?: React.ReactNode;
}

const StatsBar: React.FC<StatsBarProps> = ({ label, value, max = 100, color, icon }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorMap = {
    red: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    blue: 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]',
    purple: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]',
    green: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
  };

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="text-xs font-mono font-bold text-zinc-200">{value}/{max}</span>
      </div>
      <div className="h-2 w-full bg-zinc-900 border border-zinc-800 overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-500 ease-out ${colorMap[color]}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Striped overlay pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhZWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')]"></div>
      </div>
    </div>
  );
};

export default StatsBar;