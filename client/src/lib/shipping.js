/**
 * Shipping Cost Calculation Utility
 *
 * This module handles weight-based and state-based shipping cost calculations
 * for the e-commerce platform.
 */

import { firebaseService } from "./firebaseService";

// Cache for shipping rates to avoid repeated Firestore reads
let cachedRates = null;
let lastFetch = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Default shipping rates structure (fallback if Firestore data not available)
 *
 * Structure:
 * {
 *   default: {
 *     tiers: [
 *       { maxWeightKg: 1, charge: 150 },
 *       { maxWeightKg: 5, charge: 250 },
 *       { maxWeightKg: 10, charge: 400 },
 *       { maxWeightKg: null, charge: 600 } // null means unlimited weight
 *     ]
 *   },
 *   states: {
 *     "Tamil Nadu": {
 *       tiers: [
 *         { maxWeightKg: 1, charge: 100 },
 *         { maxWeightKg: 5, charge: 200 },
 *         { maxWeightKg: 10, charge: 350 },
 *         { maxWeightKg: null, charge: 500 }
 *       ]
 *     },
 *     "Karnataka": { ... },
 *     ...
 *   }
 * }
 */
const DEFAULT_SHIPPING_RATES = {
  default: {
    tiers: [
      { maxWeightKg: 1, charge: 200 },
      { maxWeightKg: 2, charge: 300 },
      { maxWeightKg: 3, charge: 400 },
      { maxWeightKg: 4, charge: 500 },
      { maxWeightKg: 5, charge: 600 },
      { maxWeightKg: 6, charge: 700 },
      { maxWeightKg: 7, charge: 800 },
      { maxWeightKg: 8, charge: 900 },
      { maxWeightKg: 9, charge: 1000 },
      { maxWeightKg: 10, charge: 1100 },
      { maxWeightKg: null, charge: 1500 }, // above 10 kg
    ],
  },
  states: {
    "Andhra Pradesh": {},
    "Arunachal Pradesh": {},
    Assam: {},
    Bihar: {},
    Chhattisgarh: {},
    Goa: {},
    Gujarat: {},
    Haryana: {},
    "Himachal Pradesh": {},
    Jharkhand: {},
    Karnataka: {},
    Kerala: {},
    "Madhya Pradesh": {},
    Maharashtra: {},
    Manipur: {},
    Meghalaya: {},
    Mizoram: {},
    Nagaland: {},
    Odisha: {},
    Punjab: {},
    Rajasthan: {},
    Sikkim: {},
    "Tamil Nadu": {},
    Telangana: {},
    Tripura: {},
    "Uttar Pradesh": {},
    Uttarakhand: {},
    "West Bengal": {},
    // Union Territories
    "Andaman and Nicobar Islands": {},
    Chandigarh: {},
    "Dadra and Nagar Haveli and Daman and Diu": {},
    Delhi: {},
    "Jammu and Kashmir": {},
    Ladakh: {},
    Lakshadweep: {},
    Puducherry: {},
  },
};

// Add same tier pattern for every state and union territory
const tierTemplate = [
  { maxWeightKg: 1, charge: 200 },
  { maxWeightKg: 2, charge: 300 },
  { maxWeightKg: 3, charge: 400 },
  { maxWeightKg: 4, charge: 500 },
  { maxWeightKg: 5, charge: 600 },
  { maxWeightKg: 6, charge: 700 },
  { maxWeightKg: 7, charge: 800 },
  { maxWeightKg: 8, charge: 900 },
  { maxWeightKg: 9, charge: 1000 },
  { maxWeightKg: 10, charge: 1100 },
  { maxWeightKg: null, charge: 1500 },
];

// Automatically assign the tierTemplate to all states and UTs
Object.keys(DEFAULT_SHIPPING_RATES.states).forEach(
  (state) => (DEFAULT_SHIPPING_RATES.states[state].tiers = tierTemplate),
);

/**
 * Fetch shipping rates from Firestore (or use default)
 * Results are cached to minimize Firestore reads
 */
