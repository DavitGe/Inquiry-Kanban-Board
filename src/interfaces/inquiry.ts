export interface Inquiry {
  id: string;
  clientName: string;
  contactPerson: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  potentialValue: number;
  phase: string;
  hotels: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  prevEl: string | null;
}

export const PHASE_COLUMNS = [
  { key: "New", label: "New" },
  { key: "Sent to Hotels", label: "Sent to Hotels" },
  { key: "Offers Received", label: "Offers Received" },
  { key: "Completed", label: "Completed" },
] as const;
