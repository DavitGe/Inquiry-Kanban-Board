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
}
