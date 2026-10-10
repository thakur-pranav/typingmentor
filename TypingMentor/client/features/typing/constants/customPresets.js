export const CUSTOM_PRESETS_BY_CATEGORY = {
  pangram: [
    {
      title: "Quick Brown Fox",
      author: "Traditional",
      text: "The quick brown fox jumps over the lazy dog.",
    },
    {
      title: "Black Quartz Sphinx",
      author: "Traditional",
      text: "Sphinx of black quartz, judge my vow.",
    },
    {
      title: "Five Dozen Jugs",
      author: "Traditional",
      text: "Pack my box with five dozen liquor jugs.",
    },
    {
      title: "Piqued Gymnasts",
      author: "Traditional",
      text: "How razorback-jumping frogs can level six piqued gymnasts!",
    },
    {
      title: "Waltz Bad Nymph",
      author: "Traditional",
      text: "Waltz, bad nymph, for quick jigs vex.",
    },
    {
      title: "Jinxed Wizards",
      author: "Traditional",
      text: "Jinxed wizards pluck ivy from the big quilt.",
    },
    {
      title: "Boxing Wizards",
      author: "Traditional",
      text: "The five boxing wizards jump quickly.",
    },
    {
      title: "Exquisite Jewels",
      author: "Traditional",
      text: "Crazy Fredericka bought many very exquisite opal jewels.",
    },
  ],

  tech: [
    {
      title: "Readable Programs",
      author: "Harold Abelson",
      text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    },
    {
      title: "Simplicity First",
      author: "Edsger W. Dijkstra",
      text: "Simplicity is prerequisite for reliability.",
    },
    {
      title: "Show Me The Code",
      author: "Linus Torvalds",
      text: "Talk is cheap. Show me the code.",
    },
    {
      title: "Premature Optimization",
      author: "Donald Knuth",
      text: "Premature optimization is the root of all evil.",
    },
    {
      title: "Human Understandable",
      author: "Martin Fowler",
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    },
    {
      title: "Solve The Problem",
      author: "John Johnson",
      text: "First, solve the problem. Then, write the code.",
    },
    {
      title: "Humor in Code",
      author: "Cory House",
      text: "Code is like humor. When you have to explain it, it is bad.",
    },
    {
      title: "Undocumented Feature",
      author: "Engineering Folklore",
      text: "It is not a bug; it is an undocumented feature.",
    },
  ],

  philosophy: [
    {
      title: "Excellence as Habit",
      author: "Aristotle",
      text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    },
    {
      title: "Control of Mind",
      author: "Marcus Aurelius",
      text: "You have power over your mind, not outside events. Realize this, and you will find strength.",
    },
    {
      title: "A Why to Live",
      author: "Friedrich Nietzsche",
      text: "He who has a why to live can bear almost any how.",
    },
    {
      title: "Fear of Living",
      author: "Marcus Aurelius",
      text: "It is not death that a man should fear, but he should fear never beginning to live.",
    },
    {
      title: "Be a Good Man",
      author: "Marcus Aurelius",
      text: "Waste no more time arguing about what a good man should be. Be one.",
    },
    {
      title: "Dance with Change",
      author: "Alan Watts",
      text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
    },
    {
      title: "Source of Happiness",
      author: "Dalai Lama",
      text: "Happiness is not something ready-made. It comes from your own actions.",
    },
  ],

  literature: [
    {
      title: "A Tale of Two Cities",
      author: "Charles Dickens",
      text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
    },
    {
      title: "Time Given Us",
      author: "J.R.R. Tolkien",
      text: "All we have to decide is what to do with the time that is given us.",
    },
    {
      title: "Opportunity in Difficulty",
      author: "Albert Einstein",
      text: "In the middle of difficulty lies opportunity.",
    },
    {
      title: "Wanderers",
      author: "J.R.R. Tolkien",
      text: "Not all those who wander are lost.",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    },
    {
      title: "Rage Against Dying",
      author: "Dylan Thomas",
      text: "Do not go gentle into that good night. Rage, rage against the dying of the light.",
    },
    {
      title: "Be Yourself",
      author: "Ralph Waldo Emerson",
      text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    },
  ],

  twisters: [
    {
      title: "Seashells",
      author: "Tongue Twister",
      text: "She sells seashells by the seashore, and the shells she sells are surely seashells.",
    },
    {
      title: "Peter Piper",
      author: "Tongue Twister",
      text: "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.",
    },
    {
      title: "Woodchuck",
      author: "Tongue Twister",
      text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    },
    {
      title: "Which Witch",
      author: "Tongue Twister",
      text: "Which witch wished which wicked wish when the witches went away?",
    },
    {
      title: "Lorries & New York",
      author: "Tongue Twister",
      text: "Red lorry, yellow lorry, red lorry, yellow lorry, unique New York.",
    },
    {
      title: "Fuzzy Wuzzy",
      author: "Tongue Twister",
      text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy was not fuzzy, was he?",
    },
  ],
};

export const PRESET_CATEGORIES = [
  { id: "all",        label: "Surprise Me",   icon: "🎲" },
  { id: "pangram",    label: "Pangram",       icon: "🔤" },
  { id: "tech",       label: "Tech Quote",    icon: "💻" },
  { id: "philosophy", label: "Philosophy",    icon: "🏛️" },
  { id: "literature", label: "Literature",    icon: "📚" },
  { id: "twisters",   label: "Agility",       icon: "⚡" },
];

/**
 * Rolls a random preset, ensuring a new text is returned whenever possible.
 */
export function getRandomPreset(categoryId = "all", currentText = "") {
  let pool = [];
  if (categoryId === "all" || !CUSTOM_PRESETS_BY_CATEGORY[categoryId]) {
    pool = Object.values(CUSTOM_PRESETS_BY_CATEGORY).flat();
  } else {
    pool = CUSTOM_PRESETS_BY_CATEGORY[categoryId];
  }

  if (pool.length === 0) return null;

  // Filter out the currently selected text if possible so rerolling feels active
  const candidates = pool.filter((item) => item.text !== currentText.trim());
  const activePool = candidates.length > 0 ? candidates : pool;

  const randomIndex = Math.floor(Math.random() * activePool.length);
  return activePool[randomIndex];
}
