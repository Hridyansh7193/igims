/**
 * Official Cerebrexia '26 Pricing, Default Group Offer & Coupon System
 *
 * 1. Default Group Offer (Built-in, Active by Default, No Code Required):
 *    - For every 10 members, 1 member is completely FREE (9+1 Offer).
 *    - 10 to 19 members: 1 Free  (Pay for N-1) e.g., 10 pays for 9
 *    - 20 to 29 members: 2 Free  (Pay for N-2) e.g., 20 pays for 18
 *    - 30 to 39 members: 3 Free  (Pay for N-3) e.g., 30 pays for 27
 *    - 40 to 49 members: 4 Free  (Pay for N-4) e.g., 40 pays for 36
 *    - 50 members:       5 Free  (Pay for 45)
 *
 * 2. Coupon Codes:
 *    - Currently DISABLED as requested to prevent unauthorized code usage.
 */

export const PRICE_PER_REGISTRATION = 2000;
export const COUPONS_ENABLED = true;

/**
 * Calculates the built-in default group offer (9+1 offer)
 * @param {number} groupSize - Total number of people in the group
 * @param {number} pricePerPerson - Registration price per person (₹2,000)
 * @returns {{
 *   totalMembers: number,
 *   freeMembers: number,
 *   payableMembers: number,
 *   baseTotal: number,
 *   groupDiscount: number,
 *   groupPayable: number,
 *   pricePerPerson: number
 * }}
 */
export function calculateDefaultGroupOffer(groupSize = 1, pricePerPerson = PRICE_PER_REGISTRATION) {
  const count = Math.max(1, Number(groupSize) || 1);
  const freeMembers = Math.floor(count / 10);
  const payableMembers = Math.max(1, count - freeMembers);
  const baseTotal = count * pricePerPerson;
  const groupDiscount = freeMembers * pricePerPerson;
  const groupPayable = payableMembers * pricePerPerson;

  return {
    totalMembers: count,
    freeMembers,
    payableMembers,
    baseTotal,
    groupDiscount,
    groupPayable,
    pricePerPerson,
  };
}

// Backward compatibility alias
export const calculateGroupTierDiscount = calculateDefaultGroupOffer;

/**
 * Active Built-in Promo Codes Catalog
 * All promo codes are now managed and created exclusively by the admin in the Admin Portal.
 */
export const PROMO_CODES = {};

/**
 * Inactive Promo Codes Catalog
 */
export const INACTIVE_PROMO_CODES = {};

/**
 * Validates a coupon code synchronously.
 * Note: Promo codes are dynamically managed by the admin via Supabase / Admin Portal.
 * Use `validatePromoCodeOnline` in promoService.js to validate codes provided by admin.
 * @param {string} inputCode - Code entered by user
 * @param {object} params - { payableMembers, payableSubtotal, totalMembers }
 * @returns {{
 *   valid: boolean,
 *   couponDiscount: number,
 *   discountPerBR: number,
 *   finalTotal: number,
 *   message: string,
 *   promo: object|null
 * }}
 */
export function validatePromoCode(inputCode, { payableMembers = 1, payableSubtotal = 2000, totalMembers = 1 } = {}) {
  return {
    valid: false,
    couponDiscount: 0,
    discountPerBR: 0,
    finalTotal: payableSubtotal,
    message: 'Invalid or inactive promo code.',
    promo: null,
  };
}
