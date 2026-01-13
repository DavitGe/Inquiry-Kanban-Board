"use client";

import React, { forwardRef } from "react";
import { SliderProps } from "./Inputs.types";

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, error, className = "", min = 0, max = 100, step = 1, value, onChange, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center px-1">
          {label && (
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {label}
            </label>
          )}
          <span className="text-xs font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md">
            {value}
          </span>
        </div>
        
        <div className="relative flex items-center h-6">
          <input
            type="range"
            ref={ref}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`
              w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer
              accent-zinc-900 hover:accent-zinc-800
              focus:outline-none focus:ring-2 focus:ring-zinc-900/5
              transition-all duration-200
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-zinc-900
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:shadow-sm
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:duration-150
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:active:scale-95
              ${error ? "accent-red-500 [&::-webkit-slider-thumb]:border-red-500" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-[11px] text-red-500 ml-1 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;

