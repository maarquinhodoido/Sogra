type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-[family-name:var(--font-geist-mono)] text-4xl leading-none text-foreground md:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-8 text-muted">{description}</p> : null}
    </div>
  );
}
