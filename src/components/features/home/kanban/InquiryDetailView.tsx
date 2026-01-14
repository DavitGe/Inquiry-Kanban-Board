import React, { useState } from "react";
import { Inquiry, PHASE_COLUMNS } from "@/interfaces/inquiry";
import Select from "@/components/ui/Inputs/Select";
import Button from "@/components/ui/Button/Button";
import { message } from "@/components/ui/Message";
import { useInquiries } from "@/context/InquiryContext";

interface InquiryDetailViewProps {
  inquiry: Inquiry;
  onClose?: () => void;
}

export const InquiryDetailView: React.FC<InquiryDetailViewProps> = ({
  inquiry,
  onClose,
}) => {
  const [selectedPhase, setSelectedPhase] = useState(inquiry.phase);
  const [isSaving, setIsSaving] = useState(false);
  const { setInquiries } = useInquiries();
  const handleSave = async () => {
    if (selectedPhase === inquiry.phase) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phase: selectedPhase,
          prevEl: null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update phase");
      const { data: updatedInquiry } = await response.json();

      message.success("Phase updated successfully");
      onClose?.();

      //show changes in board
      setInquiries((prev) => {
        const sourcePhase = prev[inquiry.phase] || [];
        const destPhase = prev[updatedInquiry.phase] || [];

        return {
          ...prev,
          [inquiry.phase]: sourcePhase.reduce(
            (acc: Inquiry[], el: Inquiry) => {
              if (el.id === updatedInquiry.id) {
                return acc;
              }
              if (el.prevEl === inquiry.id) {
                return [
                  ...acc,
                  {
                    ...el,
                    prevEl: inquiry.prevEl,
                  },
                ];
              }
              return [...acc, el];
            },
            []
          ),
          [updatedInquiry.phase]: [
            updatedInquiry,
            ...destPhase.map((el) => {
              if (el.prevEl === null) {
                return {
                  ...el,
                  prevEl: updatedInquiry.id,
                };
              }
              return el;
            }),
          ],
        };
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to update phase");
    } finally {
      setIsSaving(false);
    }
  };

  const detailItems = [
    { label: "Client Name", value: inquiry.clientName },
    { label: "Contact Person", value: inquiry.contactPerson },
    { label: "Event Type", value: inquiry.eventType },
    {
      label: "Event Date",
      value: new Date(inquiry.eventDate).toLocaleDateString(),
    },
    { label: "Guest Count", value: inquiry.guestCount },
    {
      label: "Potential Value",
      value: `$${inquiry.potentialValue.toLocaleString()}`,
    },
    { label: "Phase", value: inquiry.phase, className: "capitalize" },
    {
      label: "Created At",
      value: new Date(inquiry.createdAt).toLocaleString(),
    },
    {
      label: "Updated At",
      value: new Date(inquiry.updatedAt).toLocaleString(),
    },
  ];

  const phaseOptions = PHASE_COLUMNS.map((p) => ({
    label: p.label,
    value: p.key,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {detailItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {item.label}
            </p>
            <p className={`text-sm text-zinc-900 ${item.className || ""}`}>
              {item.value || "N/A"}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-zinc-100">
        <Select
          label="Update Phase"
          value={selectedPhase}
          onChange={setSelectedPhase}
          options={phaseOptions}
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Hotels
        </p>
        <div className="flex flex-wrap gap-2">
          {inquiry.hotels.length > 0 ? (
            inquiry.hotels.map((hotel, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {hotel}
              </span>
            ))
          ) : (
            <span className="text-sm text-zinc-500 italic">
              No hotels assigned
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Notes
        </p>
        <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
          <p className="text-sm text-zinc-600 whitespace-pre-wrap leading-relaxed">
            {inquiry.notes || "No notes available."}
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-100 flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          disabled={selectedPhase === inquiry.phase}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
