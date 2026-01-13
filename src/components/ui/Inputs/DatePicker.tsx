"use client";

import React, { forwardRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DatePickerProps } from "./Inputs.types";

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, className = "", onChange, value, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-zinc-500 ml-1 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            type="date"
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`
              w-full px-4 py-2.5 pl-10
              bg-white border border-zinc-200 rounded-xl 
              text-sm text-zinc-900 
              placeholder:text-zinc-400
              transition-all duration-200 ease-in-out hover:border-zinc-300 
              focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900
              disabled:opacity-50 disabled:cursor-not-allowed
              appearance-none
              [&::-webkit-calendar-picker-indicator]:absolute
              [&::-webkit-calendar-picker-indicator]:left-0
              [&::-webkit-calendar-picker-indicator]:top-0
              [&::-webkit-calendar-picker-indicator]:w-full
              [&::-webkit-calendar-picker-indicator]:h-full
              [&::-webkit-calendar-picker-indicator]:opacity-0
              [&::-webkit-calendar-picker-indicator]:cursor-pointer
              ${
                error
                  ? "border-red-500 focus:ring-red-500/5 focus:border-red-500"
                  : ""
              }
              ${className}
            `}
            {...props}
          />
          <CalendarIcon 
            className={`
              absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
              pointer-events-none transition-colors duration-200
              ${error ? "text-red-400" : "text-zinc-400 group-focus-within:text-zinc-900"}
            `} 
          />
        </div>
        {error && (
          <p className="text-[11px] text-red-500 ml-1 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;

