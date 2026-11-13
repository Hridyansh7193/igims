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
export const COUPONS_ENABLED = false;

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
 * Active Promo Codes Map (Currently empty to disable all coupons)
 */
export const PROMO_CODES = {};

/**
 * Inactive Promo Codes Catalog (Preserved safely for future reactivation)
 */
export const INACTIVE_PROMO_CODES = {
  RUSH20: {
    code: 'RUSH20',
    type: 'percent',
    value: 20,
    label: '20% Rush Deal Discount',
    description: '20% off on each payable Basic Registration',
  },
  RUSH10: {
    code: 'RUSH10',
    type: 'percent',
    value: 10,
    label: '10% Rush Discount',
    description: '10% off on each payable Basic Registration',
  },
  RUSH30: {
    code: 'RUSH30',
    type: 'percent',
    value: 30,
    label: '30% Flash Rush Discount',
    description: '30% off on each payable Basic Registration',
  },
  RUSH50: {
    code: 'RUSH50',
    type: 'percent',
    value: 50,
    label: '50% Mega Rush Deal',
    description: '50% off on each payable Basic Registration',
  },
  CEREBREXIA: {
    code: 'CEREBREXIA',
    type: 'percent',
    value: 10,
    label: '10% Festival Celebration Code',
    description: '10% off on each payable Basic Registration',
  },
  CEREBREXIA26: {
    code: 'CEREBREXIA26',
    type: 'percent',
    value: 10,
    label: "10% Cerebrexia '26 Fest Code",
    description: '10% off on each payable Basic Registration',
  },
  CRX26: {
    code: 'CRX26',
    type: 'percent',
    value: 10,
    label: '10% CRX26 Voucher',
    description: '10% off on each payable Basic Registration',
  },
  IGIMS50: {
    code: 'IGIMS50',
    type: 'percent',
    value: 50,
    label: '50% IGIMS Host College Deal',
    description: '50% off on each payable Basic Registration',
  },
  EARLYBIRD: {
    code: 'EARLYBIRD',
    type: 'percent',
    value: 15,
    label: '15% Early Bird Discount',
    description: '15% off on each payable Basic Registration',
  },
  SAVE200: {
    code: 'SAVE200',
    type: 'per_br',
    value: 200,
    label: '₹200 Off Per BR',
    description: 'Flat ₹200 off on each payable Basic Registration',
  },
  SAVE500: {
    code: 'SAVE500',
    type: 'per_br',
    value: 500,
    label: '₹500 Off Per BR',
    description: 'Flat ₹500 off on each payable Basic Registration',
  },
  FESTIVAL: {
    code: 'FESTIVAL',
    type: 'flat',
    value: 500,
    label: '₹500 Fest Voucher',
    description: 'Flat ₹500 off on total checkout',
  },
  VIP100: {
    code: 'VIP100',
    type: 'percent',
    value: 100,
    label: '100% Complimentary VIP BR',
    description: '100% complimentary VIP registration',
  },
};

/**
 * Validates a coupon code against payable members and payable subtotal
 * (Currently returns invalid as coupons are disabled)
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
    message: 'Coupon codes are currently inactive.',
    promo: null,
  };
}
