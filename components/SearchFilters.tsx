import { Search } from "lucide-react";
import { WORK_MODE_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from "@/lib/enum-labels";

export function SearchFilters({
  defaults,
  categories
}: {
  defaults: Record<string, string | string[] | undefined>;
  categories: { id: string; name: string }[];
}) {
  const value = (key: string) => {
    const input = defaults[key];
    return Array.isArray(input) ? input[0] ?? "" : input ?? "";
  };

  return (
    <form className="panel grid gap-3 p-4 lg:grid-cols-[1.4fr_1fr_1fr_auto]" action="/jobs">
      <label className="sr-only" htmlFor="keyword">
        Keyword
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          id="keyword"
          name="keyword"
          defaultValue={value("keyword")}
          className="field pl-9"
          placeholder="Job title, skill, company"
        />
      </div>
      <input name="location" defaultValue={value("location")} className="field" placeholder="Location" />
      <select name="category" defaultValue={value("category")} className="field">
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <button className="button-primary" type="submit">
        Search
      </button>

      <div className="grid gap-3 border-t border-line pt-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-5">
        <select name="workMode" defaultValue={value("workMode")} className="field">
          <option value="">Any work mode</option>
          {WORK_MODE_OPTIONS.map(([val, label]) => (
            <option key={val} value={label}>
              {label}
            </option>
          ))}
        </select>
        <select name="employmentType" defaultValue={value("employmentType")} className="field">
          <option value="">Any employment</option>
          {EMPLOYMENT_TYPE_OPTIONS.map(([val, label]) => (
            <option key={val} value={label}>
              {label}
            </option>
          ))}
        </select>
        <select name="level" defaultValue={value("level")} className="field">
          <option value="">Any level</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Mid Level">Mid Level</option>
          <option value="Senior">Senior</option>
        </select>
        <select name="salary" defaultValue={value("salary")} className="field">
          <option value="">Any salary</option>
          <option value="50000">$50k+</option>
          <option value="75000">$75k+</option>
          <option value="100000">$100k+</option>
        </select>
        <input name="company" defaultValue={value("company")} className="field" placeholder="Company" />
      </div>
    </form>
  );
}
