import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../utils/ApiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthService = {
  async verifyIdToken(idToken) {
    if (!idToken) {
      throw ApiError.badRequest("Google ID token is required");
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
