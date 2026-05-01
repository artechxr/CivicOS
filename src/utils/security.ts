/**
 * Sanitizes input to prevent basic injection attacks by stripping out potential HTML tags.
 * @param input The raw input string
 * @returns The sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Validates the length of the input string to prevent overly long inputs.
 * @param input The input string
 * @param maxLength The maximum allowed length (defaults to 500)
 * @returns True if valid, False otherwise
 */
export function validateLength(input: string, maxLength: number = 500): boolean {
  if (!input) return true;
  return input.length <= maxLength;
}
