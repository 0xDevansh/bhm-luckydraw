const adjectives = [
  "happy", "brave", "clever", "mighty", "gentle", "wise", "swift", "calm",
  "bright", "bold", "eager", "fancy", "jolly", "lucky", "noble", "proud",
  "quiet", "royal", "sunny", "witty",
  // New adjectives
  "fierce", "playful", "strong", "fearless", "graceful", "loyal",
  "charming", "daring", "kind", "mystic", "radiant", "cheerful",
  "vivid", "golden", "silver", "fiery", "serene",
  "vibrant", "dynamic"
];

const nouns = [
  "tiger", "eagle", "dolphin", "panda", "lion", "dragon",
  "phoenix", "unicorn", "wolf", "bear", "falcon",
  "hawk", "jaguar", "leopard", "panther",
  "raven", "shark", "whale", "zebra",
  "elephant",
  // New nouns
  "fox", "otter", "lynx", "cougar",
  "owl", "peacock", "cobra",
  "cheetah", "kangaroo",
  "penguin", "seal",
  "giraffe",
  "rhino",
  "hippo",
  "toucan",
  "parrot",
  "sparrow",
  "star", "moon", "sun", "cloud", "storm", "rainbow",
  "mountain", "ocean", "river", "lake", "forest",
  "tree", "flower", "garden", "palace", "castle",
  "treasure", "jewel", "gemstone", "diamond", "ruby",
  "emerald", "sapphire", "pearl", "coin", "key",
  "compass", "map", "journey", "quest", "adventure",
  "dream", "wish", "hope", "magic", "miracle",
  "legend", "myth", "story", "tale", "poem",
  "song", "dance", "music", "art", "painting",
  "sculpture", "poetry", "novel", "book", "library",
]

export function generateSecret(seed?: number): string {
  // Use the seed to make the generation deterministic if provided
  const randomSeed = seed || Math.floor(Math.random() * 1000)

  // Use the seed to select an adjective and noun
  const adjIndex = randomSeed % adjectives.length
  const nounIndex = (randomSeed * 13) % nouns.length // Multiply by a prime number for better distribution

  return `${adjectives[adjIndex]}${nouns[nounIndex]}`
}

