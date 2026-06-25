export function LogoBadge({ label, size = "md" }: { label: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg"
  };

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-md bg-ink font-black text-white shadow-sm ${sizes[size]}`}
      aria-label={label}
    >
      {label}
    </span>
  );
}
