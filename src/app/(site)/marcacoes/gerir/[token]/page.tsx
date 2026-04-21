import { notFound } from "next/navigation";
import { cancelAppointmentByToken, rescheduleAppointmentByToken } from "@/app/actions/public";
import { ManageBookingForm } from "@/components/site/manage-booking-form";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function ManageBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;

  let appointment = null;

  try {
    appointment = await prisma.appointment.findUnique({
      where: { manageToken: token },
      include: {
        customer: true,
        professional: true,
        service: true,
      },
    });
  } catch {
    appointment = null;
  }

  if (!appointment) {
    notFound();
  }

  const boundReschedule = rescheduleAppointmentByToken.bind(null, token);

  return (
    <div className="section-space">
      <div className="container-shell max-w-4xl space-y-8">
        <div className="section-card rounded-[2rem] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">Gerir marcação</p>
          <h1 className="mt-4 font-[family-name:var(--font-geist-mono)] text-5xl text-foreground">
            {appointment.customer.name}
          </h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-line bg-white p-5 text-sm leading-7 text-muted">
              <p><strong className="text-foreground">Serviço:</strong> {appointment.service.name}</p>
              <p><strong className="text-foreground">Profissional:</strong> {appointment.professional.name}</p>
              <p><strong className="text-foreground">Data atual:</strong> {formatDateTime(appointment.startAt)}</p>
              <p><strong className="text-foreground">Estado:</strong> {appointment.status}</p>
            </div>
            <div className="rounded-[1.5rem] border border-line bg-white p-5 text-sm leading-7 text-muted">
              <p><strong className="text-foreground">Email:</strong> {appointment.customer.email}</p>
              <p><strong className="text-foreground">Telefone:</strong> {appointment.customer.phone}</p>
              <p><strong className="text-foreground">Notas:</strong> {appointment.clientNotes || "Sem observações."}</p>
            </div>
          </div>
        </div>

        {query.status === "canceled" ? (
          <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            A marcação foi cancelada com sucesso.
          </p>
        ) : null}

        {query.status === "rescheduled" ? (
          <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            A marcação foi reagendada com sucesso.
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <ManageBookingForm
            serviceId={appointment.serviceId}
            professionalId={appointment.professionalId}
            action={boundReschedule}
          />

          <form
            action={async () => {
              "use server";
              await cancelAppointmentByToken(token);
            }}
            className="section-card rounded-[1.75rem] p-6"
          >
            <p className="text-lg font-semibold text-foreground">Cancelar marcação</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Se não puder comparecer, pode cancelar a sua marcação aqui para libertar o horário.
            </p>
            <button type="submit" className="mt-6 rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">
              Cancelar marcação
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}