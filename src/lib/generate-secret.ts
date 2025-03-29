const adjectives = [
  "happy",
  "brave",
  "clever",
  "mighty",
  "gentle",
  "wise",
  "swift",
  "calm",
  "bright",
  "bold",
  "eager",
  "fancy",
  "jolly",
  "lucky",
  "noble",
  "proud",
  "quiet",
  "royal",
  "sunny",
  "witty",
]

const nouns = [
  "tiger",
  "eagle",
  "dolphin",
  "panda",
  "lion",
  "dragon",
  "phoenix",
  "unicorn",
  "wolf",
  "bear",
  "falcon",
  "hawk",
  "jaguar",
  "leopard",
  "panther",
  "raven",
  "shark",
  "whale",
  "zebra",
  "elephant",
]

export function generateSecret(seed?: number): string {
  // Use the seed to make the generation deterministic if provided
  const randomSeed = seed || Math.floor(Math.random() * 1000)

  // Use the seed to select an adjective and noun
  const adjIndex = randomSeed % adjectives.length
  const nounIndex = (randomSeed * 13) % nouns.length // Multiply by a prime number for better distribution

  return `${adjectives[adjIndex]}${nouns[nounIndex]}`
}

