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
    blue: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    purple: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]',
    green: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
  };

  return (
    <div className="w-full mb-4 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-2 font-bold tracking-wider">
          {icon}
          {label}
        </span>
        <span className="text-[10px] font-mono font-bold text-zinc-400">{value}/{max}</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-950 border border-zinc-800 overflow-hidden relative rounded-full">
        <div 
          className={`h-full transition-all duration-500 ease-out ${colorMap[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default StatsBar;