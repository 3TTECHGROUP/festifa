import { TEMPLATE_REGISTRY } from '../templates_dir';
import type { Category } from '../templates_dir';
import type { Template as ApiTemplate } from '@/RTK/TemplatesQuery/endpoint';

// Dynamic import map for client-side template modules
const TEMPLATE_MODULES = import.meta.glob('../templates_dir/**/*.{tsx,jsx,ts,js}');

// Local registry item shape
type RegistryItem = {
  id: number;
  dbId: string;
  title: string;
  file: string;
  category: string;
};

// Template summary with optional API-enriched pricing
export type TemplateSummary = {
  id: string; // prefer dbId when available, fallback to local id
  localId: number;
  dbId: string;
  title: string;
  file: string;
  category: Category;
  price?: number;
  currency?: string;
  media_url?: string;
};

const resolveKey = (category: Category, file: string) =>
  `../templates_dir/${category}/${file}`;

/**
 * Load a template module (TSX/JS) for rendering on the client.
 * Accepts either a backend UUID (dbId) or a local numeric id.
 */
export async function getTemplateFile(
  category: Category,
  templateId: string
): Promise<{ default: React.ComponentType<unknown> } | unknown> {
  const templates = TEMPLATE_REGISTRY[category] as unknown as RegistryItem[];

  const template = templates.find(
    (t) => t.dbId === templateId || String(t.id) === String(templateId)
  );

  if (!template) {
    throw new Error(
      `Template "${templateId}" not found in category "${category}"`
    );
  }

  const key = resolveKey(category, template.file);
  let loader = TEMPLATE_MODULES[key];

  // Fallback: sometimes Vite's import.meta.glob key can differ slightly. Try suffix match.
  if (!loader) {
    const altKey = Object.keys(TEMPLATE_MODULES).find((k) =>
      k.endsWith(`/${category}/${template.file}`)
    );
    if (altKey) {
      loader = TEMPLATE_MODULES[altKey];
    }
  }

  if (!loader) {
    throw new Error(`Template file not found: ${key}`);
  }

  return (loader as () => Promise<unknown>)();
}

/**
 * Get all templates in a category.
 * Optionally enrich with pricing/currency from API response.
 */
export function getAllTemplatesInCategory(
  category: Category,
  apiTemplates?: ApiTemplate[]
): TemplateSummary[] {
  const registry = (TEMPLATE_REGISTRY[category] as unknown as RegistryItem[]) || [];

  // Build lookup map from API templates by id
  const apiById = new Map<string, ApiTemplate>();
  if (Array.isArray(apiTemplates)) {
    for (const t of apiTemplates) {
      apiById.set(String(t.id), t);
    }
  }

  return registry.map((r) => {
    const api = r.dbId ? apiById.get(r.dbId) : undefined;

    // Extract price from first prices entry (backend localizes currency)
    const priceObj = api?.prices?.[0] as Record<string, unknown> | undefined;
    const amount =
      typeof priceObj?.amount === 'number'
        ? priceObj.amount
        : typeof priceObj?.price === 'number'
        ? priceObj.price
        : undefined;
    const currency = (priceObj?.currency as string) || undefined;

    return {
      id: r.dbId || String(r.id),
      localId: r.id,
      dbId: r.dbId,
      title: r.title,
      file: r.file,
      category,
      price: amount,
      currency,
      media_url: api?.media_url,
    };
  });
}

/**
 * Get all available categories.
 */
export function getCategories(): Category[] {
  return Object.keys(TEMPLATE_REGISTRY) as Category[];
}

/**
 * Extract price and currency from an API template.
 * Returns { amount, currency, displayPrice } for easy rendering.
 */
export function getTemplatePrice(template: ApiTemplate): {
  amount: number;
  currency: string;
  displayPrice: string;
  isFree: boolean;
} {
  const priceObj = template.prices?.[0];
  
  // Handle amount as string or number
  const rawAmount = priceObj?.amount ?? priceObj?.price ?? priceObj?.value ?? 0;
  const amount = typeof rawAmount === 'string' ? parseFloat(rawAmount) : rawAmount;

  const currency = priceObj?.currency || 'USD';

  const symbols: Record<string, string> = {
    USD: '$',
    NGN: '₦',
    EUR: '€',
    GBP: '£',
  };
  const symbol = symbols[currency] || currency;
  const isFree = amount === 0 || isNaN(amount);
  const displayPrice = isFree ? 'Free' : `${symbol}${amount.toLocaleString()}`;

  return { amount, currency, displayPrice, isFree };
}

/**
 * Map API templates to TemplateSummary format (without local registry).
 * Use this when displaying API templates directly.
 */
export function mapApiTemplatesToSummary(
  apiTemplates: ApiTemplate[]
): TemplateSummary[] {
  return apiTemplates.map((t) => {
    const { amount, currency } = getTemplatePrice(t);
    return {
      id: t.id,
      localId: 0,
      dbId: t.id,
      title: t.title,
      file: '',
      category: (t.category?.toLowerCase() || 'wedding') as Category,
      price: amount,
      currency,
      media_url: t.media_url,
    };
  });
}