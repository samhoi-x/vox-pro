import { createCreem } from "creem_io";

export const creem = createCreem({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: process.env.NODE_ENV !== "production",
});

// --- Products (create in Creem dashboard first) ---

/** $9.99/month subscription */
export const PRO_MONTHLY_ID = "prod_2U68pglTbt7SworqPvcyuz";

/** $19.99 lifetime purchase + PDF */
export const PRO_LIFETIME_ID = "prod_2irVh0YPj5k66pzbPzuwRH";

/** All paid product IDs — used by webhook to detect paid purchases */
export const PAID_PRODUCT_IDS = new Set([PRO_MONTHLY_ID, PRO_LIFETIME_ID]);

/** Map product → tier */
export function getTierForProduct(productId: string): "pro" | "lifetime" | null {
  if (productId === PRO_MONTHLY_ID) return "pro";
  if (productId === PRO_LIFETIME_ID) return "lifetime";
  return null;
}
