import { AdminLoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="section-space">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr,0.8fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">Painel de administração</p>
          <h1 className="font-[family-name:var(--font-geist-mono)] text-6xl leading-[0.95] text-foreground">
            Controle total do site, agenda e conteúdos.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted">
            O painel foi preparado para gerir textos, serviços, galerias, profissionais, horários, marcações, testemunhos, FAQ, contactos e configurações gerais do negócio.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
