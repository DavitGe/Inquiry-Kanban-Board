"use client";
import { ColumnRenderArgs } from "@/components/ui/KanbanBoard";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Inquiry } from "@/interfaces/inquiry";
import { memo, useMemo, useState } from "react";

const ColumnRenderer = memo(
  ({
    column,
    columnIndex,
    isLoading,
    helpers: { getItemId, getColumnDroppableId, SortableItem },
  }: ColumnRenderArgs<Inquiry>) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const droppableId = getColumnDroppableId(column.key);
    const { setNodeRef } = useDroppable({
      id: droppableId,
      disabled: isCollapsed,
    });
    const totalValue = useMemo(() => {
      return column.items.reduce((acc, item) => acc + item.potentialValue, 0);
    }, [column.items]);

    const items = useMemo(() => column.items, [column.items]);
    const itemIds = useMemo(
      () => items.map((item) => getItemId(item)),
      [items, getItemId]
    );

    return (
      <div
        key={column.key}
        className={`flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-200 h-full ${
          isCollapsed ? "w-16 shrink-0" : "flex-1 min-w-[200px]"
        }`}
      >
        <div
          className={`flex items-center justify-between text-sm font-medium text-zinc-700 ${
            isCollapsed ? "md:flex-col md:gap-4 md:py-2" : ""
          }`}
        >
          <div
            className={`flex items-center gap-2 overflow-hidden ${
              isCollapsed ? "md:flex-col" : ""
            }`}
          >
            <span
              className={`truncate whitespace-nowrap ${
                isCollapsed
                  ? "md:[writing-mode:vertical-lr] md:rotate-180 md:h-32"
                  : ""
              }`}
            >
              {column.label}
            </span>
            {isLoading ? (
              <div className="h-4 w-6 animate-pulse rounded bg-zinc-100" />
            ) : (
              <span className="text-zinc-400">({column.items.length})</span>
            )}
          </div>

          <div
            className={`flex items-center gap-2 ${
              isCollapsed ? "md:flex-col" : ""
            }`}
          >
            {!isCollapsed &&
              (isLoading ? (
                <div className="h-4 w-12 animate-pulse rounded bg-zinc-100" />
              ) : (
                <span className="text-xs text-zinc-400">
                  ${totalValue?.toLocaleString()}
                </span>
              ))}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-md p-1 transition-colors hover:bg-zinc-100"
              title={isCollapsed ? "Expand column" : "Collapse column"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div
            ref={setNodeRef}
            className={
              "flex flex-1 flex-col gap-2 rounded-md border border-dashed p-2 overflow-y-auto overflow-x-hidden custom-scrollbar"
            }
          >
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 w-full animate-pulse rounded-md border border-zinc-100 bg-zinc-50"
                  />
                ))}
              </div>
            ) : (
              <SortableContext
                id={column.key}
                items={itemIds}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => {
                  const itemId = getItemId(item);
                  return <SortableItem key={itemId} id={itemId} item={item} />;
                })}
              </SortableContext>
            )}
          </div>
        )}
      </div>
    );
  }
);

ColumnRenderer.displayName = "ColumnRenderer";

export default ColumnRenderer;
