import type {
  AssessmentInput,
  AssessmentResult,
  MealDay,
  MealItem,
  WorkoutDay,
  WorkoutExercise,
} from "@/lib/assessment";
import { groqChatCompletion } from "@/lib/groq";
import { resolveImageJobs, type ImageJob } from "@/lib/serpImages";
import { trainer } from "@/lib/trainerContent";

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Model did not return valid JSON");
  }
}

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => asString(item)).filter(Boolean);
}

function normalizeExercise(raw: unknown): WorkoutExercise | null {
  const row = (raw ?? {}) as Record<string, unknown>;
  const name = asString(row.name);
  if (!name) return null;
  return {
    name,
    sets: asString(row.sets, "3"),
    reps: asString(row.reps, "8-12"),
    rest: asString(row.rest, "90s"),
    cue: asString(row.cue, "Control the tempo and keep form tight."),
    imageQuery: asString(row.imageQuery, `${name} gym exercise`),
  };
}

function normalizeWorkoutDay(raw: unknown, index: number): WorkoutDay | null {
  const row = (raw ?? {}) as Record<string, unknown>;
  const day = asString(row.day, `Day ${index + 1}`);
  const title = asString(row.title, asString(row.focus, "Training"));
  const focus = asString(row.focus, title);
  const exercisesRaw = Array.isArray(row.exercises) ? row.exercises : [];
  const exercises = exercisesRaw
    .map(normalizeExercise)
    .filter((e): e is WorkoutExercise => Boolean(e))
    .slice(0, 6);

  if (exercises.length === 0) return null;

  return {
    day,
    title,
    focus,
    durationMin: Math.round(asNumber(row.durationMin, 55)),
    coverQuery: asString(
      row.coverQuery,
      `${focus} workout gym training`,
    ),
    exercises,
  };
}

function normalizeMeal(raw: unknown): MealItem | null {
  const row = (raw ?? {}) as Record<string, unknown>;
  const name = asString(row.name);
  if (!name) return null;
  return {
    slot: asString(row.slot, "Meal"),
    name,
    calories: Math.round(asNumber(row.calories, 400)),
    proteinG: Math.round(asNumber(row.proteinG, 30)),
    carbsG: Math.round(asNumber(row.carbsG, 40)),
    fatG: Math.round(asNumber(row.fatG, 12)),
    prepTimeMin: Math.round(asNumber(row.prepTimeMin, 20)),
    ingredients: asStringArray(row.ingredients, ["Protein", "Carbs", "Veggies"]),
    steps: asStringArray(row.steps, [
      "Prep ingredients",
      "Cook with clean oils",
      "Plate and serve",
    ]).slice(0, 8),
    imageQuery: asString(row.imageQuery, `${name} healthy meal plated`),
  };
}

function normalizeMealDay(raw: unknown, index: number): MealDay | null {
  const row = (raw ?? {}) as Record<string, unknown>;
  const mealsRaw = Array.isArray(row.meals) ? row.meals : [];
  const meals = mealsRaw
    .map(normalizeMeal)
    .filter((m): m is MealItem => Boolean(m))
    .slice(0, 5);
  if (meals.length === 0) return null;
  const totalFromMeals = meals.reduce((sum, m) => sum + m.calories, 0);
  return {
    label: asString(row.label, index === 0 ? "Training day meals" : `Day ${index + 1}`),
    totalCalories: Math.round(asNumber(row.totalCalories, totalFromMeals)),
    meals,
  };
}

