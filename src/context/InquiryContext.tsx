"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Inquiry } from "@/interfaces/inquiry";
import { message } from "@/components/ui/Message";

interface InquiriesResponse {
  success: boolean;
  data: Record<string, Inquiry[]>;
  count: number;
}

export interface InquiryFilters {
  clientName?: string;
  startDate?: string;
  endDate?: string;
  minValue?: number;
}

interface InquiryContextType {
  inquiries: Record<string, Inquiry[]>;
  isLoading: boolean;
  error: string | null;
  filters: InquiryFilters;
  setFilters: React.Dispatch<React.SetStateAction<InquiryFilters>>;
  refreshInquiries: () => Promise<void>;
  setInquiries: React.Dispatch<React.SetStateAction<Record<string, Inquiry[]>>>;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [inquiries, setInquiries] = useState<Record<string, Inquiry[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InquiryFilters>({});

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.clientName) params.append("clientName", filters.clientName);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.minValue) params.append("minValue", filters.minValue.toString());

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch inquiries");

      const payload = (await response.json()) as InquiriesResponse;
      if (!payload?.success) throw new Error("Request was not successful");

      setInquiries(payload.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching inquiries:", err);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  return (
    <InquiryContext.Provider
      value={{
        inquiries,
        isLoading,
        error,
        filters,
        setFilters,
        refreshInquiries: fetchInquiries,
        setInquiries,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiries() {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error("useInquiries must be used within an InquiryProvider");
  }
  return context;
}
