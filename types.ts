
import React from 'react';

export interface LessonPlanFormData {
  lessonTitle: string;
  grade: string;
  duration: string;
  learningOutcomes: string;
  includeReinforcementQuestions: boolean;
  includeTeachingMethods: boolean;
  includeGames: boolean;
  includeDigitalCompetence: boolean;
  includeAICompetence: boolean;
  isAdvancedTopic: boolean;
  includeExercises: boolean; // Thêm tùy chọn tạo bài tập
}

export interface LessonPlanFormProps {
  formData: LessonPlanFormData;
  setFormData: React.Dispatch<React.SetStateAction<LessonPlanFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  clearForm: () => void;
}

export interface LessonPlanDisplayProps {
  plan: string;
  isLoading: boolean;
  formData: LessonPlanFormData;
}
