import { describe, it, expect } from "vitest";
import { formatPassageText } from "../formatPassageText.js";

describe("formatPassageText", () => {
  const sampleWithPunctuation =
    "The quick brown fox jumps over the lazy dog near the old, wooden fence! It's fantastic.";

  it("preserves original text, capitals, and punctuation when hasPunctuation is true", () => {
    const formatted = formatPassageText(sampleWithPunctuation, true);
    expect(formatted).toBe(sampleWithPunctuation);
  });

  it("converts all characters to lowercase and removes punctuation when hasPunctuation is false", () => {
    const formatted = formatPassageText(sampleWithPunctuation, false);
    expect(formatted).toBe(
      "the quick brown fox jumps over the lazy dog near the old wooden fence its fantastic"
    );
  });

  it("splits hyphenated words and dashes into distinct words without hyphens", () => {
    const input = "Scientists discovered a deep-sea fish — extreme temperatures!";
    const formatted = formatPassageText(input, false);
    expect(formatted).toBe(
      "scientists discovered a deep sea fish extreme temperatures"
    );
  });

  it("preserves numeric digits and letters while removing symbols", () => {
    const input = "In 2026, over 99% of computers processed 10,000 requests/sec.";
    const formatted = formatPassageText(input, false);
    expect(formatted).toBe(
      "in 2026 over 99 of computers processed 10000 requestssec"
    );
  });

  it("handles empty or non-string inputs gracefully", () => {
    expect(formatPassageText("", true)).toBe("");
    expect(formatPassageText("", false)).toBe("");
    expect(formatPassageText(null, false)).toBe("");
    expect(formatPassageText(undefined, false)).toBe("");
  });

  it("handles complex quotes, apostrophes, and parentheses", () => {
    const input = '“Wait,” she whispered, (looking behind), “don’t do that; it’s risky!”';
    const formatted = formatPassageText(input, false);
    expect(formatted).toBe("wait she whispered looking behind dont do that its risky");
  });
});
