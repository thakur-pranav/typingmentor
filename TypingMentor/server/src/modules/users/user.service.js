import { ApiError } from "../../utils/ApiError.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async updateProfile(id, data) {
    if (!data.username) {
      return this.getById(id);
    }
    const updated = await userRepository.updateUsername(id, data.username);
    if (!updated) throw ApiError.notFound("User not found");
    return updated;
  },
};
