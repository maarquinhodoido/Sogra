import type { ReactNode } from "react";
import { logoutAdminAction } from "@/app/actions/admin";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="container-shell py-6">
      <div className="mb-6 flex items-center justify-between rounded-[2rem] border border-line bg-white/80 px-6 py-4 backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">Área protegida</p>
          <p className="mt-1 text-sm text-muted">Sessão: {session.name} · {session.role}</p>
        </div>
        <form action={logoutAdminAction}>
          <button type="submit" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-foreground">
            Terminar sessão
          </button>
        </form>
      </div>
      <div className="grid gap-6 xl:grid-cols-[280px,1fr]">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
