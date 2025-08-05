import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup";
import { createApp } from "../app";

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
});
