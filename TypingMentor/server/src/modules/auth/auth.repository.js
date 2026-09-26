import { UserModel } from "../users/user.model.js";

export const authRepository = {
  findByEmail(email) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  findByEmailWithPassword(email) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  },

  findByVerificationToken(token) {
    return UserModel.findOne({ emailVerificationToken: token }).select(
      "+emailVerificationToken +emailVerificationExpires"
    );
  },

  findByGoogleId(googleId) {
    return UserModel.findOne({ googleId });
  },

  create(data) {
    return UserModel.create({
      username: data.username,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      googleId: data.googleId,
      avatarUrl: data.avatarUrl,
      isEmailVerified: data.isEmailVerified ?? false,
      emailVerificationToken: data.emailVerificationToken,
      emailVerificationExpires: data.emailVerificationExpires,
    });
  },
};
