"use client";

import React, { forwardRef } from "react";
import { InputProps } from "./Inputs.types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-zinc-500 ml-1 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 
              bg-white border border-zinc-200 rounded-xl 
              text-sm text-zinc-900 
              placeholder:text-zinc-400
              transition-all duration-200 ease-in-out hover:border-zinc-300 
              focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                error
                  ? "border-red-500 focus:ring-red-500/5 focus:border-red-500"
                  : ""
              }
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

Input.displayName = "Input";

export default Input;
