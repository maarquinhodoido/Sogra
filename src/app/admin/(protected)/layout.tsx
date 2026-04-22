import type { ReactNode } from "react";
import { logoutAdminAction } from "@/app/actions/admin";
import { AdminPanelFrame } from "@/components/admin/admin-panel-frame";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="admin-shell min-h-screen px-3 py-4 sm:px-4 lg:px-6">
      <AdminPanelFrame sessionName={session.name} sessionRole={session.role} logoutAction={logoutAdminAction}>{children}</AdminPanelFrame>
    </div>
  );
}
