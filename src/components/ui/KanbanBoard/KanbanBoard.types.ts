import React from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

export type KanbanColumn<ItemType> = {
  key: string;
  label: string;
  items: ItemType[];
};

export type SortableItemProps<ItemType> = {
  id: UniqueIdentifier;
  item: ItemType;
};

export type RenderOverlayProps<ItemType> = {
  item: ItemType;
};

type SortableItemComponent<ItemType> = React.ComponentType<
  SortableItemProps<ItemType>
>;

export type ColumnRenderArgs<
  ItemType extends Record<string, UniqueIdentifier>
> = {
  column: KanbanColumn<ItemType>;
  columnIndex: number;
  isLoading?: boolean;
  helpers: {
    getItemId: (item: ItemType) => UniqueIdentifier;
    getColumnDroppableId: (columnKey: string) => UniqueIdentifier;
    SortableItem: SortableItemComponent<ItemType>;
  };
};

export type OnItemUpdateArgs = {
  itemId: UniqueIdentifier;
  phase: string;
  prevEl: UniqueIdentifier | null;
};

export interface KanbanBoardProps<
  ItemType extends Record<string, UniqueIdentifier>
> {
  columns: KanbanColumn<ItemType>[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn<ItemType>[]>>;
  columnRender: (args: ColumnRenderArgs<ItemType>) => React.ReactNode;
  uniqueIdentifier?: keyof ItemType;
  RenderOverlay?: React.ComponentType<RenderOverlayProps<ItemType>>;
  sortableItemRender: SortableItemComponent<ItemType>;
  onItemUpdate?: (args: OnItemUpdateArgs) => Promise<void>;
  isLoading?: boolean;
}
