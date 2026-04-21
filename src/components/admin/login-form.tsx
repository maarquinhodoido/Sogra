"use client";

import { useActionState } from "react";
import { loginAdminAction, type AdminActionState } from "@/app/actions/admin";

const initialState: AdminActionState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  return (
    <form action={formAction} className="section-card space-y-5 rounded-[2rem] p-8">
      <label className="space-y-2 text-sm font-medium text-foreground">
        Email
        <input name="email" type="email" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Password
        <input name="password" type="password" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none" />
      </label>
      {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "A entrar..." : "Entrar no painel"}
      </button>
    </form>
  );
}
