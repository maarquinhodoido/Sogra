import { saveProfessionalAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { TeamManager } from "@/components/admin/team-manager";
import { getAdminTeamData } from "@/lib/admin-data";

export default async function AdminTeamPage() {
  const data = await getAdminTeamData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Equipa"
        description="Pesquise rapidamente membros da equipa e crie novos perfis através de um formulário em pop-up."
      />

      <TeamManager professionals={data.professionals} services={data.services} createAction={saveProfessionalAction} />
    </div>
  );
}