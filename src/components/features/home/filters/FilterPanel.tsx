"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import { useInquiries } from "@/context/InquiryContext";
import { Input, DatePicker, Slider } from "@/components/ui/Inputs";
import { Button } from "@/components/ui/Button";

const FilterPanel = () => {
  const { filters, setFilters } = useInquiries();
  const [searchTerm, setSearchTerm] = useState(filters.clientName || "");
  const [localMinValue, setLocalMinValue] = useState(filters.minValue || 0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, clientName: searchTerm }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, setFilters]);

  // Debounce min value slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, minValue: localMinValue }));
    }, 400);

    return () => clearTimeout(timer);
  }, [localMinValue, setFilters]);

  // Sync local states with filters (e.g., when cleared)
  useEffect(() => {
    setSearchTerm(filters.clientName || "");
    setLocalMinValue(filters.minValue || 0);
  }, [filters.clientName, filters.minValue]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.clientName) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.minValue && filters.minValue > 0) count++;
    return count;
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setLocalMinValue(0);
  };

  return (
    <div className="bg-white border-b border-zinc-200 sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-end gap-4 lg:gap-6">
          {/* Client Name Search */}
          <div className="w-full lg:flex-1 min-w-[240px]">
            <div className="relative group">
              <Input
                label="Client Name"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3.5 top-[34px] w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            </div>
          </div>

          {/* Date Range */}
          <div className="w-full lg:flex-[1.5] xl:flex-1 min-w-[300px] flex gap-2">
            <div className="flex-1">
              <DatePicker
                label="From Date"
                value={filters.startDate || ""}
                onChange={(date) =>
                  setFilters((prev) => ({ ...prev, startDate: date }))
                }
              />
            </div>
            <div className="flex-1">
              <DatePicker
                label="To Date"
                value={filters.endDate || ""}
                onChange={(date) =>
                  setFilters((prev) => ({ ...prev, endDate: date }))
                }
              />
            </div>
          </div>

          {/* Min Value Slider */}
          <div className="w-full sm:w-[calc(50%-8px)] lg:w-48">
            <Slider
              label="Min Value ($)"
              min={0}
              max={100000}
              step={1000}
              value={localMinValue}
              onChange={(val) => setLocalMinValue(val)}
            />
          </div>

          {/* Actions & Count */}
          <div className="w-full sm:w-[calc(50%-8px)] lg:w-auto flex items-center justify-between sm:justify-end lg:justify-start pb-0.5 gap-3">
            <div className="flex items-center space-x-2 text-zinc-500 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-100 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                {activeFiltersCount} active
              </span>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="md"
                onClick={handleClearFilters}
                className="text-zinc-500 hover:text-red-600 group"
              >
                <X className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

