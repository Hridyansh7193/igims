/**
 * Official Cerebrexia '26 Promo & Rush Deal Codes
 * Configured for Sales, Early Birds, Group Discounts & Flash Deals.
 */

export const PROMO_CODES = {
  RUSH20: {
    code: 'RUSH20',
    type: 'percent',
    value: 20,
    label: '20% Rush Deal Discount',
    description: 'Limited-time rush deal discount on total checkout',
    minMembers: 1,
  },
  RUSH30: {
    code: 'RUSH30',
    type: 'percent',
    value: 30,
    label: '30% Flash Rush Discount',
    description: 'Exclusive 30% off flash rush deal',
    minMembers: 1,
  },
  RUSH50: {
    code: 'RUSH50',
    type: 'percent',
    value: 50,
    label: '50% Mega Rush Deal',
    description: 'Special 50% flash discount',
    minMembers: 1,
  },
  IGIMS50: {
    code: 'IGIMS50',
    type: 'percent',
    value: 50,
    label: '50% IGIMS Host College Deal',
    description: 'Special 50% discount for IGIMS students and delegates',
    minMembers: 1,
  },
  EARLYBIRD: {
    code: 'EARLYBIRD',
    type: 'percent',
    value: 15,
    label: '15% Early Bird Discount',
    description: 'Early bird registration savings',
    minMembers: 1,
  },
  CEREBREXIA: {
    code: 'CEREBREXIA',
    type: 'percent',
    value: 10,
    label: '10% Festival Celebration Code',
    description: 'Official Cerebrexia fest discount',
    minMembers: 1,
  },
  GROUP500: {
    code: 'GROUP500',
    type: 'flat',
    value: 500,
    label: '₹500 Group Basic Registration (BR) Saver',
    description: 'Flat ₹500 discount for groups of 2 or more',
    minMembers: 2,
  },
  GROUP1000: {
    code: 'GROUP1000',
    type: 'flat',
    value: 1000,
    label: '₹1,000 Squad Rush Discount',
    description: 'Flat ₹1,000 off for squads of 4 or more',
    minMembers: 4,
  },
  DELEGATION: {
    code: 'DELEGATION',
    type: 'flat',
    value: 2500,
    label: '₹2,500 College Delegation Saver',
    description: 'Special ₹2,500 off for college groups of 10 or more',
    minMembers: 10,
  },
  MEGA50: {
    code: 'MEGA50',
    type: 'percent',
    value: 35,
    label: '35% Mega Delegation Basic Registration (BR)',
    description: 'Exclusive 35% discount for delegations of 20+ members',
    minMembers: 20,
  },
  FESTIVAL: {
    code: 'FESTIVAL',
    type: 'flat',
    value: 300,
    label: '₹300 Fest Voucher',
    description: 'Flat ₹300 off on total checkout',
    minMembers: 1,
  },
  VIP100: {
    code: 'VIP100',
    type: 'percent',
    value: 100,
    label: '100% Complimentary VIP Basic Registration (BR)',
    description: 'Official Organizing Committee / VIP complimentary Basic Registration (BR)',
    minMembers: 1,
  },
};

/**
 * Validates a promo code string against current checkout parameters
 * @param {string} inputCode - Code entered by user
 * @param {object} params - { groupSize, subtotal }
 * @returns {object} { valid: boolean, discount: number, finalTotal: number, message: string, promo: object|null }
 */
export function validatePromoCode(inputCode, { groupSize = 1, subtotal = 2000 }) {
  if (!inputCode || typeof inputCode !== 'string') {
    return {
      valid: false,
      discount: 0,
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
      finalTotal: subtotal,
      message: `Code "${clean}" is not recognized or has expired.`,
      promo: null,
    };
  }

  if (promo.minMembers && groupSize < promo.minMembers) {
    return {
      valid: false,
      discount: 0,
      finalTotal: subtotal,
      message: `Code "${clean}" requires a minimum of ${promo.minMembers} group members (current: ${groupSize}).`,
      promo: null,
    };
  }

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
    finalTotal,
    message: `${promo.label} applied successfully!`,
    promo,
  };
}

