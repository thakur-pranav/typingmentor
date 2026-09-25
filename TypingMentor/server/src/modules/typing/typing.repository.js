import { PASSAGES } from "./passages.data.js";

export const typingRepository = {
  findAll(difficulty) {
    if (!difficulty) return PASSAGES;
    return PASSAGES.filter((p) => p.difficulty === difficulty);
  },
};
