// Prototype catalog. Must be replaced by the real Seminuevos.com inventory API.
export type BodyType = "Sedán" | "SUV" | "Hatchback" | "Pickup";

export interface Model {
  name: string;
  slug: string;
  type: BodyType;
  popular?: boolean;
  use: string;
}

export interface Brand {
  name: string;
  slug: string;
  models: Model[];
}

const m = (name: string, type: BodyType, use: string, popular = false): Model => ({
  name,
  slug: slugify(name),
  type,
  use,
  popular,
});

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Future programmatic SEO path: /financiamiento/:brand/:model (not implemented yet). */
export function financingPath(brand: string, model?: string) {
  return `/financiamiento/${slugify(brand)}${model ? `/${slugify(model)}` : ""}`;
}

export const BRANDS: Brand[] = [
  { name: "Nissan", models: [m("Versa", "Sedán", "Ciudad y uso diario", true), m("Sentra", "Sedán", "Más espacio y confort", true), m("Kicks", "SUV", "SUV compacta urbana", true), m("March", "Hatchback", "Ágil para ciudad"), m("X-Trail", "SUV", "Familia y carretera"), m("Frontier", "Pickup", "Trabajo y carga")] },
  { name: "Volkswagen", models: [m("Jetta", "Sedán", "Sedán versátil", true), m("Vento", "Sedán", "Uso diario", true), m("Polo", "Hatchback", "Compacto urbano"), m("Taos", "SUV", "SUV familiar"), m("Tiguan", "SUV", "Espacio y carretera"), m("Saveiro", "Pickup", "Carga ligera")] },
  { name: "Chevrolet", models: [m("Aveo", "Sedán", "Uso diario", true), m("Onix", "Sedán", "Ciudad", true), m("Tracker", "SUV", "SUV compacta"), m("Captiva", "SUV", "Familia"), m("Silverado", "Pickup", "Trabajo pesado")] },
  { name: "Toyota", models: [m("Corolla", "Sedán", "Confiable y eficiente", true), m("Yaris", "Sedán", "Ciudad", true), m("RAV4", "SUV", "SUV familiar"), m("Hilux", "Pickup", "Trabajo y aventura"), m("Avanza", "SUV", "Hasta 7 pasajeros")] },
  { name: "Mazda", models: [m("Mazda 3", "Sedán", "Diseño y manejo", true), m("Mazda 2", "Hatchback", "Compacto urbano", true), m("CX-3", "SUV", "SUV urbana"), m("CX-5", "SUV", "Familia y carretera"), m("CX-30", "SUV", "Versátil")] },
  { name: "Kia", models: [m("Rio", "Sedán", "Uso diario", true), m("Forte", "Sedán", "Más espacio"), m("Seltos", "SUV", "SUV compacta", true), m("Sportage", "SUV", "Familia"), m("Soul", "Hatchback", "Ciudad")] },
  { name: "Honda", models: [m("Civic", "Sedán", "Manejo y eficiencia", true), m("City", "Sedán", "Ciudad"), m("HR-V", "SUV", "SUV compacta", true), m("CR-V", "SUV", "Familia")] },
  { name: "Hyundai", models: [m("Grand i10", "Hatchback", "Compacto urbano", true), m("Accent", "Sedán", "Uso diario"), m("Creta", "SUV", "SUV compacta", true), m("Tucson", "SUV", "Familia")] },
  { name: "Ford", models: [m("Figo", "Hatchback", "Ciudad"), m("Escape", "SUV", "Familia", true), m("Territory", "SUV", "SUV versátil"), m("Ranger", "Pickup", "Trabajo y aventura", true), m("Lobo", "Pickup", "Trabajo pesado")] },
  { name: "Suzuki", models: [m("Swift", "Hatchback", "Ágil para ciudad", true), m("Ciaz", "Sedán", "Uso diario"), m("Vitara", "SUV", "SUV compacta"), m("Ertiga", "SUV", "Hasta 7 pasajeros")] },
  { name: "MG", models: [m("MG5", "Sedán", "Uso diario", true), m("ZS", "SUV", "SUV compacta", true), m("HS", "SUV", "Familia")] },
  { name: "Renault", models: [m("Kwid", "Hatchback", "Compacto urbano", true), m("Logan", "Sedán", "Uso diario"), m("Duster", "SUV", "SUV robusta", true), m("Oroch", "Pickup", "Carga ligera")] },
].map((b) => ({ ...b, slug: slugify(b.name) }));

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const PRICE_RANGES = [
  "Hasta $200,000",
  "$200,000 – $300,000",
  "$300,000 – $400,000",
  "$400,000 – $550,000",
  "Más de $550,000",
];

