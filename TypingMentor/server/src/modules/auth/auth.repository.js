import { UserModel } from "../users/user.model.js";

export const authRepository = {
  findByEmail(email) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  findByEmailWithPassword(email) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  },

  create(data) {
    return UserModel.create({
      username: data.username,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
    });
  },
};
