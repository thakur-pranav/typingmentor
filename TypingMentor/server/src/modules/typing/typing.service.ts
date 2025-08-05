import { typingRepository } from "./typing.repository";
import { Difficulty } from "./typing.types";

export const typingService = {
  getPassages(difficulty?: Difficulty) {
    return typingRepository.findAll(difficulty);
  },

  getRandomPassage(difficulty?: Difficulty) {
    const pool = typingRepository.findAll(difficulty);
    return pool[Math.floor(Math.random() * pool.length)];
  },
};
