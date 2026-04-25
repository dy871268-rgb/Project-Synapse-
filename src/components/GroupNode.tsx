import React from 'react';
import { NodeProps } from '@xyflow/react';
import { cn } from '../lib/utils';

export const GroupNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "w-full h-full rounded-[2rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center",
      selected ? "border-primary bg-primary/10" : "border-pink-200 bg-pink-50/20"
    )}>
      <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full border border-pink-100 shadow-sm -mt-5">
        <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">
          {data.label || 'Neural Module Cluster'}
        </span>
      </div>
    </div>
  );
};
