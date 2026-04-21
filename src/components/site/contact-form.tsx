"use client";

import { useActionState } from "react";
import { submitContactAction, type PublicFormState } from "@/app/actions/public";

const initialState: PublicFormState = {};

export function ContactForm({ consentLabel }: { consentLabel: string }) {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);

  return (
    <form action={formAction} className="section-card space-y-5 rounded-[2rem] p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-foreground">
          Nome
          <input name="name" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Email
          <input name="email" type="email" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Telefone
          <input name="phone" className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Assunto
          <input name="subject" className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Mensagem
        <textarea name="message" required rows={6} className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
      </label>
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4" />
        <span>{consentLabel}</span>
      </label>
      {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "A enviar..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
