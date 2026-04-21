"use client";

import { useActionState, useEffect, useState } from "react";
import { submitAppointmentAction, type PublicFormState } from "@/app/actions/public";
import type { ProfessionalData, ServiceData } from "@/lib/demo-data";

const initialState: PublicFormState = {};

type BookingFormProps = {
  services: ServiceData[];
  professionals: ProfessionalData[];
  consentLabel: string;
};

export function BookingForm({ services, professionals, consentLabel }: BookingFormProps) {
  const [state, formAction, pending] = useActionState(submitAppointmentAction, initialState);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [slots, setSlots] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    if (!serviceId || !professionalId || !date) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/availability?serviceId=${serviceId}&professionalId=${professionalId}&date=${date}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        setSlots(data.slots ?? []);
      })
      .catch(() => {
        setSlots([]);
      });

    return () => controller.abort();
  }, [date, professionalId, serviceId]);

  return (
    <form action={formAction} className="section-card space-y-6 rounded-[2rem] p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-foreground">
          Serviço
          <select
            name="serviceId"
            value={serviceId}
            onChange={(event) => {
              setServiceId(event.target.value);
              setSlots([]);
              setStartTime("");
            }}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-foreground">
          Profissional
          <select
            name="professionalId"
            value={professionalId}
            onChange={(event) => {
              setProfessionalId(event.target.value);
              setSlots([]);
              setStartTime("");
            }}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none"
          >
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-foreground">
          Data
          <input
            name="date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setSlots([]);
              setStartTime("");
            }}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none"
          />
        </label>

        <div className="space-y-2 text-sm font-medium text-foreground">
          <p>Hora disponível</p>
          <input type="hidden" name="startTime" value={startTime} />
          <div className="rounded-2xl border border-line bg-white p-4">
            {!slots.length ? (
              <p className="text-sm text-muted">Selecione serviço, profissional e data para ver horários.</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setStartTime(slot.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    startTime === slot.value
                      ? "bg-foreground text-white"
                      : "border border-line bg-surface text-muted"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="space-y-2 text-sm font-medium text-foreground">
          Nome
          <input name="name" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Telefone
          <input name="phone" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Email
          <input name="email" type="email" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-foreground">
        Observações
        <textarea name="notes" rows={5} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
      </label>

      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4" />
        <span>{consentLabel}</span>
      </label>

      {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}

      <button type="submit" disabled={pending || !startTime} className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "A confirmar..." : "Confirmar marcação"}
      </button>
    </form>
  );
}