function normalizeResult(
  raw: unknown,
  input: AssessmentInput,
): AssessmentResult {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  const bodyMetrics = (obj.bodyMetrics ?? {}) as Record<string, unknown>;
  const targets = (obj.targets ?? {}) as Record<string, unknown>;

  const heightM = input.height / 100;
  const bmiFallback =
    heightM > 0 ? Math.round((input.weight / (heightM * heightM)) * 10) / 10 : 22;

  const workoutSplits = (
    Array.isArray(obj.workoutSplits) ? obj.workoutSplits : []
  )
    .map((item, i) => normalizeWorkoutDay(item, i))
    .filter((d): d is WorkoutDay => Boolean(d))
    .slice(0, Math.max(2, Math.min(7, input.daysPerWeek)));

  const mealPlan = (Array.isArray(obj.mealPlan) ? obj.mealPlan : [])
    .map((item, i) => normalizeMealDay(item, i))
    .filter((d): d is MealDay => Boolean(d))
    .slice(0, 2);

  const weeklyPlan =
    workoutSplits.length > 0
      ? workoutSplits.map((d) => ({
          day: d.day,
          focus: d.title,
          detail: `${d.focus} · ${d.exercises.length} exercises · ~${d.durationMin} min`,
        }))
      : (Array.isArray(obj.weeklyPlan) ? obj.weeklyPlan : [])
          .map((item) => {
            const row = (item ?? {}) as Record<string, unknown>;
            return {
              day: asString(row.day, "Day"),
              focus: asString(row.focus, "Training"),
              detail: asString(row.detail, "Structured session"),
            };
          })
          .filter((row) => row.day)
          .slice(0, 7);

  return {
    headline: asString(
      obj.headline,
      `${input.name}, your Hybrid Pro plan starts here`,
    ),
    summary: asString(
      obj.summary,
      "A clear coaching path built around your metrics, experience, and goal.",
    ),
    readinessScore: Math.min(
      100,
      Math.max(40, Math.round(asNumber(obj.readinessScore, 78))),
    ),
    bodyMetrics: {
      bmi: asNumber(bodyMetrics.bmi, bmiFallback),
      bmiLabel: asString(bodyMetrics.bmiLabel, "Healthy range"),
      estimatedBodyFat: asString(bodyMetrics.estimatedBodyFat, "Estimated range"),
      metabolicType: asString(bodyMetrics.metabolicType, "Balanced"),
      idealWeightRange: asString(
        bodyMetrics.idealWeightRange,
        `${Math.round(input.weight * 0.95)}-${Math.round(input.weight * 1.05)} kg`,
      ),
      waterLiters: asNumber(bodyMetrics.waterLiters, Math.max(2.5, input.weight * 0.035)),
      sleepHours: asString(bodyMetrics.sleepHours, "7.5-8.5 hrs"),
    },
    targets: {
      caloriesMaintain: Math.round(
        asNumber(targets.caloriesMaintain, input.weight * 30),
      ),
      caloriesGoal: Math.round(asNumber(targets.caloriesGoal, input.weight * 28)),
      proteinG: Math.round(asNumber(targets.proteinG, input.weight * 1.8)),
      carbsG: Math.round(asNumber(targets.carbsG, input.weight * 3)),
      fatG: Math.round(asNumber(targets.fatG, input.weight * 0.8)),
    },
    trainingFocus: asStringArray(obj.trainingFocus, [
      "Progressive overload",
      "Recovery management",
      "Form quality",
    ]),
    weeklyPlan,
    workoutSplits,
    mealPlan,
    nutritionTips: asStringArray(obj.nutritionTips, [
      "Hit protein first at every meal",
      "Keep hydration consistent through the day",
    ]),
    lifestyleTips: asStringArray(obj.lifestyleTips, [
      "Protect sleep for recovery",
      "Walk daily to raise non-exercise activity",
    ]),
    nextSteps: asStringArray(obj.nextSteps, [
      "Book a Hybrid Pro coaching call",
      "Install the GymTrack app and log week one",
    ]),
    coachNote: asString(
      obj.coachNote,
      `From ${trainer.name}: stay consistent and we’ll refine this together.`,
    ),
  };
}

async function attachImages(result: AssessmentResult): Promise<AssessmentResult> {
  const jobs: ImageJob[] = [];

  result.workoutSplits.forEach((day, di) => {
    jobs.push({
      id: `cover-${di}`,
      query: day.coverQuery,
      kind: "cover",
    });
    day.exercises.forEach((ex, ei) => {
      jobs.push({
        id: `ex-${di}-${ei}`,
        query: ex.imageQuery || ex.name,
        kind: "exercise",
      });
    });
  });

  result.mealPlan.forEach((day, di) => {
    day.meals.forEach((meal, mi) => {
      jobs.push({
        id: `meal-${di}-${mi}`,
        query: meal.imageQuery || meal.name,
        kind: "meal",
      });
    });
  });

  const urls = await resolveImageJobs(jobs, 4);

  return {
    ...result,
    workoutSplits: result.workoutSplits.map((day, di) => ({
      ...day,
      coverImageUrl: urls[`cover-${di}`] || day.coverImageUrl,
      exercises: day.exercises.map((ex, ei) => ({
        ...ex,
        imageUrl: urls[`ex-${di}-${ei}`] || ex.imageUrl,
      })),
    })),
    mealPlan: result.mealPlan.map((day, di) => ({
      ...day,
      meals: day.meals.map((meal, mi) => ({
        ...meal,
        imageUrl: urls[`meal-${di}-${mi}`] || meal.imageUrl,
      })),
    })),
  };
}

