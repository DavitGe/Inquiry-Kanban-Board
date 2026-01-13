import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  className?: string;
  onChange: (date: string) => void;
}

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  error?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}
