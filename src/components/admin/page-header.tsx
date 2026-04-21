type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">Administração</p>
      <h1 className="mt-3 font-[family-name:var(--font-geist-mono)] text-5xl text-foreground">{title}</h1>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p> : null}
    </div>
  );
}
