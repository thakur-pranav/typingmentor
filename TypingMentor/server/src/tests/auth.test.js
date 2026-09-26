import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup.js";
import { createApp } from "../app.js";

const app = createApp();

describe("Auth", () => {
  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "alice",
      email: "alice@example.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("alice@example.com");
  });

  it("rejects duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send({
      username: "alice",
      email: "alice@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/register").send({
      username: "alice2",
      email: "alice@example.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      username: "bob",
      email: "bob@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "bob@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      username: "carol",
      email: "carol@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "carol@example.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("rejects protected route access without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("verifies user email with valid token", async () => {
    const { UserModel } = await import("../modules/users/user.model.js");
    const user = await UserModel.create({
      username: "dave",
      email: "dave@example.com",
      passwordHash: "dummyhash",
      isEmailVerified: false,
      emailVerificationToken: "test-valid-token-123",
      emailVerificationExpires: new Date(Date.now() + 60000),
    });

    const res = await request(app).post("/api/auth/verify-email").send({
      token: "test-valid-token-123",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user.isEmailVerified).toBe(true);
    expect(res.body.data.token).toBeDefined();

    const updated = await UserModel.findById(user._id);
    expect(updated.isEmailVerified).toBe(true);
  });

  it("rejects email verification with invalid token", async () => {
    const res = await request(app).post("/api/auth/verify-email").send({
      token: "non-existent-token",
    });
    expect(res.status).toBe(400);
  });

  it("resends verification email for existing unverified user", async () => {
    const { UserModel } = await import("../modules/users/user.model.js");
    await UserModel.create({
      username: "eve",
      email: "eve@example.com",
      passwordHash: "dummyhash",
      isEmailVerified: false,
    });

    const res = await request(app).post("/api/auth/resend-verification").send({
      email: "eve@example.com",
    });
    expect(res.status).toBe(200);
  });
});
