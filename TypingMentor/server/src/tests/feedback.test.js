import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup.js";
import { createApp } from "../app.js";

const app = createApp();

describe("Feedback Module & Cooldown", () => {
  const validFeedback = {
    name: "Alex Typist",
    email: "alex@example.com",
    category: "suggestion",
    subject: "Add mechanical switch sound effects",
    message: "It would be amazing to hear Cherry MX Blue clicks while typing!",
  };

  it("successfully accepts feedback submission", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .set("X-Forwarded-For", "203.0.113.1")
      .send(validFeedback);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Alex Typist");
    expect(res.body.data.category).toBe("suggestion");
    expect(res.body.data.id).toBeDefined();
  });

  it("blocks rapid submission by email with 429 cooldown", async () => {
    // First submission
    const res1 = await request(app)
      .post("/api/feedback")
      .set("X-Forwarded-For", "203.0.113.2")
      .send({
        ...validFeedback,
        email: "cooldown.user@example.com",
      });
    expect(res1.status).toBe(201);

    // Immediate second submission by same email
    const res2 = await request(app)
      .post("/api/feedback")
      .set("X-Forwarded-For", "203.0.113.99") // different IP, same email
      .send({
        ...validFeedback,
        email: "cooldown.user@example.com",
        subject: "Another quick thought",
        message: "Here is another suggestion right away.",
      });

    expect(res2.status).toBe(429);
    expect(res2.body.code).toBe("FEEDBACK_COOLDOWN_ACTIVE");
    expect(res2.body.message).toMatch(/Please wait \d+(m \d+s|s) before submitting another feedback request/);
  });

  it("blocks rapid submission by IP with 429 cooldown", async () => {
    const clientIp = "198.51.100.42";

    // First submission
    const res1 = await request(app)
      .post("/api/feedback")
      .set("X-Forwarded-For", clientIp)
      .send({
        ...validFeedback,
        email: "guest1@example.com",
      });
    expect(res1.status).toBe(201);

    // Second submission by different email from the same IP
    const res2 = await request(app)
      .post("/api/feedback")
      .set("X-Forwarded-For", clientIp)
      .send({
        ...validFeedback,
        email: "guest2@example.com",
        subject: "Different user on same IP",
      });

    expect(res2.status).toBe(429);
    expect(res2.body.code).toBe("FEEDBACK_COOLDOWN_ACTIVE");
  });

  it("rejects invalid input with 400 Bad Request", async () => {
    const res = await request(app).post("/api/feedback").send({
      name: "A", // too short (< 2)
      email: "not-an-email",
      category: "invalid_category",
      subject: "hi",
      message: "short",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("checks cooldown status via GET /api/feedback/cooldown", async () => {
    const email = "status.check@example.com";
    const clientIp = "198.51.100.88";

    // Before submitting
    const check1 = await request(app)
      .get(`/api/feedback/cooldown?email=${email}`)
      .set("X-Forwarded-For", clientIp);

    expect(check1.status).toBe(200);
    expect(check1.body.data.canSubmit).toBe(true);
    expect(check1.body.data.remainingSeconds).toBe(0);

    // Submit
    await request(app)
      .post("/api/feedback")
      .set("X-Forwarded-For", clientIp)
      .send({
        ...validFeedback,
        email,
      });

    // Check immediately after
    const check2 = await request(app)
      .get(`/api/feedback/cooldown?email=${email}`)
      .set("X-Forwarded-For", clientIp);

    expect(check2.status).toBe(200);
    expect(check2.body.data.canSubmit).toBe(false);
    expect(check2.body.data.remainingSeconds).toBeGreaterThan(800);
  });
});
