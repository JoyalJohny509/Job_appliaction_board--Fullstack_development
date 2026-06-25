import type { LucideIcon } from "lucide-react";

export function DashboardShell({
  title,
  subtitle,
  navItems,
  children
}: {
  title: string;
  subtitle: string;
  navItems: { label: string; icon: LucideIcon }[];
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border border-line bg-white p-3 shadow-sm">
        <div className="px-2 py-3">
          <p className="eyebrow">Workspace</p>
          <h1 className="mt-2 text-2xl font-black text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-ink/60">{subtitle}</p>
        </div>
        <nav className="mt-3 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={`#${item.label.toLowerCase().replaceAll(" ", "-")}`}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink/70 transition hover:bg-paper hover:text-ink"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
