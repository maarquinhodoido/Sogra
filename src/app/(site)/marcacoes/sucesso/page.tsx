import Link from "next/link";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string; token?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="section-space">
      <div className="container-shell max-w-3xl">
        <div className="section-card rounded-[2.5rem] p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">Marcação registada</p>
          <h1 className="mt-4 font-[family-name:var(--font-geist-mono)] text-5xl text-foreground">
            Obrigada pela sua marcação.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">
            Receberá confirmação por email quando configurado. A sua equipa também pode gerir tudo no painel administrativo.
          </p>
          {params.demo === "1" ? (
            <p className="mt-4 text-sm font-medium text-amber-700">
              A base de dados não estava disponível, por isso a marcação foi apresentada em modo demonstração.
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {params.token ? (
              <Link href={`/marcacoes/gerir/${params.token}`} className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white">
                Gerir marcação
              </Link>
            ) : null}
            <Link href="/" className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-foreground">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
