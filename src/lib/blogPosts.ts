export type BlogPost = {
  slug: string;
  category: string;
  date: string;
  published: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-hybrid-athletes-out-progress-pure-lifters",
    category: "Training",
    date: "Jul 2026",
    published: "2026-07-12",
    title: "Why hybrid athletes out-progress pure lifters",
    excerpt:
      "Mixing strength and conditioning does not blunt your gains, done in the right order, it accelerates them.",
    paragraphs: [
      "Hybrid Pro programs mix strength work with conditioning on purpose. The goal is not to do every session as hard as possible. It is to get stronger, keep the engine, and still recover for the next week.",
      "Heavy compounds come first, while you are fresh. Conditioning follows, or it sits on a separate day, so the strength work is not the leftover. That order is how a hybrid week is written: progressive overload on the main lifts, then work that supports fat loss or a race without stealing the next session.",
      "A pure lifting block can stall when conditioning, steps, and life stress are ignored. A pure cardio block can stall when the muscles that protect the joints never get stronger. The Hybrid Pro pathways, Strength and Performance, Fat Loss, and Muscle Development, run 8 to 12 weeks and include mobility so the plan does not break you down.",
      "Hyrox is the exception in length, not in idea. It is a 12-week race plan: sessions you mark finished, an RPE log, and a group chat. It does not include meal logging. Strength still has a place in that block, because the race asks for both.",
      "If you train online, the same structure lands in the app. If you are in Bengaluru when Hybrid Pro Fitness Studio opens, the in-person session follows the same plan. The method does not change with the room.",
    ],
  },
  {
    slug: "eating-for-a-heavy-training-block",
    category: "Nutrition",
    date: "Jun 2026",
    published: "2026-06-18",
    title: "Eating for a heavy training block",
    excerpt:
      "A practical framework for fuelling five sessions a week without tracking every gram.",
    paragraphs: [
      "A heavy training week needs enough food to lift, and a structure you can repeat when work runs late. Hybrid Pro does not ask every client to weigh every meal. The useful version is a target, a default plate, and a check-in when the week slips.",
      "Personalised nutrition is part of Performance and Elite. Those plans include macro guidance, and Elite adds a meal plan. You log meals in the app, and the coach adjusts the target with the training, not against it. Foundation is the training plan without a nutrition plan. Hyrox is the 12-week race plan and does not include meals.",
      "On a five-session week, protein is the piece to keep steady. Carbohydrates sit higher around the harder sessions and lower on the easy days. Fat fills the rest. That is the framework. The exact numbers come from your goal, your weight, and how the last block actually felt.",
      "Weekly check-ins exist so the plate can change when sleep, travel, or hunger changes. A plan that only works if you track every gram will not survive a busy month. The coaching is built to survive that month.",
    ],
  },
  {
    slug: "recovery-habits-that-move-the-needle",
    category: "Recovery",
    date: "Jun 2026",
    published: "2026-06-04",
    title: "The recovery habits that actually move the needle",
    excerpt:
      "Sleep, protein and load management beat every gadget on the market. Here is how to structure them.",
    paragraphs: [
      "Recovery at Hybrid Pro is not a gadget list. It is sleep, enough protein, and a week of training you can repeat. If those three slip, no tool on your wrist will put the session back.",
      "Load is managed in the plan, not guessed in the gym. Strength blocks progress week to week. Form is checked with video reviews: up to two a week on Foundation, up to four a month on Performance, and unlimited on Elite. The coach changes the next week from what you actually did.",
      "Sleep is the habit that shows up in the check-in. A short night is a reason to keep the session, not a reason to add more work. Protein stays in the same place as the nutrition plan: steady on Performance and Elite, and your own structure on Foundation and Hyrox.",
      "You can pause a coaching plan when life asks for it. There is no contract and no cancellation call. The point of the habits is that they are still there when you start again.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
