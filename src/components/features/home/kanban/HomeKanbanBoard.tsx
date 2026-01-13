"use client";
import { useCallback, useEffect, useState } from "react";
import {
  KanbanBoard,
  KanbanColumn,
  OnItemUpdateArgs,
} from "@/components/ui/KanbanBoard";
import ColumnRenderer from "@/components/features/home/kanban/ColumnRenderer";
import SortableItem from "@/components/features/home/kanban/SortableItem";
import CardContent from "@/components/features/home/kanban/CardContent";
import { Inquiry, PHASE_COLUMNS } from "@/interfaces/inquiry";
import { message } from "@/components/ui/Message";
import { useInquiries } from "@/context/InquiryContext";

export default function HomeKanbanBoard() {
  const { inquiries, isLoading } = useInquiries();
  const [columns, setColumns] = useState<KanbanColumn<Inquiry>[]>(() =>
    PHASE_COLUMNS.map((column) => ({ ...column, items: [] }))
  );

  useEffect(() => {
    setColumns(
      PHASE_COLUMNS.map((column) => ({
        ...column,
        items: inquiries[column.key] ?? [],
      }))
    );
  }, [inquiries]);

  const handleItemUpdate = useCallback(async (args: OnItemUpdateArgs) => {
    try {
      const { itemId, phase, prevEl } = args;
      const response = await fetch(`/api/inquiries/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phase,
          prevEl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update inquiry");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      message.error("Failed to update inquiry");
      throw error;
    }
  }, []);

  return (
    <KanbanBoard<Inquiry>
      columns={columns}
      setColumns={setColumns}
      columnRender={ColumnRenderer}
      RenderOverlay={CardContent}
      sortableItemRender={SortableItem}
      onItemUpdate={handleItemUpdate}
      isLoading={isLoading}
    />
  );
}
