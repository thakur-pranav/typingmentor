import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../utils/ApiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthService = {
  async verifyGoogleToken({ credential, accessToken } = {}) {
    if (accessToken) {
      return this.verifyAccessToken(accessToken);
    }
    if (credential) {
      return this.verifyIdToken(credential);
    }
    throw ApiError.badRequest("Google token is required");
  },

  async verifyAccessToken(accessToken) {
    const expectedClientId = process.env.GOOGLE_CLIENT_ID;
    if (!expectedClientId) {
      throw ApiError.internal("Google sign-in is not configured on the server");
    }

    try {
      // 1. Confirm the access token was issued to THIS app (prevents token substitution
      //    where a token minted for another Google client is replayed against us).
      const infoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
      );
      if (!infoRes.ok) {
        throw ApiError.unauthorized("Invalid Google access token");
      }
      const tokenInfo = await infoRes.json();
      if (tokenInfo.aud !== expectedClientId && tokenInfo.azp !== expectedClientId) {
        throw ApiError.unauthorized("Google token was not issued for this application");
      }

      // 2. Fetch the profile.
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        throw ApiError.unauthorized("Failed to fetch Google user profile");
      }

      const payload = await res.json();
      if (!payload.email) {
        throw ApiError.badRequest("Google account does not provide an email address");
      }
      if (tokenInfo.sub && payload.sub !== tokenInfo.sub) {
        throw ApiError.unauthorized("Google token and profile do not match");
      }

      return {
        googleId: payload.sub,
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email.split("@")[0],
        picture: payload.picture,
        isEmailVerified: Boolean(payload.email_verified),
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw ApiError.unauthorized(`Google verification failed: ${err.message}`);
    }
  },

  async verifyIdToken(idToken) {
    if (!idToken) {
      throw ApiError.badRequest("Google ID token is required");
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw ApiError.internal("Google sign-in is not configured on the server");
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw ApiError.unauthorized("Invalid Google ID token payload");
      }

      if (!payload.email) {
        throw ApiError.badRequest("Google account does not provide an email address");
      }

      return {
        googleId: payload.sub,
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email.split("@")[0],
        picture: payload.picture,
        isEmailVerified: Boolean(payload.email_verified),
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw ApiError.unauthorized(`Google verification failed: ${err.message}`);
    }
  },
};
