import { UserModel } from "./user.model.js";

export const userRepository = {
  findByEmail(email) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  findByEmailWithPassword(email) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  },

  findById(id) {
    return UserModel.findById(id);
  },

  create(data) {
    return UserModel.create({
      username: data.username,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
    });
  },

  updateUsername(id, username) {
    return UserModel.findByIdAndUpdate(id, { username }, { new: true });
  },

  findByIdsMap(ids) {
    return UserModel.find({ _id: { $in: ids } }).then((users) => {
      const map = new Map();
      users.forEach((u) => map.set(u._id.toString(), u));
      return map;
    });
  },
};