export function getBrand(name: string) {
  return BRANDS.find((b) => b.name === name);
}

/** Popular models first, then the rest alphabetically. */
export function sortedModels(brand?: Brand) {
  if (!brand) return [];
  return [...brand.models].sort(
    (a, b) => Number(!!b.popular) - Number(!!a.popular) || a.name.localeCompare(b.name),
  );
}

export function searchItems<T>(items: T[], q: string, key: (t: T) => string) {
  const n = slugify(q);
  if (!n) return items;
  return items.filter((i) => slugify(key(i)).includes(n));
}

// Conceptual analytics events — GA4 not wired yet.
export type AnalyticsEvent =
  | "financing_brand_model_landing_view"
  | "financing_brand_select"
  | "financing_model_select"
  | "financing_year_select"
  | "financing_price_select"
  | "financing_search_complete"
  | "financing_vehicle_results_view"
  | "financing_vehicle_click"
  | "financing_dealer_contact"
  | "financing_comparison_view"
  | "financing_faq_open";

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  (w.dataLayer ??= []).push({ event, ...params });
}

export interface Listing {
  id: number;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  km: number;
  city: string;
  dealer: string;
  type: BodyType;
}

// Example listings for the prototype only.
export const LISTINGS: Listing[] = [
  { id: 1, brand: "Nissan", model: "Versa", version: "Advance", year: 2022, price: 289000, km: 45000, city: "CDMX", dealer: "Agencia Ejemplo Norte", type: "Sedán" },
  { id: 2, brand: "Nissan", model: "Versa", version: "Sense", year: 2021, price: 249000, km: 70000, city: "Guadalajara", dealer: "Autos Ejemplo GDL", type: "Sedán" },
  { id: 3, brand: "Mazda", model: "Mazda 3", version: "i Grand Touring", year: 2022, price: 365000, km: 38000, city: "Monterrey", dealer: "Dealer Ejemplo MTY", type: "Sedán" },
  { id: 4, brand: "Nissan", model: "Kicks", version: "Exclusive", year: 2023, price: 379000, km: 22000, city: "Puebla", dealer: "Seminuevos Ejemplo", type: "SUV" },
  { id: 5, brand: "Toyota", model: "Hilux", version: "SR", year: 2021, price: 459000, km: 61000, city: "Querétaro", dealer: "Agencia Ejemplo Bajío", type: "Pickup" },
  { id: 6, brand: "Volkswagen", model: "Polo", version: "Comfortline", year: 2020, price: 219000, km: 54000, city: "CDMX", dealer: "Autos Ejemplo Sur", type: "Hatchback" },
  { id: 7, brand: "Kia", model: "Seltos", version: "EX", year: 2022, price: 395000, km: 33000, city: "León", dealer: "Dealer Ejemplo León", type: "SUV" },
  { id: 8, brand: "Honda", model: "Civic", version: "i-Style", year: 2019, price: 299000, km: 82000, city: "Mérida", dealer: "Agencia Ejemplo Sureste", type: "Sedán" },
  { id: 9, brand: "Hyundai", model: "Grand i10", version: "GL MID", year: 2023, price: 209000, km: 18000, city: "Toluca", dealer: "Autos Ejemplo Toluca", type: "Hatchback" },
];

export const mxn = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
