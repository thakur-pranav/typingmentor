import { ApiError } from "../../utils/ApiError.js";
import { authRepository } from "./auth.repository.js";
import { passwordService } from "./password.service.js";
import { signAccessToken } from "./token.service.js";

function toAuthUser(user) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
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
    const user = await authRepository.create({
      username: input.username,
      email: input.email,
      passwordHash,
    });

    const token = signAccessToken({ userId: String(user._id), email: user.email });
    return { token, user: toAuthUser(user) };
  },

  async login(input) {
    const user = await authRepository.findByEmailWithPassword(input.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isValid = await passwordService.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = signAccessToken({ userId: String(user._id), email: user.email });
    return { token, user: toAuthUser(user) };
  },
};
