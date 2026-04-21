"use client";

import { useActionState, useEffect, useState } from "react";
import type { PublicFormState } from "@/app/actions/public";

const initialState: PublicFormState = {};

type ManageBookingFormProps = {
  serviceId: string;
  professionalId: string;
  action: (state: PublicFormState, formData: FormData) => Promise<PublicFormState>;
};

export function ManageBookingForm({ serviceId, professionalId, action }: ManageBookingFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [slots, setSlots] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    if (!date) {
      return;
    }

    fetch(`/api/availability?serviceId=${serviceId}&professionalId=${professionalId}&date=${date}`)
      .then((response) => response.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]));
  }, [date, professionalId, serviceId]);

  return (
    <form action={formAction} className="space-y-4 rounded-[1.75rem] border border-line bg-white p-6">
      <label className="space-y-2 text-sm font-medium text-foreground">
        Nova data
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
          className="w-full rounded-2xl border border-line px-4 py-3 outline-none"
        />
      </label>

      <input type="hidden" name="startTime" value={startTime} />
      <div className="space-y-2 text-sm font-medium text-foreground">
        <p>Novo horário</p>
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

      {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}

      <button type="submit" disabled={pending || !startTime} className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "A reagendar..." : "Reagendar marcação"}
      </button>
    </form>
  );
}
