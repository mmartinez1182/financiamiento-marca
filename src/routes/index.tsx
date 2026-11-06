import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Check, X, MapPin, Gauge, Calendar, Search, ChevronDown, Menu } from "lucide-react";
import { SearchPicker } from "@/components/landing/SearchPicker";
import {
  BRANDS, YEARS, PRICE_RANGES, LISTINGS, getBrand, sortedModels, track, mxn, financingPath,
  type BodyType,
} from "@/lib/vehicles";
import sedan from "@/assets/car-sedan.jpg";
import suv from "@/assets/car-suv.jpg";
import pickup from "@/assets/car-pickup.jpg";
import hatch from "@/assets/car-hatch.jpg";

const IMG: Record<BodyType, string> = { Sedán: sedan, SUV: suv, Pickup: pickup, Hatchback: hatch };

const FAQ = [
  ["¿Las condiciones cambian según la marca?", "Pueden cambiar dependiendo de las políticas de la institución, dealer, vehículo y otros factores."],
  ["¿El modelo puede influir?", "Sí. Diferentes modelos pueden tener precios y características diferentes."],
  ["¿El año del vehículo importa?", "Puede importar. Algunas instituciones establecen límites de antigüedad para ciertos esquemas."],
  ["¿Dos vehículos del mismo modelo pueden tener condiciones diferentes?", "Sí. El año, versión, precio, kilometraje, vendedor y otras características pueden variar."],
  ["¿Puedo buscar primero por marca y modelo?", "Sí. Puedes explorar el inventario de Seminuevos.com y después consultar con el dealer las opciones disponibles para el vehículo específico."],
  ["¿Seminuevos.com determina las condiciones?", "No. Seminuevos.com es un portal de anuncios. Las condiciones corresponden al dealer, agencia o institución que las ofrece."],
  ["¿Seminuevos.com vende los autos?", "No. Los vehículos son publicados y comercializados por terceros."],
];

const TITLE = "Financiamiento de autos por marca y modelo | Seminuevos.com";
const DESC = "Explora autos por marca, modelo y año, conoce qué factores pueden cambiar las opciones disponibles y encuentra vehículos publicados por agencias y dealers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }),
      },
    ],
  }),
  component: Landing,
});

