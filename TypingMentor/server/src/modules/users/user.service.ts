import { ApiError } from "../../utils/ApiError";
import { userRepository } from "./user.repository";
import { UserDocument } from "./user.model";

export const userService = {
  async getById(id: string): Promise<UserDocument> {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async updateProfile(id: string, data: { username?: string }): Promise<UserDocument> {
    if (!data.username) {
      return this.getById(id);
    }
    const updated = await userRepository.updateUsername(id, data.username);
    if (!updated) throw ApiError.notFound("User not found");
    return updated;
  },
};
