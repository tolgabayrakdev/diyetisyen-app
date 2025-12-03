import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as Turkish Lira currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: "TRY")
 * @returns Formatted string like "71.150,33 ₺"
 */
export function formatCurrency(amount: number | string, currency: string = "TRY"): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return `0,00 ${currency}`;
  }

  // For Turkish Lira, use dot as thousands separator and comma as decimal separator
  if (currency === "TRY" || currency === "₺") {
    const parts = numAmount.toFixed(2).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Add thousands separator (dot)
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formattedInteger},${decimalPart} ₺`;
  }
  
  // For other currencies, use standard formatting
  return `${numAmount.toFixed(2)} ${currency}`;
}
