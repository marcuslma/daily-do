// Lista de 10 GIFs de celebração do Giphy
const CELEBRATION_GIFS = [
  "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif", // Confetti explosion
  "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif", // Party popper
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Dancing celebration
  "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif", // Fireworks
  "https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif", // Trophy success
  "https://media.giphy.com/media/3oEjHWXddcCOGZNmFO/giphy.gif", // High five
  "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif", // Thumbs up celebration
  "https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif", // Stars and sparkles
  "https://media.giphy.com/media/2xIOiAPXonois/giphy.gif", // Clapping hands
  "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif", // Victory dance
];

export function getRandomCelebrationGif(): string {
  const randomIndex = Math.floor(Math.random() * CELEBRATION_GIFS.length);
  return CELEBRATION_GIFS[randomIndex];
}
