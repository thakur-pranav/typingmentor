import { userRepository } from "../users/user.repository";

// Auth delegates persistence to the users module's repository, keeping a
// single source of truth for the User collection while still following the
// routes -> controller -> service -> repository layering within this module.
export const authRepository = {
  findByEmail: userRepository.findByEmail,
  findByEmailWithPassword: userRepository.findByEmailWithPassword,
  create: userRepository.create,
};
