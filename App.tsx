
import React, { useState, useCallback } from 'react';
import { LessonPlanFormData } from './types';
import { generateLessonPlan } from './services/geminiService';
import Header from './components/Header';
import LessonPlanForm from './components/LessonPlanForm';
import LessonPlanDisplay from './components/LessonPlanDisplay';

const App: React.FC = () => {
  const initialFormData: LessonPlanFormData = {
    lessonTitle: '',
    grade: '12',
    duration: '2',
    learningOutcomes: '',
    includeReinforcementQuestions: true,
    includeTeachingMethods: true,
    includeGames: false,
    includeDigitalCompetence: true,
    includeAICompetence: false,
    isAdvancedTopic: false,
    includeExercises: true, // Bật mặc định tùy chọn tạo bài tập
  };

  const [formData, setFormData] = useState<LessonPlanFormData>(initialFormData);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGeneratePlan = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.learningOutcomes || !formData.lessonTitle) {
      setError('Vui lòng nhập Tên bài soạn và Yêu cầu cần đạt.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedPlan('');

    try {
      const plan = await generateLessonPlan(formData);
      setGeneratedPlan(plan);
    } catch (err) {
      console.error(err);
      setError('Đã có lỗi xảy ra khi tạo kế hoạch bài dạy. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const clearAll = useCallback(() => {
    setFormData(initialFormData);
    setGeneratedPlan('');
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="flex flex-col gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Thông tin giáo án</h2>
            <LessonPlanForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleGeneratePlan}
              isLoading={isLoading}
              clearForm={clearAll}
            />
          </div>
          
          <div>
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md" role="alert"><p>{error}</p></div>}
            <LessonPlanDisplay plan={generatedPlan} isLoading={isLoading} formData={formData} />
          </div>
        </div>
      </main>
      <footer className="text-center p-6 bg-white border-t border-slate-200 text-slate-500 text-sm">
        <p>
          App được tạo bởi Google AI Studio - Tác giả: <span className="font-medium text-indigo-600">Lương Đình Hùng<span - Zalo: 0986.282.414
        </p>
      </footer>
    </div>
  );
};

export default App;
