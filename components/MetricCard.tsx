import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "mint"
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone?: "mint" | "coral" | "saffron" | "steel";
}) {
  const tones = {
    mint: "bg-mint/10 text-mint",
    coral: "bg-coral/10 text-coral",
    saffron: "bg-saffron/20 text-[#8a5a00]",
    steel: "bg-steel/10 text-steel"
  };

  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink/60">{label}</p>
          <p className="mt-2 text-3xl font-black text-ink">{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-md ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-ink/60">{detail}</p>
    </article>
  );
}
