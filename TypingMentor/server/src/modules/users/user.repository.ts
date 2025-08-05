import { UserModel, UserDocument } from "./user.model";

export const userRepository = {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  findByEmailWithPassword(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  },

  findById(id: string) {
    return UserModel.findById(id);
  },

  create(data: { username: string; email: string; passwordHash: string }) {
    return UserModel.create({
      username: data.username,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
    });
  },

  updateUsername(id: string, username: string) {
    return UserModel.findByIdAndUpdate(id, { username }, { new: true });
  },

  findByIdsMap(ids: string[]): Promise<Map<string, UserDocument>> {
    return UserModel.find({ _id: { $in: ids } }).then((users) => {
      const map = new Map<string, UserDocument>();
      users.forEach((u) => map.set(u._id.toString(), u));
      return map;
    });
  },
};
