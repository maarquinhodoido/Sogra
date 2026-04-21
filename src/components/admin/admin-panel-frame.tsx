"use client";

import { useState, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

export function AdminPanelFrame({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setIsMinimized((value) => !value)}
          className="rounded-full border border-foreground bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:opacity-90"
        >
          {isMinimized ? "Mostrar painel" : "Ocultar painel"}
        </button>
      </div>

      <div className={cn("grid gap-6", isMinimized ? "grid-cols-1" : "lg:grid-cols-[240px,minmax(0,1fr)]")}>
        {!isMinimized ? <AdminSidebar className="h-fit self-start" /> : null}
        <div className="min-w-0">
        {children}
        </div>
      </div>
    </div>
  );
}