"use client";
import React, { useState } from "react";
import { SortableItemProps } from "@/components/ui/KanbanBoard";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Inquiry } from "@/interfaces/inquiry";
import CardContent from "./CardContent";
import { Modal } from "@/components/ui/Modal";
import { InquiryDetailView } from "./InquiryDetailView";

function SortableItem({ id, item }: SortableItemProps<Inquiry>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sortable = useSortable({
    id,
    animateLayoutChanges: defaultAnimateLayoutChanges,
  });
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "pointer",
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <CardContent item={item} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Inquiry Details"
        size="lg"
      >
        <InquiryDetailView
          inquiry={item}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}

export default React.memo(SortableItem);
