import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { searchItems } from "@/lib/vehicles";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  options: { value: string; hint?: string; group?: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
  size?: "lg" | "md";
}

/** Searchable select. Bottom sheet on mobile, dropdown panel on desktop. */
export function SearchPicker({ label, placeholder, value, options, onChange, disabled, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = searchItems(options, q, (o) => o.value);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else setQ("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="relative">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${value || placeholder}`}
        className={`flex w-full items-center justify-between rounded-2xl border-2 bg-card px-5 text-left font-bold transition-all hover:border-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border ${size === "lg" ? "min-h-16 text-lg" : "min-h-12 text-base"} ${value ? "border-ink" : "border-border"}`}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground font-semibold"}>{value || placeholder}</span>
        <ChevronDown className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-ink/40 animate-in fade-in md:bg-transparent" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-label={label}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] rounded-t-3xl bg-popover p-4 shadow-card animate-in slide-in-from-bottom md:absolute md:inset-x-0 md:bottom-auto md:top-full md:mt-2 md:max-h-96 md:rounded-2xl md:border md:slide-in-from-top-2"
          >
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-muted px-3">
              <Search className="size-4 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Buscar ${label.toLowerCase()}…`}
                aria-label={`Buscar ${label.toLowerCase()}`}
                className="min-h-11 w-full bg-transparent font-semibold outline-none"
                onKeyDown={(e) => e.key === "Enter" && filtered[0] && pick(filtered[0].value)}
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="grid size-9 place-items-center rounded-full hover:bg-background md:hidden">
                <X className="size-4" />
              </button>
            </div>
            <ul role="listbox" className="max-h-[60vh] overflow-y-auto md:max-h-72">
              {filtered.length === 0 && <li className="p-4 text-sm text-muted-foreground">Sin resultados para “{q}”.</li>}
              {filtered.map((o, i) => (
                <li key={o.value}>
                  {o.group && (i === 0 || filtered[i - 1]?.group !== o.group) && (
                    <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{o.group}</p>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={o.value === value}
                    onClick={() => pick(o.value)}
                    className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left font-semibold hover:bg-accent ${o.value === value ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    {o.value}
                    {o.hint && <span className="text-xs font-medium text-muted-foreground">{o.hint}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
