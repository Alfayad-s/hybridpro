export type AssessmentInput = {
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity: string;
  experience: string;
  goal: string;
  bodyBuild: string;
  daysPerWeek: number;
};

export type WorkoutExercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  cue: string;
  imageQuery: string;
  imageUrl?: string;
};

export type WorkoutDay = {
  day: string;
  title: string;
  focus: string;
  durationMin: number;
  coverQuery: string;
  coverImageUrl?: string;
  exercises: WorkoutExercise[];
};

export type MealItem = {
  slot: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  prepTimeMin: number;
  ingredients: string[];
  steps: string[];
  imageQuery: string;
  imageUrl?: string;
};

export type MealDay = {
  label: string;
  totalCalories: number;
  meals: MealItem[];
};

export type AssessmentResult = {
  headline: string;
  summary: string;
  readinessScore: number;
  bodyMetrics: {
    bmi: number;
    bmiLabel: string;
    estimatedBodyFat: string;
    metabolicType: string;
    idealWeightRange: string;
    waterLiters: number;
    sleepHours: string;
  };
  targets: {
    caloriesMaintain: number;
    caloriesGoal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  trainingFocus: string[];
  /** @deprecated Prefer workoutSplits; kept for compatibility */
  weeklyPlan: { day: string; focus: string; detail: string }[];
  workoutSplits: WorkoutDay[];
  mealPlan: MealDay[];
  nutritionTips: string[];
  lifestyleTips: string[];
  nextSteps: string[];
  coachNote: string;
};

export const ASSESSMENT_STORAGE_KEY = "hybridpro-assessment";
export const ASSESSMENT_RESULT_KEY = "hybridpro-assessment-result";

export function isAssessmentInput(value: unknown): value is AssessmentInput {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.name === "string" &&
    typeof v.weight === "number" &&
    typeof v.height === "number" &&
    typeof v.age === "number" &&
    typeof v.gender === "string" &&
    typeof v.activity === "string" &&
    typeof v.experience === "string" &&
    typeof v.goal === "string" &&
    typeof v.bodyBuild === "string" &&
    typeof v.daysPerWeek === "number"
  );
}
