import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup.js";
import { createApp } from "../app.js";
import { UserModel } from "../modules/users/user.model.js";
import { signAccessToken } from "../modules/auth/token.service.js";

const app = createApp();

async function createTestUser({ username, email, isEmailVerified = true }) {
  const user = await UserModel.create({
    username,
    email: email.toLowerCase(),
    isEmailVerified,
  });
  const token = signAccessToken({ userId: String(user._id), email: user.email });
  return { user, token };
}

describe("Feedback Module (Verified Users Only)", () => {
  const validPayload = {
    name: "Alex Typist",
    category: "suggestion",
    subject: "Add mechanical switch sound effects",
    message: "It would be amazing to hear Cherry MX Blue clicks while typing!",
  };

  it("rejects unauthenticated feedback submission with 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send(validPayload);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("rejects unverified email account with 403 EMAIL_NOT_VERIFIED", async () => {
    const { token } = await createTestUser({
      username: "unverified_user",
      email: "unverified@example.com",
      isEmailVerified: false,
    });

    const res = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token}`)
      .send(validPayload);

    expect(res.status).toBe(403);
    expect(res.body.code).toBe("EMAIL_NOT_VERIFIED");
    expect(res.body.message).toMatch(/Please verify your email address/);
  });

  it("successfully accepts feedback submission for verified user", async () => {
    const { token, user } = await createTestUser({
      username: "verified_alex",
      email: "alex.verified@example.com",
      isEmailVerified: true,
    });

    const res = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", "203.0.113.1")
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Alex Typist");
    expect(res.body.data.email).toBe(user.email);
    expect(res.body.data.category).toBe("suggestion");
    expect(res.body.data.id).toBeDefined();
  });

  it("blocks rapid submission by same user with 429 cooldown", async () => {
    const { token } = await createTestUser({
      username: "rapid_user",
      email: "rapid.user@example.com",
      isEmailVerified: true,
    });

    // First submission
    const res1 = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", "203.0.113.2")
      .send(validPayload);
    expect(res1.status).toBe(201);

    // Immediate second submission by same user
    const res2 = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", "203.0.113.99") // different IP, same user
      .send({
        ...validPayload,
        subject: "Another quick thought",
        message: "Here is another suggestion right away.",
      });

    expect(res2.status).toBe(429);
    expect(res2.body.code).toBe("FEEDBACK_COOLDOWN_ACTIVE");
    expect(res2.body.message).toMatch(/Please wait \d+(m \d+s|s) before submitting another feedback request/);
  });

  it("blocks rapid submission by IP with 429 cooldown", async () => {
    const clientIp = "198.51.100.42";

    const { token: token1 } = await createTestUser({
      username: "ip_user1",
      email: "ip_user1@example.com",
      isEmailVerified: true,
    });

    const { token: token2 } = await createTestUser({
      username: "ip_user2",
      email: "ip_user2@example.com",
      isEmailVerified: true,
    });

    // First submission
    const res1 = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token1}`)
      .set("X-Forwarded-For", clientIp)
      .send(validPayload);
    expect(res1.status).toBe(201);

    // Second submission by different user from the same IP
    const res2 = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token2}`)
      .set("X-Forwarded-For", clientIp)
      .send({
        ...validPayload,
        subject: "Different user on same IP",
      });

    expect(res2.status).toBe(429);
    expect(res2.body.code).toBe("FEEDBACK_COOLDOWN_ACTIVE");
  });

  it("rejects invalid input with 400 Bad Request", async () => {
    const { token } = await createTestUser({
      username: "bad_input_user",
      email: "bad_input@example.com",
      isEmailVerified: true,
    });

    const res = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "A", // too short (< 2)
        category: "invalid_category",
        subject: "hi",
        message: "short",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("checks cooldown status via GET /api/feedback/cooldown with auth", async () => {
    const clientIp = "198.51.100.88";
    const { token } = await createTestUser({
      username: "status_user",
      email: "status.user@example.com",
      isEmailVerified: true,
    });

    // Before submitting
    const check1 = await request(app)
      .get("/api/feedback/cooldown")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", clientIp);

    expect(check1.status).toBe(200);
    expect(check1.body.data.canSubmit).toBe(true);
    expect(check1.body.data.remainingSeconds).toBe(0);

    // Submit
    await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", clientIp)
      .send(validPayload);

    // Check immediately after
    const check2 = await request(app)
      .get("/api/feedback/cooldown")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", clientIp);

    expect(check2.status).toBe(200);
    expect(check2.body.data.canSubmit).toBe(false);
    expect(check2.body.data.remainingSeconds).toBeGreaterThan(800);
  });
});

