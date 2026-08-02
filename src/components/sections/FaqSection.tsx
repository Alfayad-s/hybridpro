"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Eyebrow, Reveal, SectionShell, SectionTitle } from "./Reveal";

const faqs = [
  {
    q: "Do I need a full gym?",
    a: "No. Every program has an equipment-light variation, and your coach adapts the plan to whatever you actually have access to.",
  },
  {
    q: "I'm a complete beginner, is this for me?",
    a: "Yes. We start from your current level, teach the lifts properly, and progress at a pace your body can absorb.",
  },
  {
    q: "What's the difference between Shop and Coaching?",
    a: "Shop (coming soon) is one-time digital products, PDF training plans and ebooks you download yourself. Coaching is ongoing personalised support with check-ins, form reviews, and a coach in your corner.",
  },
  {
    q: "How fast will I see results?",
    a: "Most athletes notice strength and energy changes within 3 to 4 weeks, and visible physique change around week 8 to 12.",
  },
  {
    q: "What if I need to pause?",
    a: "You can pause or cancel your coaching plan at any time, no contracts, no cancellation calls. Digital shop purchases (when live) are one-time downloads.",
  },
  {
    q: "Is nutrition included?",
    a: "Yes, Hybrid Coaching and 1-to-1 Elite include personalised nutrition targets, meal structure, and adjustments in your check-ins. See the Nutrition section for how meal planning works alongside training. Self-guided includes general guidelines; a deeper nutrition ebook is coming in the shop.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionShell id="faq">
      <Reveal>
        <Eyebrow>FAQ</Eyebrow>
        <SectionTitle>Questions, answered.</SectionTitle>
      </Reveal>

      <div className="mt-10 sm:mt-14">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <Reveal key={faq.q} delay={0.05 * i}>
              <div className="border-b border-[color:var(--border)]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-base text-[color:var(--muted)] transition-colors duration-300 hover:text-[var(--foreground)] sm:text-lg"
                >
                  <span>{faq.q}</span>
                  <span
                    className="relative h-3 w-3 shrink-0 text-[color:var(--muted-soft)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                    aria-hidden
                  >
                    <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      key={`faq-answer-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-relaxed text-[color:var(--muted)] sm:max-w-2xl sm:text-base">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
