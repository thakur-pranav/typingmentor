import { describe, it, expect, vi } from "vitest";
import { TypingEngine } from "../TypingEngine";

describe("TypingEngine", () => {
  it("initializes with countdown timer when timedDurationSeconds is provided for code mode", () => {
    const engine = new TypingEngine({
      mode: "code",
      targetText: "const x = 1;\nconst y = 2;",
      timedDurationSeconds: 30,
    });

    expect(engine.timer.durationSeconds).toBe(30);
    engine.destroy();
  });

  it("accepts space as a newline when typing code", () => {
    const engine = new TypingEngine({
      mode: "code",
      targetText: "int a;\nint b;",
      timedDurationSeconds: 30,
    });

    // Type "int a;" then a space for the newline
    engine.handleInput("int a; ");
    expect(engine.typed).toBe("int a;\n");
    expect(engine.rawIncorrectKeystrokes).toBe(0);
    expect(engine.rawCorrectKeystrokes).toBe(7);

    engine.destroy();
  });

  it("handles multi-line code with indentation and spaces correctly", () => {
    const code = "int fib(int n) {\n  if (n <= 1) return n;\n}";
    const engine = new TypingEngine({
      mode: "code",
      targetText: code,
      timedDurationSeconds: 30,
    });

    // Type line 1
    engine.handleInput("int fib(int n) {");
    expect(engine.rawIncorrectKeystrokes).toBe(0);

    // Type space for newline
    engine.handleInput("int fib(int n) { ");
    expect(engine.typed).toBe("int fib(int n) {\n");
    expect(engine.rawIncorrectKeystrokes).toBe(0);

    // Type two spaces for indentation
    engine.handleInput("int fib(int n) {   ");
    expect(engine.typed).toBe("int fib(int n) {\n  ");
    expect(engine.rawIncorrectKeystrokes).toBe(0);

    // Type "if (n <= 1) return n;"
    engine.handleInput("int fib(int n) {   if (n <= 1) return n;");
    expect(engine.rawIncorrectKeystrokes).toBe(0);
    expect(engine.typed).toBe("int fib(int n) {\n  if (n <= 1) return n;");

    engine.destroy();
  });
});
