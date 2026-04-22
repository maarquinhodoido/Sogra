import { cancelAppointmentAction } from "@/app/actions/admin";
import { createAdminAppointmentAction } from "@/app/actions/admin";
import { saveTimeOffAction } from "@/app/actions/admin";
import { AppointmentsAgendaBoard } from "@/components/admin/appointments-agenda-board";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminAppointmentsData, getAdminAvailabilityData, getAdminServicesData } from "@/lib/admin-data";

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    q?: string;
    created?: string;
    date?: string;
    time?: string;
    professionalId?: string;
    serviceId?: string;
    page?: string;
    canceled?: string;
  }>;
}) {
  const params = await searchParams;
  const appointments = await getAdminAppointmentsData();
  const availabilityData = await getAdminAvailabilityData();
  const servicesData = await getAdminServicesData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Marcações"
        description="Acompanhe a agenda, aprove marcações pendentes, veja detalhes por clique e faça gestão de folgas/pausas/dias não úteis."
      />

      {params.created === "1" ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          Marcação criada com sucesso na agenda.
        </p>
      ) : null}

      {params.created === "0" ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Não foi possível criar a marcação nesse horário. Verifique disponibilidade e dados.
        </p>
      ) : null}

      {params.canceled === "1" ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          Marcação cancelada e removida da agenda.
        </p>
      ) : null}

      {params.canceled === "0" ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Não foi possível cancelar esta marcação.
        </p>
      ) : null}

      <AppointmentsAgendaBoard
        appointments={appointments.map((appointment) => ({
          id: appointment.id,
          customerName: appointment.customer.name,
          customerPhone: appointment.customer.phone,
          customerEmail: appointment.customer.email ?? undefined,
          serviceName: appointment.service.name,
          serviceId: appointment.service.id,
          professionalId: appointment.professional.id,
          professionalName: appointment.professional.name,
          status: appointment.status,
          startAt: appointment.startAt.toISOString(),
          endAt: appointment.endAt.toISOString(),
          internalNotes: appointment.internalNotes ?? undefined,
          clientNotes: appointment.clientNotes ?? undefined,
        }))}
        timeOffs={availabilityData.timeOffs.map((item) => ({
          id: item.id ?? "",
          title: item.title,
          reason: item.reason,
          startsAt: item.startsAt.toISOString(),
          endsAt: item.endsAt.toISOString(),
          isAllDay: item.isAllDay,
          professionalId: item.professionalId,
        }))}
        services={servicesData.services
          .filter((service) => service.isActive)
          .map((service) => ({ id: service.id, name: service.name }))}
        professionals={availabilityData.professionals}
        saveTimeOffAction={saveTimeOffAction}
        createAppointmentAction={createAdminAppointmentAction}
        cancelAppointmentAction={cancelAppointmentAction}
      />
    </div>
  );
}
