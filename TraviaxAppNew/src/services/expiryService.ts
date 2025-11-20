/**
 * Service to handle app expiry logic
 */

// Expiry date: November 21, 2024 at 1:00 PM (13:00)
const EXPIRY_DATE = new Date('2025-11-21T18:15:00');

/**
 * Check if the app has expired
 * @returns {boolean} true if the app has expired, false otherwise
 */
export const isAppExpired = (): boolean => {
  const currentDate = new Date();
  return currentDate >= EXPIRY_DATE;
};

/**
 * Get the expiry date
 * @returns {Date} The expiry date
 */
export const getExpiryDate = (): Date => {
  return EXPIRY_DATE;
};

/**
 * Get formatted expiry date string
 * @returns {string} Formatted expiry date
 */
export const getFormattedExpiryDate = (): string => {
  return EXPIRY_DATE.toLocaleString();
};