function Section({ id, eyebrow, title, children, tone = "white" }: { id?: string; eyebrow?: string; title: string; children: ReactNode; tone?: "white" | "surface" }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-20 md:py-28 ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="mx-auto max-w-6xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="max-w-3xl text-3xl font-extrabold text-ink md:text-5xl">{title}</h2>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}

function Landing() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [shown, setShown] = useState(false);
  const brandObj = getBrand(brand);
  const modelObj = brandObj?.models.find((m) => m.name === model);
  const type: BodyType = modelObj?.type ?? "Sedán";

  useEffect(() => track("financing_brand_model_landing_view"), []);

  const chooseBrand = (b: string) => { setBrand(b); setModel(""); setShown(false); track("financing_brand_select", { brand: b }); };
  const chooseModel = (m: string) => { setModel(m); track("financing_model_select", { brand, model: m }); };
  const showOptions = () => {
    setShown(true);
    setTimeout(() => document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const brandOpts = BRANDS.map((b) => ({ value: b.name }));
  const modelOpts = sortedModels(brandObj).map((m) => ({ value: m.name, hint: m.type, group: m.popular ? "Más populares" : "Todos los modelos" }));

  const displayBrand = shown && brand ? brand : "Nissan";
  const displayModel = shown && model ? model : "Versa";

  return (
    <div className="pb-20 md:pb-0">
      <Header />

      {/* HERO */}
      <section className="bg-surface px-5 pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="eyebrow mb-4">Financiamiento · Marca y modelo</p>
            <h1 className="text-4xl font-extrabold leading-[1.05] text-ink md:text-6xl">
              ¿Qué auto estás buscando?
              <span className="mt-3 block text-lg font-semibold leading-snug tracking-normal text-muted-foreground md:text-xl">
                Financiamiento por marca y modelo: encuentra tu auto
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Selecciona una marca y modelo para entender qué debes considerar al explorar opciones de financiamiento.
            </p>
            <div className="mt-8 rounded-3xl bg-card p-5 shadow-card md:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <SearchPicker size="lg" label="Marca" placeholder="Selecciona una marca" value={brand} options={brandOpts} onChange={chooseBrand} />
                <SearchPicker size="lg" label="Modelo" placeholder={brand ? "Selecciona un modelo" : "Primero elige marca"} value={model} options={modelOpts} onChange={chooseModel} disabled={!brand} />
              </div>
              <button type="button" onClick={showOptions} disabled={!brand || !model} className="btn btn-primary mt-5 w-full min-h-14 text-lg">
                Ver opciones <ArrowRight className="size-5" />
              </button>
              <p className="mt-4 text-xs text-muted-foreground">
                Las condiciones disponibles dependen del vehículo, dealer, agencia e institución correspondiente.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-0 rounded-[2.5rem] bg-accent" aria-hidden />
            <img key={type} src={IMG[type]} alt={`Fotografía ilustrativa de un ${type.toLowerCase()} genérico`} width={1280} height={832} className="relative w-full rounded-3xl object-cover animate-in fade-in zoom-in-95 duration-500" />
            <div className="absolute bottom-4 left-4 rounded-full bg-card px-4 py-2 text-sm font-bold shadow-card">
              {modelObj ? `${brand} ${model} · ${type}` : "Imagen ilustrativa"}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTADO PERSONALIZADO */}
      {shown && brand && model && (
        <section id="resultado" className="scroll-mt-20 px-5 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-3">Tu selección</p>
            <h2 className="text-3xl font-extrabold text-ink md:text-5xl">Financiamiento para {brand} {model}</h2>
            <p className="mt-3 text-lg text-muted-foreground">Conoce qué debes revisar si estás buscando este modelo.</p>
            <div className="mt-10 grid overflow-hidden rounded-3xl border bg-card shadow-card md:grid-cols-2">
              <img src={IMG[type]} alt={`${type} ilustrativo`} loading="lazy" width={1280} height={832} className="h-full w-full bg-muted object-cover" />
              <div className="p-7 md:p-10">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{type}</span>
                <h3 className="mt-4 text-3xl font-extrabold text-ink">{brand} {model}</h3>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Años disponibles</p>
                <div className="mt-2 flex flex-wrap gap-2">{YEARS.map((y) => <span key={y} className="rounded-full border px-3 py-1 text-sm font-semibold">{y}</span>)}</div>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Rango de precios</p>
                <p className="mt-1 text-xl font-bold">Dato de ejemplo</p>
                <p className="mt-4 rounded-xl border-l-4 border-teal bg-muted p-3 text-sm">Estos datos deberán conectarse posteriormente al inventario real.</p>
                <a href="#inventario" onClick={() => track("financing_vehicle_results_view", { brand, model, path: financingPath(brand, model) })} className="btn btn-primary mt-6">
                  Ver {brand} {model} disponibles <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* QUÉ PUEDE CAMBIAR */}
      <Section id="que-cambia" eyebrow="¿Qué puede cambiar?" title="El auto que eliges puede cambiar el escenario" tone="surface">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Marca", "Las opciones pueden variar según las políticas de cada institución o dealer."],
            ["Modelo", "El valor y características del modelo pueden influir en las opciones disponibles."],
            ["Año", "Algunas instituciones establecen límites de antigüedad."],
            ["Precio", "El precio influye en el monto que podría ser necesario cubrir o financiar."],
            ["Versión", "Diferentes versiones del mismo modelo pueden tener precios distintos."],
          ].map(([t, d], i) => (
            <article key={t} className="card-hover rounded-3xl bg-card p-6 shadow-card">
              <span className="text-sm font-extrabold text-primary">0{i + 1}</span>
              <h3 className="mt-6 text-2xl font-extrabold text-ink">{t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>
        <p className="mt-12 text-center text-2xl font-extrabold text-ink md:text-4xl">
          Marca <span className="text-primary">+</span> Modelo <span className="text-primary">+</span> Año <span className="text-primary">+</span> Precio <span className="text-primary">=</span> un escenario diferente
        </p>
      </Section>

      <YearComparator brand={displayBrand} model={displayModel} />
      <SameBrand />
      <BuildSearch />
      <CompareGrid />
      <SameModel />
      <BrandExplorer />
      <Inventory />
      <DealerQuestions />
      <Myths />
      <Journey />
      <Faq />

      {/* CTA FINAL */}
      <section className="bg-primary px-5 py-20 text-primary-foreground md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-extrabold md:text-6xl">Elige tu marca.<br />Encuentra tu modelo.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg opacity-90">Explora vehículos publicados por agencias y dealers en Seminuevos.com.</p>
          <a href="#inventario" className="btn btn-inverse mt-8 min-h-14 px-8 text-lg">Buscar autos <Search className="size-5" /></a>
          <p className="mt-6 text-sm opacity-80">Consulta directamente con el dealer las opciones disponibles para el vehículo que te interesa.</p>
        </div>
      </section>

      <footer className="bg-ink px-5 py-12 text-ink-foreground">
        <div className="mx-auto max-w-6xl">
          <Logo inverse />
          <p className="mt-6 max-w-3xl text-sm opacity-75">
            Seminuevos.com es un portal de anuncios. No vende directamente los vehículos ni determina las condiciones de financiamiento, tasas, enganches, mensualidades, plazos o aprobaciones. Las opciones disponibles dependen del vehículo, dealer, agencia o institución correspondiente.
          </p>
          <p className="mt-6 text-xs opacity-50">© {new Date().getFullYear()} Seminuevos.com · Prototipo con datos de ejemplo.</p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        <a href="#inventario" className="btn btn-primary w-full">Buscar autos</a>
      </div>
    </div>
  );
}

function Logo({ inverse }: { inverse?: boolean }) {
  return (
    <a href="#" className={`text-xl font-extrabold tracking-tight ${inverse ? "text-ink-foreground" : "text-ink"}`} aria-label="Seminuevos.com inicio">
      <span className="text-primary">semi</span>nuevos<span className="text-primary">.com</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["#explora", "Busca por marca"], ["#que-cambia", "¿Qué puede cambiar?"], ["#compara", "Compara"], ["#inventario", "Inventario"], ["#faq", "Preguntas frecuentes"]];
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden gap-6 lg:flex" aria-label="Principal">
          {links.map(([h, l]) => <a key={h} href={h} className="text-sm font-semibold text-muted-foreground hover:text-primary">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#inventario" className="btn btn-primary hidden sm:inline-flex">Buscar autos</a>
          <button type="button" className="grid size-11 place-items-center rounded-full lg:hidden" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}><Menu className="size-5" /></button>
        </div>
      </div>
      {open && (
        <nav className="border-t px-5 py-3 lg:hidden animate-in slide-in-from-top-2" aria-label="Móvil">
          {links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)} className="flex min-h-11 items-center font-semibold">{l}</a>)}
        </nav>
      )}
    </header>
  );
}

function YearComparator({ brand, model }: { brand: string; model: string }) {
  const years = [2020, 2021, 2022, 2023, 2024];
  const [year, setYear] = useState(2022);
  const age = new Date().getFullYear() - year;
  const rows: [string, string][] = [
    ["Precio", "Puede variar"],
    ["Antigüedad", `Cambia · ${age} años aprox.`],
    ["Monto requerido", "Puede cambiar"],
    ["Condiciones", "Pueden variar"],
    ["Disponibilidad", "Depende del inventario"],
  ];
  return (
    <Section eyebrow="Comparador de años" title="El mismo modelo puede cambiar según el año">
      <div className="rounded-3xl border bg-card p-6 shadow-card md:p-10">
        <p className="text-sm font-bold text-muted-foreground">{brand} {model}</p>
        <div role="radiogroup" aria-label="Año" className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {years.map((y) => (
            <button key={y} role="radio" aria-checked={y === year} type="button" onClick={() => { setYear(y); track("financing_year_select", { year: y }); }}
              className={`min-h-12 shrink-0 rounded-full px-6 text-lg font-extrabold transition-all ${y === year ? "bg-ink text-ink-foreground scale-105" : "bg-muted hover:bg-accent"}`}>
              {y}
            </button>
          ))}
        </div>
        <div key={year} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {rows.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-surface p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{k}</p>
              <p className="mt-2 font-bold text-ink">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Las condiciones reales deben consultarse directamente con el dealer o institución correspondiente.</p>
      </div>
    </Section>
  );
}

function SameBrand() {
  const models = getBrand("Nissan")!.models.slice(0, 3);
  return (
    <Section eyebrow="Nissan" title="Dentro de una misma marca también hay diferencias" tone="surface">
      <div className="grid gap-5 md:grid-cols-3">
        {models.map((m) => (
          <article key={m.name} className="card-hover overflow-hidden rounded-3xl bg-card shadow-card">
            <img src={IMG[m.type]} alt={`${m.type} ilustrativo`} loading="lazy" width={1280} height={832} className="aspect-[16/10] w-full object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-extrabold text-ink">{m.name}</h3>
              <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Tipo</dt><dd className="font-semibold">{m.type}</dd>
                <dt className="text-muted-foreground">Precio</dt><dd className="font-semibold">Variable</dd>
                <dt className="text-muted-foreground">Año</dt><dd className="font-semibold">Variable</dd>
                <dt className="text-muted-foreground">Uso ideal</dt><dd className="font-semibold">{m.use}</dd>
              </dl>
              <a href="#inventario" className="btn btn-outline mt-5 w-full">Ver disponibles</a>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-8 text-muted-foreground">Cada modelo puede tener diferentes precios y características, por lo que las condiciones disponibles pueden cambiar.</p>
    </Section>
  );
}

function BuildSearch() {
  const [b, setB] = useState("Mazda");
  const [m, setM] = useState("Mazda 3");
  const [y, setY] = useState("2022");
  const [p, setP] = useState("$300,000 – $400,000");
  const complete = b && m && y && p;
  useEffect(() => { if (complete) track("financing_search_complete", { b, m, y, p }); }, [complete, b, m, y, p]);
  return (
    <Section eyebrow="Encuentra tu escenario" title="Construye tu búsqueda">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-4 rounded-3xl border bg-card p-6 shadow-card sm:grid-cols-2">
          <SearchPicker label="Marca" placeholder="Selecciona" value={b} options={BRANDS.map((x) => ({ value: x.name }))} onChange={(v) => { setB(v); setM(""); track("financing_brand_select", { brand: v }); }} />
          <SearchPicker label="Modelo" placeholder="Selecciona" value={m} disabled={!b} options={sortedModels(getBrand(b)).map((x) => ({ value: x.name, hint: x.type }))} onChange={(v) => { setM(v); track("financing_model_select", { model: v }); }} />
          <SearchPicker label="Año" placeholder="Selecciona" value={y} options={YEARS.map((x) => ({ value: String(x) }))} onChange={(v) => { setY(v); track("financing_year_select", { year: v }); }} />
          <SearchPicker label="Rango de precio" placeholder="Selecciona" value={p} options={PRICE_RANGES.map((x) => ({ value: x }))} onChange={(v) => { setP(v); track("financing_price_select", { price: v }); }} />
        </div>
        <div className="flex flex-col rounded-3xl bg-ink p-7 text-ink-foreground">
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">Tu búsqueda</p>
          <h3 className="mt-3 text-3xl font-extrabold">{m || "Modelo"}</h3>
          <p className="mt-1 text-lg opacity-80">{y || "Año"} · {p || "Precio"}</p>
          <p className="mt-6 text-sm opacity-75">Con estos datos podrás explorar vehículos disponibles y consultar directamente las opciones aplicables.</p>
          <a href="#inventario" className={`btn btn-primary mt-auto pt-0 ${complete ? "" : "pointer-events-none opacity-40"}`} style={{ marginTop: "1.5rem" }}>Ver autos disponibles <ArrowRight className="size-4" /></a>
        </div>
      </div>
    </Section>
  );
}

function CompareGrid() {
  useEffect(() => {
    const el = document.getElementById("compara");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { track("financing_comparison_view"); io.disconnect(); } });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const items = [["Enganche", "Cuánto necesitas pagar inicialmente."], ["Mensualidad", "Cuánto pagarías periódicamente."], ["Plazo", "Durante cuánto tiempo realizarías pagos."], ["Tasa", "Uno de los elementos que afecta el costo."], ["CAT", "Indicador útil para comparar opciones."], ["Comisiones", "Pregunta qué cargos adicionales existen."], ["Seguro", "Consulta si es obligatorio y cuánto cuesta."], ["Costo total", "Revisa cuánto terminarías pagando."]];
  return (
    <Section id="compara" eyebrow="¿Qué debes comparar?" title="Cuando ya tienes el auto, compara las condiciones" tone="surface">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map(([t, d]) => (
          <div key={t} className="rounded-2xl bg-card p-5 shadow-card">
            <h3 className="font-extrabold text-ink">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 rounded-3xl bg-card p-7 shadow-card md:grid-cols-[1.2fr_1fr] md:p-10">
        <div>
          <h3 className="text-2xl font-extrabold text-ink md:text-3xl">Compara usando exactamente el mismo vehículo.</h3>
          <p className="mt-3 text-muted-foreground">Si comparas diferentes opciones, mantén iguales estos datos para poder evaluar escenarios equivalentes.</p>
        </div>
        <ul className="flex flex-wrap content-start gap-2">
          {["Marca", "Modelo", "Año", "Precio", "Enganche", "Plazo"].map((x) => (
            <li key={x} className="flex items-center gap-1.5 rounded-full border-2 border-teal px-4 py-2 font-bold"><Check className="size-4 text-teal" />{x}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function SameModel() {
  const cars = [["Auto A", "45,000 km", "Advance"], ["Auto B", "70,000 km", "Sense"]];
  return (
    <Section eyebrow="Modelo popular ≠ mismas condiciones" title="Dos autos del mismo modelo pueden ser diferentes">
      <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
        {cars.map(([n, km, v], i) => (
          <Fragment key={n}>
            {i === 1 && <div className="grid place-items-center text-2xl font-extrabold text-primary">vs</div>}
            <article className="rounded-3xl border bg-card p-7 shadow-card">
              <p className="eyebrow">{n}</p>
              <h3 className="mt-2 text-2xl font-extrabold text-ink">Nissan Versa 2022</h3>
              <dl className="mt-5 space-y-3">
                <div className="flex justify-between border-b pb-3"><dt className="text-muted-foreground">Kilometraje</dt><dd className="font-bold">{km}</dd></div>
                <div className="flex justify-between border-b pb-3"><dt className="text-muted-foreground">Versión</dt><dd className="font-bold">{v}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Precio</dt><dd className="font-bold">$XXX,XXX</dd></div>
              </dl>
            </article>
          </Fragment>
        ))}
      </div>
      <p className="mt-8 text-lg font-semibold text-ink">Aunque sean del mismo modelo y año, la versión, precio, kilometraje, estado y vendedor pueden cambiar.</p>
      <p className="mt-2 text-muted-foreground">Consulta siempre las condiciones del vehículo específico.</p>
    </Section>
  );
}

function BrandExplorer() {
  const [brand, setBrand] = useState("Nissan");
  const models = sortedModels(getBrand(brand));
  return (
    <Section id="explora" eyebrow="¿Qué marca buscas?" title="Explora por marca" tone="surface">
      <div role="radiogroup" aria-label="Marcas" className="flex flex-wrap gap-3">
        {BRANDS.map((b) => (
          <button key={b.name} type="button" role="radio" aria-checked={b.name === brand} onClick={() => { setBrand(b.name); track("financing_brand_select", { brand: b.name }); }}
            className={`min-h-14 rounded-2xl border-2 px-6 text-lg font-extrabold transition-all ${b.name === brand ? "border-primary bg-primary text-primary-foreground shadow-lift" : "border-border bg-card hover:border-ink"}`}>
            {b.name}
          </button>
        ))}
      </div>
      <h3 className="mt-14 text-2xl font-extrabold text-ink md:text-3xl">Modelos {brand}</h3>
      <div key={brand} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {models.map((m) => (
          <article key={m.name} className="card-hover flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card" data-seo-path={financingPath(brand, m.name)}>
            <img src={IMG[m.type]} alt="" loading="lazy" width={1280} height={832} className="size-20 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="text-lg font-extrabold text-ink">{m.name}</h4>
              <p className="text-sm text-muted-foreground">{m.type}{m.popular ? " · Popular" : ""}</p>
            </div>
            <a href="#inventario" className="btn btn-outline px-4 text-sm" aria-label={`Ver autos ${brand} ${m.name}`}>Ver autos</a>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Inventory() {
  const [f, setF] = useState({ brand: "", type: "", year: "", city: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f, v: string) => {
    setF((p) => ({ ...p, [k]: p[k] === v ? "" : v }));
    setLoading(true);
    setTimeout(() => setLoading(false), 450);
  };
  const results = useMemo(() => LISTINGS.filter((l) => (!f.brand || l.brand === f.brand) && (!f.type || l.type === f.type) && (!f.year || String(l.year) === f.year) && (!f.city || l.city === f.city)), [f]);
  const chips = (k: keyof typeof f, vals: string[]) => vals.map((v) => (
    <button key={v} type="button" aria-pressed={f[k] === v} onClick={() => set(k, v)}
      className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold transition-colors ${f[k] === v ? "border-ink bg-ink text-ink-foreground" : "bg-card hover:border-ink"}`}>{v}</button>
  ));
  return (
    <Section id="inventario" eyebrow="Inventario" title="Encuentra el auto específico">
      <p className="-mt-8 mb-8 text-lg text-muted-foreground">Explora vehículos publicados por agencias y dealers en Seminuevos.com.</p>
      <div className="space-y-3">
        {([["Marca", "brand", [...new Set(LISTINGS.map((l) => l.brand))]], ["Tipo", "type", ["Sedán", "SUV", "Hatchback", "Pickup"]], ["Año", "year", YEARS.map(String)], ["Ubicación", "city", [...new Set(LISTINGS.map((l) => l.city))]]] as const).map(([label, k, vals]) => (
          <div key={k} className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
            {chips(k, [...vals])}
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm font-semibold text-muted-foreground" aria-live="polite">{loading ? "Consultando inventario…" : `${results.length} vehículos de ejemplo`}</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border bg-card">
                <div className="aspect-[16/10] animate-pulse bg-muted" />
                <div className="space-y-3 p-5"><div className="h-5 w-2/3 animate-pulse rounded bg-muted" /><div className="h-4 w-1/2 animate-pulse rounded bg-muted" /><div className="h-11 animate-pulse rounded-full bg-muted" /></div>
              </div>
            ))
          : results.map((l) => (
              <article key={l.id} className="card-hover overflow-hidden rounded-3xl border bg-card animate-in fade-in">
                <img src={IMG[l.type]} alt={`${l.brand} ${l.model} ${l.year} (imagen ilustrativa)`} loading="lazy" width={1280} height={832} className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{l.brand}</p>
                  <h3 className="text-xl font-extrabold text-ink">{l.model} <span className="font-semibold text-muted-foreground">{l.version}</span></h3>
                  <p className="mt-2 text-2xl font-extrabold text-primary">{mxn(l.price)}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-1"><Calendar className="size-4" />{l.year}</li>
                    <li className="flex items-center gap-1"><Gauge className="size-4" />{l.km.toLocaleString("es-MX")} km</li>
                    <li className="flex items-center gap-1"><MapPin className="size-4" />{l.city}</li>
                  </ul>
                  <p className="mt-2 text-sm font-semibold">{l.dealer}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" className="btn btn-primary px-3 text-sm" onClick={() => track("financing_vehicle_click", { id: l.id })}>Ver auto</button>
                    <button type="button" className="btn btn-outline px-3 text-sm" onClick={() => track("financing_dealer_contact", { id: l.id })}>Contactar dealer</button>
                  </div>
                </div>
              </article>
            ))}
      </div>
      {!loading && results.length === 0 && <p className="mt-6 rounded-2xl bg-muted p-6 text-center font-semibold">No hay vehículos de ejemplo con esos filtros.</p>}
      <p className="mt-6 text-xs text-muted-foreground">Inventario de ejemplo para el prototipo. Se conectará al inventario real de Seminuevos.com.</p>
    </Section>
  );
}

function DealerQuestions() {
  const qs = ["¿Este vehículo tiene opciones de financiamiento?", "¿Qué enganche necesito?", "¿A qué plazos está disponible?", "¿Cuánto sería el pago mensual?", "¿Cuál es la tasa?", "¿Cuál es el CAT?", "¿Existen comisiones?", "¿Qué seguro necesito?", "¿Existen restricciones por año o modelo?", "¿Cuánto terminaré pagando?"];
  return (
    <Section eyebrow="Qué preguntar al dealer" title="Ya encontraste el auto. Ahora pregunta esto." tone="surface">
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {qs.map((q, i) => (
          <li key={q} className="card-hover rounded-2xl bg-card p-5 shadow-card">
            <span className="text-3xl font-extrabold text-primary">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-3 font-bold text-ink">{q}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Myths() {
  const cards: [string, boolean, string][] = [
    ["Todos los modelos de una marca tienen las mismas condiciones.", false, "Las condiciones pueden cambiar según modelo, año, precio y vehículo específico."],
    ["El año del auto puede influir.", true, "Algunas instituciones establecen límites de antigüedad."],
    ["Dos autos del mismo modelo siempre cuestan lo mismo.", false, "Precio, versión, kilometraje, condición y vendedor pueden cambiar."],
    ["Debo comparar opciones utilizando el mismo auto.", true, "Esto ayuda a realizar una comparación más equivalente."],
    ["Seminuevos.com determina qué marcas reciben financiamiento.", false, "Seminuevos.com es un portal de anuncios."],
  ];
  const [revealed, setRevealed] = useState<number[]>([]);
  return (
    <Section eyebrow="Mito o realidad" title="Marca, modelo y financiamiento: mito o realidad">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(([s, real, a], i) => {
          const r = revealed.includes(i);
          return (
            <button key={s} type="button" aria-expanded={r} onClick={() => setRevealed((p) => (r ? p.filter((x) => x !== i) : [...p, i]))}
              className="card-hover flex min-h-56 flex-col rounded-3xl border bg-card p-6 text-left shadow-card">
              <p className="text-lg font-bold text-ink">“{s}”</p>
              {r ? (
                <div className="mt-auto pt-5 animate-in fade-in slide-in-from-bottom-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-extrabold ${real ? "bg-teal text-primary-foreground" : "bg-primary text-primary-foreground"}`}>
                    {real ? <Check className="size-4" /> : <X className="size-4" />}{real ? "REALIDAD" : "MITO"}
                  </span>
                  <p className="mt-3 text-sm text-muted-foreground">{a}</p>
                </div>
              ) : (
                <span className="mt-auto pt-5 text-sm font-bold text-primary">Toca para ver la respuesta →</span>
              )}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

function Journey() {
  const steps = [["Marca", "Elige la marca que te interesa."], ["Modelo", "Define el modelo dentro de esa marca."], ["Año", "El año puede cambiar el escenario."], ["Precio", "Ubica tu rango de precio."], ["Vehículo", "Encuentra el auto específico."], ["Dealer", "Identifica quién lo publica."], ["Consultar opciones", "Pregunta qué opciones aplican a ese auto."]];
  const [active, setActive] = useState(0);
  return (
    <Section eyebrow="Guía de decisión" title="Del modelo que te gusta al auto que puedes contactar" tone="surface">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <ol className="space-y-2">
          {steps.map(([t], i) => (
            <li key={t}>
              <button type="button" onClick={() => setActive(i)} aria-current={i === active ? "step" : undefined}
                className={`flex min-h-12 w-full items-center gap-4 rounded-2xl px-4 text-left font-extrabold transition-all ${i === active ? "bg-ink text-ink-foreground" : i < active ? "bg-card text-ink" : "bg-card text-muted-foreground hover:text-ink"}`}>
                <span className={`grid size-8 place-items-center rounded-full text-sm ${i <= active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{i < active ? <Check className="size-4" /> : i + 1}</span>
                {t}
              </button>
            </li>
          ))}
        </ol>
        <div key={active} className="flex flex-col justify-center rounded-3xl bg-card p-8 shadow-card animate-in fade-in slide-in-from-right-4 md:p-12">
          <p className="eyebrow">Paso {active + 1} de {steps.length}</p>
          <h3 className="mt-3 text-4xl font-extrabold text-ink">{steps[active]![0]}</h3>
          <p className="mt-4 text-lg text-muted-foreground">{steps[active]![1]}</p>
          <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">Financiamiento por marca y modelo no consiste únicamente en elegir una marca: el vehículo específico importa.</p>
          <div className="mt-6 flex gap-2">
            <button type="button" className="btn btn-outline" disabled={active === 0} onClick={() => setActive(active - 1)}>Anterior</button>
            <button type="button" className="btn btn-primary" disabled={active === steps.length - 1} onClick={() => setActive(active + 1)}>Siguiente</button>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow="FAQ" title="Preguntas frecuentes">
      <div className="divide-y rounded-3xl border bg-card">
        {FAQ.map(([q, a], i) => (
          <div key={q}>
            <h3>
              <button type="button" aria-expanded={open === i} onClick={() => { setOpen(open === i ? null : i); if (open !== i) track("financing_faq_open", { q }); }}
                className="flex min-h-16 w-full items-center justify-between gap-4 px-6 text-left text-lg font-bold text-ink">
                {q}<ChevronDown className={`size-5 shrink-0 transition-transform ${open === i ? "rotate-180 text-primary" : ""}`} />
              </button>
            </h3>
            {open === i && <p className="px-6 pb-6 text-muted-foreground animate-in fade-in">{a}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
