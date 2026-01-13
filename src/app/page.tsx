"use client";
import HomeKanbanBoard from "@/components/features/home/kanban/HomeKanbanBoard";
import { FilterPanel } from "@/components/features/home/filters";

export default function Home() {
  return (
    <main className="h-screen bg-zinc-50 font-sans flex flex-col overflow-hidden">
      <FilterPanel />
      <div className="flex-1 overflow-hidden">
        <HomeKanbanBoard />
      </div>
    </main>
  );
}
