/**
 * Formats a typing passage according to the punctuation flag.
 *
 * - hasPunctuation = true: Preserves original capitalization and all punctuation marks.
 * - hasPunctuation = false: Converts all text to lowercase and strips all punctuation marks and symbols.
 *
 * @param {string} text - The raw passage or custom practice text
 * @param {boolean} [hasPunctuation=true] - Punctuation flag state
 * @returns {string} Formatted text for typing
 */
export function formatPassageText(text, hasPunctuation = true) {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (hasPunctuation) {
    return text.trim();
  }

  return text
    .toLowerCase()
    // Replace em-dashes, en-dashes, and hyphens with spaces so hyphenated words remain separate
    .replace(/[—–\-]/g, " ")
    // Remove all punctuation marks, quotes, brackets, and symbols (\p{L} letters, \p{N} numbers, \s whitespace)
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    // Normalize multiple whitespace characters into single spaces
    .replace(/\s+/g, " ")
    .trim();
}
