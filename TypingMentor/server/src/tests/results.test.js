import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup.js";
import { createApp } from "../app.js";

const app = createApp();

async function registerAndLogin() {
  const res = await request(app).post("/api/auth/register").send({
    username: "typist",
    email: "typist@example.com",
    password: "password123",
  });
  return res.body.data.token;
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

  it("submits a code mode result for an authenticated user", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "code",
        duration: 45,
        wpm: 60,
        netWpm: 58,
        accuracy: 97,
        totalCharacters: 250,
        correctCharacters: 245,
        incorrectCharacters: 5,
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

  it("filters history by mode and duration", async () => {
    const token = await registerAndLogin();
    // 15s timed result
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "timed",
        duration: 15,
        wpm: 100,
        netWpm: 95,
        accuracy: 95,
        totalCharacters: 200,
        correctCharacters: 190,
        incorrectCharacters: 10,
      });

    // Code mode result
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "code",
        duration: 40,
        wpm: 60,
        netWpm: 58,
        accuracy: 98,
        totalCharacters: 200,
        correctCharacters: 196,
        incorrectCharacters: 4,
      });

    // Query timed 15s history
    const timedRes = await request(app)
      .get("/api/results/history?page=1&limit=10&mode=timed&duration=15")
      .set("Authorization", `Bearer ${token}`);
    expect(timedRes.status).toBe(200);
    expect(timedRes.body.data.results.length).toBe(1);
    expect(timedRes.body.data.results[0].mode).toBe("timed");

    // Query code history
    const codeRes = await request(app)
      .get("/api/results/history?page=1&limit=10&mode=code")
      .set("Authorization", `Bearer ${token}`);
    expect(codeRes.status).toBe(200);
    expect(codeRes.body.data.results.length).toBe(1);
    expect(codeRes.body.data.results[0].mode).toBe("code");

    // Submit custom mode result
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "custom",
        duration: 25,
        wpm: 85,
        netWpm: 82,
        accuracy: 97,
        totalCharacters: 150,
        correctCharacters: 145,
        incorrectCharacters: 5,
      });

    // Query custom history
    const customRes = await request(app)
      .get("/api/results/history?page=1&limit=10&mode=custom")
      .set("Authorization", `Bearer ${token}`);
    expect(customRes.status).toBe(200);
    expect(customRes.body.data.results.length).toBe(1);
    expect(customRes.body.data.results[0].mode).toBe("custom");

    // Query passage history (none submitted yet)
    const passageRes = await request(app)
      .get("/api/results/history?page=1&limit=10&mode=passage")
      .set("Authorization", `Bearer ${token}`);
    expect(passageRes.status).toBe(200);
    expect(passageRes.body.data.results.length).toBe(0);
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

  it("filters leaderboard by mode and duration", async () => {
    const token = await registerAndLogin();
    // User submits a 15s timed result with 140 WPM
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "timed",
        duration: 15,
        wpm: 140,
        netWpm: 135,
        accuracy: 97,
        totalCharacters: 200,
        correctCharacters: 195,
        incorrectCharacters: 5,
      });

    // User submits a 60s timed result with 95 WPM
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "timed",
        duration: 60,
        wpm: 95,
        netWpm: 90,
        accuracy: 95,
        totalCharacters: 500,
        correctCharacters: 485,
        incorrectCharacters: 15,
      });

    // User submits a code mode result with 70 WPM
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "code",
        duration: 40,
        wpm: 70,
        netWpm: 68,
        accuracy: 98,
        totalCharacters: 300,
        correctCharacters: 295,
        incorrectCharacters: 5,
      });

    // Query 15s timed leaderboard
    const timed15Res = await request(app).get("/api/leaderboard?mode=timed&duration=15");
    expect(timed15Res.status).toBe(200);
    expect(timed15Res.body.data[0].bestWpm).toBe(140);

    // Query 60s timed leaderboard
    const timed60Res = await request(app).get("/api/leaderboard?mode=timed&duration=60");
    expect(timed60Res.status).toBe(200);
    expect(timed60Res.body.data[0].bestWpm).toBe(95);

    // Query code mode leaderboard
    const codeRes = await request(app).get("/api/leaderboard?mode=code");
    expect(codeRes.status).toBe(200);
    expect(codeRes.body.data[0].bestWpm).toBe(70);
  });

  it("rejects invalid mode or duration query parameters", async () => {
    const invalidModeRes = await request(app).get("/api/leaderboard?mode=invalid_mode");
    expect(invalidModeRes.status).toBe(400);

    const invalidDurationRes = await request(app).get("/api/leaderboard?duration=-10");
    expect(invalidDurationRes.status).toBe(400);
  });

  it("excludes custom mode results from the global leaderboard", async () => {
    const token = await registerAndLogin();
    // User submits a fast custom test
    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "custom",
        duration: 10,
        wpm: 250,
        netWpm: 250,
        accuracy: 100,
        totalCharacters: 100,
        correctCharacters: 100,
        incorrectCharacters: 0,
      });

    // Global leaderboard must exclude custom results
    const res = await request(app).get("/api/leaderboard");
    expect(res.status).toBe(200);
    const customEntry = res.body.data.find((e) => e.bestWpm === 250);
    expect(customEntry).toBeUndefined();
  });

  it("returns user statistics with aggregated metrics and recent tests", async () => {
    const token = await registerAndLogin();

    await request(app)
      .post("/api/results")
      .set("Authorization", `Bearer ${token}`)
      .send({
        mode: "timed",
        duration: 30,
        wpm: 105,
        netWpm: 100,
        accuracy: 97.5,
        totalCharacters: 300,
        correctCharacters: 292,
        incorrectCharacters: 8,
      });

    const unauthRes = await request(app).get("/api/statistics");
    expect(unauthRes.status).toBe(401);

    const res = await request(app)
      .get("/api/statistics")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.bestWpm).toBe(105);
    expect(res.body.data.totalTests).toBeGreaterThanOrEqual(1);
    expect(res.body.data.recentTests.length).toBeGreaterThanOrEqual(1);
  });
});
