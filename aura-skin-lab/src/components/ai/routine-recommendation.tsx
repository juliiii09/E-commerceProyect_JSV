import React from 'react';
import { AiRoutineRecommendation } from '@/types/ai';

export const RoutineRecommendation: React.FC<{ recommendation: AiRoutineRecommendation }> = ({ recommendation }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <h4 className="text-sm font-semibold text-emerald-900">Diagnóstico:</h4>
        <p className="text-xs text-emerald-800 mt-1">{recommendation.skinSummary}</p>
      </div>
      {/* Declaración del componente de rutina matutina y nocturna */}
    </div>
  );
};
