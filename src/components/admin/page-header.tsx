import Image from "next/image";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2">
        <Image src="/favicon.ico" alt="Administração" width={16} height={16} className="h-4 w-4 rounded-sm" />
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">Administração</p>
      </div>
      <h1 className="mt-3 font-[family-name:var(--font-geist-mono)] text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h1>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p> : null}
    </div>
  );
}
