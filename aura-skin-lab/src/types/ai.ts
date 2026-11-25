import { SkinType } from './product';

export interface SkinQuizAnswers {
  skinType: SkinType;
  mainConcern: 'acne' | 'aging' | 'hydration' | 'redness' | 'dark_spots';
  sensitivity: 'low' | 'medium' | 'high';
  ageRange?: string;
}

export interface RoutineStep {
  step: number;
  timeOfDay: 'morning' | 'night';
  stepName: string; // ej: "Limpieza", "Tratamiento", "Protección"
  productId: string;
  reason: string;
}

export interface AiRoutineRecommendation {
  skinSummary: string;
  morningRoutine: RoutineStep[];
  nightRoutine: RoutineStep[];
  dermatologistTip: string;
}
