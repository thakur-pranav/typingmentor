import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import "./setup.js";
import { createApp } from "../app.js";
import { googleAuthService } from "../modules/auth/google.service.js";

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

  it("authenticates via Google using accessToken payload", async () => {
    vi.spyOn(googleAuthService, "verifyGoogleToken").mockResolvedValueOnce({
      googleId: "google-12345",
      email: "googleuser@example.com",
      name: "Google User",
      picture: "https://example.com/avatar.png",
      isEmailVerified: true,
    });

    const res = await request(app).post("/api/auth/google").send({
      accessToken: "mock-valid-access-token",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("googleuser@example.com");
    expect(res.body.data.user.isEmailVerified).toBe(true);
  });

  it("authenticates via Google using credential (idToken) payload", async () => {
    vi.spyOn(googleAuthService, "verifyGoogleToken").mockResolvedValueOnce({
      googleId: "google-67890",
      email: "credentialuser@example.com",
      name: "Credential User",
      picture: "https://example.com/avatar2.png",
      isEmailVerified: true,
    });

    const res = await request(app).post("/api/auth/google").send({
      credential: "mock-valid-id-token",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("credentialuser@example.com");
    expect(res.body.data.user.isEmailVerified).toBe(true);
  });

  it("sets HttpOnly refresh cookie on login and rotates token via /api/auth/refresh", async () => {
    await request(app).post("/api/auth/register").send({
      username: "refresher",
      email: "refresher@example.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "refresher@example.com",
      password: "password123",
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();
    const cookies = loginRes.headers["set-cookie"];
    const refreshCookie = cookies.find((c) => c.startsWith("tm_refresh_token="));
    expect(refreshCookie).toBeDefined();
    expect(refreshCookie).toContain("HttpOnly");

    // Extract cookie value
    const cookieHeader = refreshCookie.split(";")[0];

    // Call /api/auth/refresh with the cookie
    const refreshRes = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookieHeader);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data.token).toBeDefined();
    expect(refreshRes.body.data.user.email).toBe("refresher@example.com");

    // Verify rotated cookie in response
    const newCookies = refreshRes.headers["set-cookie"];
    const newRefreshCookie = newCookies.find((c) => c.startsWith("tm_refresh_token="));
    expect(newRefreshCookie).toBeDefined();
  });

  it("rejects /api/auth/refresh without refresh cookie", async () => {
    const res = await request(app).post("/api/auth/refresh");
    expect(res.status).toBe(401);
  });

  it("clears refresh cookie and revokes session on /api/auth/logout", async () => {
    const regRes = await request(app).post("/api/auth/register").send({
      username: "logoutuser",
      email: "logoutuser@example.com",
      password: "password123",
    });

    const token = regRes.body.data.token;
    const cookies = regRes.headers["set-cookie"];
    const cookieHeader = cookies?.find((c) => c.startsWith("tm_refresh_token="))?.split(";")[0];

    const logoutRes = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(logoutRes.status).toBe(200);
    const logoutCookies = logoutRes.headers["set-cookie"];
    const clearedCookie = logoutCookies.find((c) => c.startsWith("tm_refresh_token="));
    expect(clearedCookie).toBeDefined();
    expect(clearedCookie).toMatch(/Max-Age=0|expires=/i);

    // Attempting refresh with previous cookie must now fail
    if (cookieHeader) {
      const refreshAttempt = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", cookieHeader);
      expect(refreshAttempt.status).toBe(401);
    }
  });

  it("rejects registration with a username that is already taken (case-insensitive)", async () => {
    await request(app).post("/api/auth/register").send({
      username: "Speedster",
      email: "speed1@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/register").send({
      username: "speedster",
      email: "speed2@example.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/username is already taken/i);
  });

  it("rejects changing username to one owned by another user", async () => {
    await request(app).post("/api/auth/register").send({
      username: "takenname",
      email: "owner@example.com",
      password: "password123",
    });
    const other = await request(app).post("/api/auth/register").send({
      username: "othername",
      email: "other@example.com",
      password: "password123",
    });
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${other.body.data.token}`)
      .send({ username: "TakenName" });
    expect(res.status).toBe(409);
  });

  it("rejects Google sign-in when Google has not verified the email", async () => {
    vi.spyOn(googleAuthService, "verifyGoogleToken").mockResolvedValueOnce({
      googleId: "google-unverified",
      email: "unverified-google@example.com",
      name: "Unverified",
      isEmailVerified: false,
    });
    const res = await request(app).post("/api/auth/google").send({ accessToken: "mock" });
    expect(res.status).toBe(403);
  });

  it("wipes the unproven password when Google links an unverified email account (pre-hijack)", async () => {
    // Attacker pre-registers the victim's email and never verifies it.
    const victimEmail = "victim@example.com";
    await request(app).post("/api/auth/register").send({
      username: "attacker",
      email: victimEmail,
      password: "attackerpass",
    });
    const { UserModel } = await import("../modules/users/user.model.js");
    await UserModel.updateOne({ email: victimEmail }, { isEmailVerified: false });

    // The real owner signs in with Google.
    vi.spyOn(googleAuthService, "verifyGoogleToken").mockResolvedValueOnce({
      googleId: "google-victim",
      email: victimEmail,
      name: "Victim",
      isEmailVerified: true,
    });
    const googleRes = await request(app).post("/api/auth/google").send({ accessToken: "mock" });
    expect(googleRes.status).toBe(200);

    // The attacker's password no longer works.
    const login = await request(app).post("/api/auth/login").send({
      email: victimEmail,
      password: "attackerpass",
    });
    expect(login.status).not.toBe(200);
  });
});

