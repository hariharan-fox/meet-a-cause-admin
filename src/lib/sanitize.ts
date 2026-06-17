// src/lib/sanitize.ts
// Input sanitization utility for Meet A Cause
// Use these functions on all user inputs before saving to Firestore

/**
 * Strips HTML tags and trims whitespace
 * Prevents XSS via stored HTML
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')        // Remove HTML tags
    .replace(/&lt;/g, '<')          // Decode common HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/javascript:/gi, '')   // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '')     // Remove event handlers like onclick=
    .trim();
}

/**
 * Sanitizes email — lowercase and trim only
 */
export function sanitizeEmail(input: string): string {
  if (!input) return '';
  return input.toLowerCase().trim();
}

/**
 * Sanitizes a URL — only allows http and https
 */
export function sanitizeUrl(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    return trimmed;
  } catch {
    return '';
  }
}

/**
 * Sanitizes a phone number — digits, spaces, +, - only
 */
export function sanitizePhone(input: string): string {
  if (!input) return '';
  return input.replace(/[^\d\s\+\-\(\)]/g, '').trim();
}

/**
 * Sanitizes a comma-separated list of tags/skills/causes
 */
export function sanitizeTags(input: string): string[] {
  if (!input) return [];
  return input
    .split(',')
    .map(tag => sanitizeText(tag))
    .filter(tag => tag.length > 0 && tag.length < 50)
    .slice(0, 20); // Max 20 tags
}

/**
 * Sanitizes a full name — letters, spaces, hyphens, apostrophes only
 */
export function sanitizeName(input: string): string {
  if (!input) return '';
  return input
    .replace(/[^a-zA-Z\s\-'\.]/g, '')
    .trim()
    .slice(0, 100); // Max 100 chars
}

/**
 * Sanitizes a number input
 */
export function sanitizeNumber(input: string | number, min = 0, max = 10000): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  if (isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
}

/**
 * Sanitizes long text like descriptions, missions etc
 */
export function sanitizeLongText(input: string, maxLength = 2000): string {
  if (!input) return '';
  return sanitizeText(input).slice(0, maxLength);
}