async function getShippingRates() {
  const now = Date.now();

  if (cachedRates && lastFetch && now - lastFetch < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await firebaseService.getShippingRates();

    if (response.success && response.data) {
      cachedRates = response.data;
      lastFetch = now;
      return cachedRates;
    }
  } catch (error) {
    console.warn(
      "⚠️ Failed to fetch shipping rates from Firestore. Using defaults.",
      error,
    );
  }

  cachedRates = DEFAULT_SHIPPING_RATES;
  lastFetch = now;
  return cachedRates;
}

/**
 * Dynamic shipping cost calculation:
 *
 * 1 kg = ₹200
 * +₹100 per additional kg up to 10 kg
 * Above 10 kg → repeat the 1–10 kg pattern
 *
 * Example:
 *  - 1 kg → ₹200
 *  - 10 kg → ₹1100
 *  - 15 kg → (₹1100 + ₹600) = ₹1700
 *  - 25 kg → (2×₹1100 + ₹600) = ₹2800
 */
function calculateDynamicShipping(weightKg) {
  const base = 200; // ₹200 for the first kg
  const step = 100; // +₹100 for each additional kg
  const block = 10; // repeating pattern every 10 kg

  if (weightKg <= 0) return 0;

  const blockCost = base + (block - 1) * step; // ₹1100 for a 10 kg block
  const fullBlocks = Math.floor(weightKg / block);
  const remainder = weightKg % block;

  const remainderCost = remainder > 0 ? base + (remainder - 1) * step : 0;
  const totalCost = fullBlocks * blockCost + remainderCost;

  return totalCost;
}

/**
 * Calculate shipping cost for a single product
 * Attempts to use Firestore tiers, falls back to dynamic rule.
 */
export async function calculateProductShippingCost(weightKg, state) {
  if (!weightKg || weightKg <= 0) return 0;

  const rates = await getShippingRates();
  const rateSet =
    state && rates.states && rates.states[state]
      ? rates.states[state]
      : rates.default;

  // ✅ If Firestore tiers exist, use them
  if (rateSet?.tiers?.length) {
    for (const tier of rateSet.tiers) {
      if (tier.maxWeightKg === null || weightKg <= tier.maxWeightKg) {
        return tier.charge;
      }
    }
    return rateSet.tiers[rateSet.tiers.length - 1].charge;
  }

  // 🚀 Otherwise, use dynamic rule
  return calculateDynamicShipping(weightKg);
}

/**
 * Calculate total shipping cost for a cart
 */
export async function calculateCartShippingCost(cartItems, state) {
  if (!cartItems || cartItems.length === 0) return 0;

  let totalShippingCost = 0;

  for (const item of cartItems) {
    const product = item.product || item;
    const quantity = item.quantity || 1;
    const weightPerUnit = parseFloat(product.weight_kg) || 0;

    const costPerUnit = await calculateProductShippingCost(
      weightPerUnit,
      state,
    );
    totalShippingCost += costPerUnit * quantity;
  }

  return totalShippingCost;
}

/**
 * Get shipping rate tiers for a specific state (or default)
 */
export async function getShippingTiers(state) {
  const rates = await getShippingRates();

  const rateSet =
    state && rates.states && rates.states[state]
      ? rates.states[state]
      : rates.default;

  // If no tiers in Firestore, generate dynamic tiers for display
  if (!rateSet?.tiers?.length) {
    const dynamicTiers = [];
    for (let i = 1; i <= 10; i++) {
      dynamicTiers.push({
        maxWeightKg: i,
        charge: calculateDynamicShipping(i),
      });
    }
    dynamicTiers.push({
      maxWeightKg: null,
      charge: calculateDynamicShipping(11),
    });
    return dynamicTiers;
  }

  return rateSet.tiers;
}

/**
 * Clear the shipping rates cache
 */
export function clearShippingCache() {
  cachedRates = null;
  lastFetch = null;
}

/**
 * Format shipping cost for display
 */
export function formatShippingCost(cost) {
  if (cost === 0) return "FREE";
  return `₹${cost.toFixed(2)}`;
}
