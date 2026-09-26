import crypto from "node:crypto";
import { ApiError } from "../../utils/ApiError.js";
import { authRepository } from "./auth.repository.js";
import { passwordService } from "./password.service.js";
import { signAccessToken } from "./token.service.js";
import { mailService } from "./mail.service.js";
import { googleAuthService } from "./google.service.js";
import { UserModel } from "../users/user.model.js";

function toAuthUser(user) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    isEmailVerified: Boolean(user.isEmailVerified),
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export const authService = {
  async register(input) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw ApiError.conflict("An account with this email already exists");
    }

    const passwordHash = await passwordService.hash(input.password);
    const isTest = process.env.NODE_ENV === "test";

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await authRepository.create({
      username: input.username,
      email: input.email,
      passwordHash,
      isEmailVerified: isTest,
      emailVerificationToken: isTest ? undefined : verificationToken,
      emailVerificationExpires: isTest ? undefined : verificationExpires,
    });

    if (!isTest) {
      await mailService.sendVerificationEmail({
        to: user.email,
        username: user.username,
        token: verificationToken,
      });

      return {
        user: toAuthUser(user),
        requireVerification: true,
        message: "Registration successful! Please check your email to verify your account.",
      };
    }

    const token = signAccessToken({ userId: String(user._id), email: user.email });
    return { token, user: toAuthUser(user), requireVerification: false };
  },

  async login(input) {
    const user = await authRepository.findByEmailWithPassword(input.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (!user.passwordHash) {
      throw ApiError.badRequest("This account was created using Google. Please sign in with Google.");
    }

    const isValid = await passwordService.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (!user.isEmailVerified && process.env.NODE_ENV !== "test") {
      throw new ApiError(
        403,
        "Please verify your email address before logging in. Check your inbox for the verification link.",
        true,
        "EMAIL_NOT_VERIFIED"
      );
    }

    const token = signAccessToken({ userId: String(user._id), email: user.email });
    return { token, user: toAuthUser(user) };
  },

  async verifyEmail(token) {
    if (!token) {
      throw ApiError.badRequest("Verification token is required");
    }

    const user = await authRepository.findByVerificationToken(token);
    if (!user) {
      throw ApiError.badRequest("Invalid or expired verification link");
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      throw ApiError.badRequest("Verification link has expired. Please request a new one.");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const authToken = signAccessToken({ userId: String(user._id), email: user.email });
    return { token: authToken, user: toAuthUser(user) };
  },

  async resendVerification(email) {
    if (!email) {
      throw ApiError.badRequest("Email is required");
    }

    const user = await authRepository.findByEmail(email);
    if (!user || user.isEmailVerified) {
      return { message: "If an unverified account exists with that email, a verification link has been sent." };
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    await mailService.sendVerificationEmail({
      to: user.email,
      username: user.username,
      token: verificationToken,
    });

    return { message: "Verification link sent! Please check your email inbox." };
  },

  async googleLogin(credential) {
    const googleProfile = await googleAuthService.verifyIdToken(credential);

    let user = await authRepository.findByGoogleId(googleProfile.googleId);

    if (!user) {
      user = await authRepository.findByEmail(googleProfile.email);
      if (user) {
        user.googleId = googleProfile.googleId;
        user.isEmailVerified = true;
        if (googleProfile.picture && !user.avatarUrl) {
          user.avatarUrl = googleProfile.picture;
        }
        await user.save();
      }
    }

    if (!user) {
      let baseUsername = googleProfile.name.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
      if (baseUsername.length < 3) baseUsername = `user_${baseUsername}`;

      let finalUsername = baseUsername;
      let suffix = 1;
      while (await UserModel.findOne({ username: finalUsername })) {
        finalUsername = `${baseUsername.slice(0, 15)}_${Math.floor(1000 + Math.random() * 9000)}`;
        suffix++;
        if (suffix > 10) break;
      }

      user = await authRepository.create({
        username: finalUsername,
        email: googleProfile.email,
        googleId: googleProfile.googleId,
        avatarUrl: googleProfile.picture,
        isEmailVerified: true,
      });
    } else {
      user.isEmailVerified = true;
      if (googleProfile.picture && !user.avatarUrl) {
        user.avatarUrl = googleProfile.picture;
      }
      await user.save();
    }

    const token = signAccessToken({ userId: String(user._id), email: user.email });
    return { token, user: toAuthUser(user) };
  },
};
