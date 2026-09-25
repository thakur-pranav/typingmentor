import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const passwordService = {
  hash(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  },

  compare(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
  },
};
