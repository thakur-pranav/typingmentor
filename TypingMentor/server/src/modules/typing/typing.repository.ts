import { PASSAGES } from "./passages.data";
import { Difficulty } from "./typing.types";

// Passages are static content, not database-backed, matching the frontend's
// local passage collection (section 12 of the spec). Kept here so the
// backend can serve the same data set for consistency / future use.
export const typingRepository = {
  findAll(difficulty?: Difficulty) {
    if (!difficulty) return PASSAGES;
    return PASSAGES.filter((p) => p.difficulty === difficulty);
  },
};
