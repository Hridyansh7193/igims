/**
 * Official Cerebrexia '26 Default Group Promo Code
 * Group Offer:
 * - 10 to 19 members: 1 Member Free (pay for N-1)
 * - 20 to 29 members: 2 Members Free (pay for N-2)
 * - Scales by 1 free member per 10 people (e.g., 30 = 3 free, 50 = 5 free)
 */

export const DEFAULT_PROMO_CODE = 'CEREBREXIA26';
export const PRICE_PER_REGISTRATION = 2000;

/**
 * Calculates free member registrations and discount amount based on group size
 * @param {number} groupSize - Total number of people in group
 * @param {number} pricePerPerson - Cost per individual registration (₹2,000)
 * @returns {{ freeMembers: number, discount: number, payableMembers: number }}
 */
export function calculateGroupTierDiscount(groupSize = 1, pricePerPerson = PRICE_PER_REGISTRATION) {
  const count = Number(groupSize) || 0;
  if (count < 10) {
    return { freeMembers: 0, discount: 0, payableMembers: count };
  }

  // 1 free member for every full group of 10 (10 -> 1 free, 15 -> 1 free, 20 -> 2 free, etc.)
  const freeMembers = Math.floor(count / 10);
  const discount = freeMembers * pricePerPerson;
  const payableMembers = Math.max(0, count - freeMembers);

  return { freeMembers, discount, payableMembers };
}

export const PROMO_CODES = {
  CEREBREXIA26: {
    code: 'CEREBREXIA26',
    type: 'group_tier',
    label: "Cerebrexia '26 Default Group Offer",
    description: '10–19 members: 1 Free • 20–29 members: 2 Free • 1 Free per 10 members',
    minMembers: 10,
  },
  // Aliases for convenience
  CEREBREXIA: {
    code: 'CEREBREXIA26',
    type: 'group_tier',
    label: "Cerebrexia '26 Default Group Offer",
    description: '10–19 members: 1 Free • 20–29 members: 2 Free • 1 Free per 10 members',
    minMembers: 10,
  },
  CRX26: {
    code: 'CEREBREXIA26',
    type: 'group_tier',
    label: "Cerebrexia '26 Default Group Offer",
    description: '10–19 members: 1 Free • 20–29 members: 2 Free • 1 Free per 10 members',
    minMembers: 10,
  },
  GROUPDEAL: {
    code: 'CEREBREXIA26',
    type: 'group_tier',
    label: "Cerebrexia '26 Default Group Offer",
    description: '10–19 members: 1 Free • 20–29 members: 2 Free • 1 Free per 10 members',
    minMembers: 10,
  },
  DEFAULT: {
    code: 'CEREBREXIA26',
    type: 'group_tier',
    label: "Cerebrexia '26 Default Group Offer",
    description: '10–19 members: 1 Free • 20–29 members: 2 Free • 1 Free per 10 members',
    minMembers: 10,
  },
};

/**
 * Validates promo code input against group size and subtotal
 * @param {string} inputCode - Code entered by user
 * @param {object} params - { groupSize, subtotal }
 * @returns {object} { valid: boolean, discount: number, freeMembers: number, finalTotal: number, message: string, promo: object|null }
 */
export function validatePromoCode(inputCode, { groupSize = 1, subtotal = 2000 }) {
  if (!inputCode || typeof inputCode !== 'string') {
    return {
      valid: false,
      discount: 0,
      freeMembers: 0,
      finalTotal: subtotal,
      message: 'Please enter a valid promo code.',
      promo: null,
    };
  }

  const clean = inputCode.trim().toUpperCase();
  const promo = PROMO_CODES[clean];

  if (!promo) {
    return {
      valid: false,
      discount: 0,
      freeMembers: 0,
      finalTotal: subtotal,
      message: `Code "${clean}" is not recognized. Use "${DEFAULT_PROMO_CODE}" for default group savings.`,
      promo: null,
    };
  }

  if (promo.type === 'group_tier') {
    if (groupSize < 10) {
      return {
        valid: false,
        discount: 0,
        freeMembers: 0,
        finalTotal: subtotal,
        message: `Code "${clean}" requires a minimum of 10 group members (current: ${groupSize}). Add 10+ members to get 1 free registration!`,
        promo: null,
      };
    }

    const { freeMembers, discount, payableMembers } = calculateGroupTierDiscount(groupSize, PRICE_PER_REGISTRATION);
    const finalTotal = Math.max(0, subtotal - discount);

    return {
      valid: true,
      discount,
      freeMembers,
      finalTotal,
      message: `${promo.label} Applied: ${freeMembers} Free Member${freeMembers > 1 ? 's' : ''}! Paying for ${payableMembers} of ${groupSize} members (Saved ₹${discount.toLocaleString('en-IN')}).`,
      promo,
    };
  }

  // Fallback for percent/flat if ever extended in future
  let discount = 0;
  if (promo.type === 'percent') {
    discount = Math.round((subtotal * promo.value) / 100);
  } else if (promo.type === 'flat') {
    discount = Math.min(subtotal, promo.value);
  }

  const finalTotal = Math.max(0, subtotal - discount);

  return {
    valid: true,
    discount,
    freeMembers: 0,
    finalTotal,
    message: `${promo.label} applied successfully!`,
    promo,
  };
}
