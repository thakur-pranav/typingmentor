import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup";
import { createApp } from "../app";

const app = createApp();

async function registerAndLogin() {
  const res = await request(app).post("/api/auth/register").send({
    username: "typist",
    email: "typist@example.com",
    password: "password123",
  });
  return res.body.data.token as string;
}

describe("Results & Leaderboard", () => {
  it("submits a typing result for an authenticated user", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "timed",
        duration: 60,
        wpm: 80,
        netWpm: 75,
        accuracy: 96.5,
        totalCharacters: 400,
        correctCharacters: 386,
        incorrectCharacters: 14,
      });
    expect(res.status).toBe(201);
  });

  it("rejects result submission without auth", async () => {
    const res = await request(app).post("/api/results").send({
      mode: "timed",
      duration: 60,
      wpm: 80,
      netWpm: 75,
      accuracy: 96.5,
      totalCharacters: 400,
      correctCharacters: 386,
      incorrectCharacters: 14,
    });
    expect(res.status).toBe(401);
  });

  it("returns paginated history for the authenticated user", async () => {
    const token = await registerAndLogin();
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "timed",
        duration: 60,
        wpm: 80,
        netWpm: 75,
        accuracy: 96.5,
        totalCharacters: 400,
        correctCharacters: 386,
        incorrectCharacters: 14,
      });

    const res = await request(app)
      .get("/api/results/history?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.results.length).toBe(1);
  });

  it("returns a global leaderboard sorted by best wpm", async () => {
    const token = await registerAndLogin();
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "timed",
        duration: 60,
        wpm: 120,
        netWpm: 110,
        accuracy: 98,
        totalCharacters: 600,
        correctCharacters: 588,
        incorrectCharacters: 12,
      });

    const res = await request(app).get("/api/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body.data[0].bestWpm).toBe(120);
  });
});
