/** Central media paths under `public/` */

export const brand = {
  logo: "/brand/logo.svg",
  logoGreyBorder: "/brand/logo-grey-border.svg",
} as const;

export const trainerPortraits = {
  dark: "/trainer/portrait-dark.png",
  light: "/trainer/portrait-light.png",
  footer: "/trainer/gallery/footer-portrait.png",
} as const;

export const trainerVideo = {
  src: "/trainer/video.mp4",
  title: "Training with Akash",
} as const;

export const trainerGalleryCards = [
  {
    src: "/trainer/gallery/coaching.jpg",
    alt: "Akash coaching in the gym",
    category: "On the floor",
    title: "Coaching in session",
    quote: "Every rep is coached, form first, ego last.",
  },
  {
    src: "/trainer/gallery/portrait.jpg",
    alt: "Akash, Hybrid Pro trainer",
    category: "Hybrid Pro",
    title: "Built for strength",
    quote: "Strength isn’t given. It’s earned, one session at a time.",
  },
  {
    src: "/trainer/gallery/lat-pulldown.jpg",
    alt: "Akash training session",
    category: "Training",
    title: "Progressive overload",
    quote: "Small wins stacked weekly become transformations.",
  },
  {
    src: "/trainer/gallery/cable-row.jpg",
    alt: "Akash, strength and conditioning",
    category: "Conditioning",
    title: "Work that lasts",
    quote: "Fat loss and strength can coexist when the plan fits your life.",
  },
] as const;

/** First gallery photo, used as video poster */
export const trainerPhotos = trainerGalleryCards;

export const programImages = {
  strength: "/programs/strength.jpg",
  fatLoss: "/programs/fat-loss.jpeg",
  muscle: "/programs/muscle-building.webp",
} as const;

export const nutritionImages = {
  hero: "/nutrition/hero.jpg",
  meal: "/nutrition/meal.jpg",
  trainingStyle: "/nutrition/training-style.jpg",
  strength: "/nutrition/strength.webp",
  bodybuilding: "/nutrition/bodybuilding.jpeg",
  conditioning: "/nutrition/conditioning.jpeg",
  mobility: "/nutrition/mobility.jpeg",
  fatLoss: "/nutrition/fat-loss.jpeg",
} as const;

export const resultImages = {
  client1: {
    before: "/results/client-1-before.jpeg",
    after: "/results/client-1-after.jpeg",
  },
  client2: {
    before: "/results/client-2-before.jpg",
    after: "/results/client-2-after.jpg",
  },
} as const;

export const audio = {
  gymCinematic: "/audio/gym-cinematic.mp3",
} as const;