export async function generateAssessmentResult(
  input: AssessmentInput,
): Promise<AssessmentResult> {
  const days = Math.max(2, Math.min(6, input.daysPerWeek));

  const system = `You are ${trainer.name}, elite coach at Hybrid Pro (Active IQ Level 3, REPs UAE).
Create a premium, realistic, detailed body assessment with a full weekly workout split and daily meals with recipes.
Be specific to their numbers and goals. No medical diagnosis. No dangerous advice.
Return ONLY valid JSON matching the schema. Use metric units.
imageQuery fields must be short, accurate Google Image search phrases that will return the correct exercise demo or plated meal photo.`;

  const user = `Client data:
${JSON.stringify(input, null, 2)}

Return JSON with this exact shape:
{
  "headline": "short punchy personal headline using their first name",
  "summary": "2-3 sentences personalized overview",
  "readinessScore": 40-100,
  "bodyMetrics": {
    "bmi": number,
    "bmiLabel": "Underweight|Healthy|Overweight|Obese",
    "estimatedBodyFat": "e.g. 18-22%",
    "metabolicType": "short label",
    "idealWeightRange": "e.g. 70-76 kg",
    "waterLiters": number,
    "sleepHours": "e.g. 7.5-8.5 hrs"
  },
  "targets": {
    "caloriesMaintain": number,
    "caloriesGoal": number,
    "proteinG": number,
    "carbsG": number,
    "fatG": number
  },
  "trainingFocus": ["3-5 bullets"],
  "workoutSplits": [
    {
      "day": "Day 1",
      "title": "Push Strength",
      "focus": "Chest · Shoulders · Triceps",
      "durationMin": 55,
      "coverQuery": "barbell bench press gym workout",
      "exercises": [
        {
          "name": "Barbell Bench Press",
          "sets": "4",
          "reps": "6-8",
          "rest": "120s",
          "cue": "one coaching cue",
          "imageQuery": "barbell bench press exercise form"
        }
      ]
    }
  ],
  "mealPlan": [
    {
      "label": "Daily meal plan",
      "totalCalories": number,
      "meals": [
        {
          "slot": "Breakfast",
          "name": "Greek Yogurt Protein Bowl",
          "calories": 420,
          "proteinG": 35,
          "carbsG": 40,
          "fatG": 12,
          "prepTimeMin": 10,
          "ingredients": ["item with amount", "..."],
          "steps": ["step 1", "step 2", "step 3"],
          "imageQuery": "greek yogurt berry protein bowl plated"
        }
      ]
    }
  ],
  "nutritionTips": ["3-5 tips"],
  "lifestyleTips": ["3-4 tips"],
  "nextSteps": ["3 concrete next steps"],
  "coachNote": "1 short personal note from ${trainer.name}"
}

Rules:
- workoutSplits length MUST be exactly ${days} training days (no rest-day placeholders).
- Each workout day: 4 to 5 exercises max. Use real gym exercises matching experience (${input.experience}) and goal (${input.goal}).
- coverQuery / imageQuery must be precise so Google Images returns the correct exercise or meal.
- mealPlan: provide 1 complete daily plan with Breakfast, Lunch, Dinner, and Snack (4 meals).
- Meal calories + macros should roughly add up to caloriesGoal and protein/carbs/fat targets.
- Recipes must be practical home-cookable steps (3-6 steps). Ingredients with amounts.
- Make body metrics and targets mathematically sensible for weight ${input.weight}kg height ${input.height}cm age ${input.age}.`;

  const { content } = await groqChatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.45,
    maxTokens: 4500,
    jsonMode: true,
  });

  const normalized = normalizeResult(extractJson(content), input);
  return attachImages(normalized);
}
