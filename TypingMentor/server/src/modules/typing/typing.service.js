import { typingRepository } from "./typing.repository.js";

export const typingService = {
  getPassages(difficulty) {
    return typingRepository.findAll(difficulty);
  },

  getRandomPassage(difficulty) {
    const pool = typingRepository.findAll(difficulty);
    return pool[Math.floor(Math.random() * pool.length)];
  },
};
