"use client";
import React, { useCallback, useMemo, useState, useId, useRef } from "react";
import {
  DndContext,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
  DragOverlay,
  DragCancelEvent,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanBoardProps, KanbanColumn } from "./KanbanBoard.types";

const COLUMN_DROPPABLE_PREFIX = "kanban-column:";

export function KanbanBoard<ItemType extends object>({
  columns,
  setColumns,
  columnRender,
  uniqueIdentifier = "id" as keyof ItemType,
  RenderOverlay,
  sortableItemRender,
  onItemUpdate,
  isLoading,
}: KanbanBoardProps<ItemType>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  const dndInstanceId = useId();
  const [activeItem, setActiveItem] = useState<ItemType | null>(null);
  const initialColumns = useRef<KanbanColumn<ItemType>[] | null>(null);

  const getItemId = useCallback(
    (item: ItemType) => item[uniqueIdentifier] as unknown as UniqueIdentifier,
    [uniqueIdentifier]
  );

  const getColumnDroppableId = useCallback((columnKey: string) => {
    return `${COLUMN_DROPPABLE_PREFIX}${columnKey}`;
  }, []);

  const findColumnIndexByItemId = useCallback(
    (allColumns: KanbanColumn<ItemType>[], itemId: UniqueIdentifier) => {
      return allColumns.findIndex((column) =>
        column.items.some((item) => getItemId(item) === itemId)
      );
    },
    [getItemId]
  );

  const findItemById = useCallback(
    (allColumns: KanbanColumn<ItemType>[], itemId: UniqueIdentifier) => {
      for (const column of allColumns) {
        const match = column.items.find((item) => getItemId(item) === itemId);
        if (match) return match;
      }
      return null;
    },
    [getItemId]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const item = findItemById(columns, active.id);
      setActiveItem(item);
      initialColumns.current = columns;
    },
    [columns, findItemById]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const overIdStr = overId.toString();
      const isOverColumn = overIdStr.startsWith(COLUMN_DROPPABLE_PREFIX);

      setColumns((prev) => {
        const activeColIndex = findColumnIndexByItemId(prev, activeId);
        const overColIndex = isOverColumn
          ? prev.findIndex((col) => getColumnDroppableId(col.key) === overIdStr)
          : findColumnIndexByItemId(prev, overId);

        if (
          activeColIndex === -1 ||
          overColIndex === -1 ||
          activeColIndex === overColIndex
        ) {
          return prev;
        }

        const activeCol = prev[activeColIndex];
        const overCol = prev[overColIndex];
        const activeIndex = activeCol.items.findIndex(
          (item) => getItemId(item) === activeId
        );

        if (activeIndex === -1) return prev;

        const newActiveItems = [...activeCol.items];
        const [movedItem] = newActiveItems.splice(activeIndex, 1);

        const updatedItem = {
          ...movedItem,
          ...("phase" in movedItem ? { phase: overCol.key } : {}),
        } as ItemType;

        const newOverItems = [...overCol.items];
        const overIndex = isOverColumn
          ? newOverItems.length
          : newOverItems.findIndex((item) => getItemId(item) === overId);

        const insertAt = overIndex === -1 ? newOverItems.length : overIndex;
        newOverItems.splice(insertAt, 0, updatedItem);

        const next = [...prev];
        next[activeColIndex] = { ...activeCol, items: newActiveItems };
        next[overColIndex] = { ...overCol, items: newOverItems };
        return next;
      });
    },
    [setColumns, getItemId, getColumnDroppableId, findColumnIndexByItemId]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);

      if (!over) {
        initialColumns.current = null;
        return;
      }

      const activeId = active.id;
      const overId = over.id;

      const colIndex = findColumnIndexByItemId(columns, activeId);
      if (colIndex === -1) {
        initialColumns.current = null;
        return;
      }

      const col = columns[colIndex];
      const activeIndex = col.items.findIndex(
        (item: ItemType) => getItemId(item) === activeId
      );
      const overIndex = col.items.findIndex(
        (item: ItemType) => getItemId(item) === overId
      );

      let nextColumns = columns;
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const next = [...columns];
        next[colIndex] = {
          ...col,
          items: arrayMove(col.items, activeIndex, overIndex),
        };
        nextColumns = next;
      }

      setColumns(nextColumns);

      const finalColIndex = findColumnIndexByItemId(nextColumns, activeId);
      if (finalColIndex !== -1) {
        const finalCol = nextColumns[finalColIndex];
        const itemIndex = finalCol.items.findIndex(
          (item: ItemType) => getItemId(item) === activeId
        );
        const prevEl =
          itemIndex > 0 ? getItemId(finalCol.items[itemIndex - 1]) : null;
        const phase = finalCol.key;

        if (onItemUpdate) {
          try {
            await onItemUpdate({
              itemId: activeId,
              phase,
              prevEl,
            });
          } catch (error) {
            console.error("Error updating item:", error);
            if (initialColumns.current) {
              setColumns(initialColumns.current);
            }
          }
        }
      }

      initialColumns.current = null;
    },
    [columns, setColumns, getItemId, findColumnIndexByItemId, onItemUpdate]
  );

  const handleDragCancel = useCallback((_event: DragCancelEvent) => {
    setActiveItem(null);
    initialColumns.current = null;
  }, []);

  const helpers = useMemo(
    () => ({
      getItemId,
      getColumnDroppableId,
      SortableItem: sortableItemRender,
    }),
    [getItemId, getColumnDroppableId, sortableItemRender]
  );

  return (
    <DndContext
      id={dndInstanceId}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-row gap-6 p-6 items-stretch overflow-x-auto w-full h-full custom-scrollbar">
        {columns.map((column, columnIndex) => {
          const ColumnComponent = columnRender as React.ComponentType<
            Parameters<typeof columnRender>[0]
          >;
          return (
            <ColumnComponent
              key={column.key}
              column={column}
              columnIndex={columnIndex}
              isLoading={isLoading}
              helpers={helpers}
            />
          );
        })}
      </div>
      {RenderOverlay && activeItem ? (
        <DragOverlay style={{ zIndex: 1000 }}>
          <RenderOverlay item={activeItem} />
        </DragOverlay>
      ) : null}
    </DndContext>
  );
}
