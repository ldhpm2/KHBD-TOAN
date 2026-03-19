
import React, { useState, useEffect } from 'react';
import { LessonPlanFormProps } from '../types';
import { GenerateIcon } from './icons/GenerateIcon';
import { ClearIcon } from './icons/ClearIcon';
import { QuestionIcon } from './icons/QuestionIcon';
import { MethodsIcon } from './icons/MethodsIcon';
import { GamesIcon } from './icons/GamesIcon';
import { DigitalIcon } from './icons/DigitalIcon';
import { AIIcon } from './icons/AIIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ExercisesIcon } from './icons/ExercisesIcon';
import { curriculumData, CurriculumItem } from '../data/curriculumData';

const LessonPlanForm: React.FC<LessonPlanFormProps> = ({ formData, setFormData, onSubmit, isLoading, clearForm }) => {
  const [suggestedLessons, setSuggestedLessons] = useState<CurriculumItem[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');

  useEffect(() => {
    const filtered = curriculumData.filter(item => item.Lớp === parseInt(formData.grade));
    setSuggestedLessons(filtered);
    setSelectedSuggestion(''); 
  }, [formData.grade]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSuggestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const title = e.target.value;
    setSelectedSuggestion(title);
    
    if (title === '') return;

    const lesson = suggestedLessons.find(l => l["Tên bài"] === title);
    if (lesson) {
      setFormData(prev => ({
        ...prev,
        lessonTitle: lesson["Tên bài"],
        learningOutcomes: lesson["Yêu cầu cần đạt"].map(y => `- ${y}`).join('\n')
      }));
    }
  };

  const isHighSchool = parseInt(formData.grade) >= 10;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
        <div>
          <label htmlFor="grade" className="block text-sm font-bold text-indigo-900 mb-1">Chọn Khối Lớp</label>
          <select
            name="grade"
            id="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white font-bold text-indigo-700"
          >
            <optgroup label="Trung học cơ sở">
              {['6', '7', '8', '9'].map(g => <option key={g} value={g}>Lớp {g}</option>)}
            </optgroup>
            <optgroup label="Trung học phổ thông">
              {['10', '11', '12'].map(g => <option key={g} value={g}>Lớp {g}</option>)}
            </optgroup>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="suggestion" className="block text-sm font-bold text-indigo-900 mb-1 flex items-center">
            Gợi ý bài học từ Chương trình (Lớp {formData.grade})
            <span className="ml-2 text-[10px] text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">Tự động nạp dữ liệu</span>
          </label>
          <select
            id="suggestion"
            value={selectedSuggestion}
            onChange={handleSuggestionChange}
            className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
          >
            <option value="">-- Chọn bài học từ danh sách mẫu --</option>
            {suggestedLessons.map((item, idx) => (
              <option key={idx} value={item["Tên bài"]}>{item["Tên bài"]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div className="sm:col-span-2">
          <label htmlFor="lessonTitle" className="block text-sm font-medium text-slate-600 mb-1">Tên bài dạy (Bạn có thể tự nhập) *</label>
          <input
            type="text"
            name="lessonTitle"
            id="lessonTitle"
            value={formData.lessonTitle}
            onChange={handleChange}
            placeholder="Ví dụ: Đạo hàm hàm số mũ"
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-slate-600 mb-1">Số tiết</label>
          <input
            type="number"
            name="duration"
            id="duration"
            min="1"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className={`${isHighSchool ? 'block' : 'hidden'}`}>
           <label className="inline-flex items-center cursor-pointer p-2.5 bg-white rounded-lg border border-slate-200 w-full hover:bg-slate-50 transition shadow-sm">
            <input
              type="checkbox"
              name="isAdvancedTopic"
              checked={formData.isAdvancedTopic && isHighSchool}
              onChange={handleChange}
              className="h-5 w-5 rounded border-slate-300 accent-indigo-600"
            />
            <span className="ml-3 text-xs font-bold text-slate-700 uppercase">Chuyên đề</span>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="learningOutcomes" className="block text-sm font-medium text-slate-600">Yêu cầu cần đạt *</label>
            <span className="text-[10px] text-slate-400 font-italic">(Chỉnh sửa trực tiếp tại đây)</span>
          </div>
          <textarea
            name="learningOutcomes"
            id="learningOutcomes"
            rows={14}
            value={formData.learningOutcomes}
            onChange={handleChange}
            placeholder="Nội dung Yêu cầu cần đạt sẽ tự động điền khi bạn chọn bài học gợi ý ở trên. Bạn cũng có thể tự nhập hoặc chỉnh sửa thêm..."
            required
            className="w-full h-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-slate-50/30"
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-slate-600 mb-2">Các tùy chọn tích hợp & củng cố</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow">
            {/* Tùy chọn */}
            <div className="relative flex items-start p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition cursor-pointer group shadow-sm">
              <div className="flex h-6 items-center"><input id="includeAICompetence" name="includeAICompetence" type="checkbox" checked={formData.includeAICompetence} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 accent-indigo-600"/></div>
              <div className="ml-3 text-sm flex items-center flex-1"><AIIcon color="#4f46e5" /><div className="ml-3"><label htmlFor="includeAICompetence" className="font-bold text-slate-700 cursor-pointer block text-xs">Năng lực AI</label><p className="text-slate-400 text-[9px] leading-tight">Khung GD AI 3439</p></div></div>
            </div>
            <div className="relative flex items-start p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-300 transition cursor-pointer group shadow-sm">
              <div className="flex h-6 items-center"><input id="includeDigitalCompetence" name="includeDigitalCompetence" type="checkbox" checked={formData.includeDigitalCompetence} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 accent-teal-600"/></div>
              <div className="ml-3 text-sm flex items-center flex-1"><DigitalIcon color="#0d9488" /><div className="ml-3"><label htmlFor="includeDigitalCompetence" className="font-bold text-slate-700 cursor-pointer block text-xs">Năng lực số</label><p className="text-slate-400 text-[9px] leading-tight">Khung NL Số 3456</p></div></div>
            </div>
            <div className="relative flex items-start p-3 bg-white rounded-xl border border-slate-200 hover:border-sky-300 transition cursor-pointer shadow-sm">
              <div className="flex h-6 items-center"><input id="includeReinforcementQuestions" name="includeReinforcementQuestions" type="checkbox" checked={formData.includeReinforcementQuestions} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 accent-sky-600"/></div>
              <div className="ml-3 text-sm flex items-center flex-1"><QuestionIcon /><div className="ml-3"><label htmlFor="includeReinforcementQuestions" className="font-bold text-slate-700 cursor-pointer text-xs">Câu hỏi củng cố</label></div></div>
            </div>
             <div className="relative flex items-start p-3 bg-white rounded-xl border border-slate-200 hover:border-rose-300 transition cursor-pointer shadow-sm">
              <div className="flex h-6 items-center"><input id="includeExercises" name="includeExercises" type="checkbox" checked={formData.includeExercises} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 accent-rose-600"/></div>
              <div className="ml-3 text-sm flex items-center flex-1"><ExercisesIcon /><div className="ml-3"><label htmlFor="includeExercises" className="font-bold text-slate-700 cursor-pointer text-xs">Bài tập & Lời giải</label></div></div>
            </div>
            <div className="relative flex items-start p-3 bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition cursor-pointer shadow-sm">
              <div className="flex h-6 items-center"><input id="includeTeachingMethods" name="includeTeachingMethods" type="checkbox" checked={formData.includeTeachingMethods} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 accent-amber-600"/></div>
              <div className="ml-3 text-sm flex items-center flex-1"><MethodsIcon /><div className="ml-3"><label htmlFor="includeTeachingMethods" className="font-bold text-slate-700 cursor-pointer text-xs">P.Pháp dạy học</label></div></div>
            </div>
            <div className="relative flex items-start p-3 bg-white rounded-xl border border-slate-200 hover:border-violet-300 transition cursor-pointer shadow-sm">
              <div className="flex h-6 items-center"><input id="includeGames" name="includeGames" type="checkbox" checked={formData.includeGames} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 accent-violet-600"/></div>
              <div className="ml-3 text-sm flex items-center flex-1"><GamesIcon /><div className="ml-3"><label htmlFor="includeGames" className="font-bold text-slate-700 cursor-pointer text-xs">Hoạt động khởi động</label></div></div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-slate-100 rounded-xl border border-slate-200">
             <div className="flex items-start gap-3">
                <InfoIcon />
                <p className="text-[11px] text-slate-500 leading-normal">
                  Hệ thống sử dụng mô hình <strong>Gemini 3 Pro</strong> thế hệ mới nhất để phân tích yêu cầu cần đạt và xây dựng tiến trình dạy học 4 bước theo 5512.
                </p>
             </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all text-xl uppercase tracking-wider"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang phân tích bài học...
            </div>
          ) : <><GenerateIcon /> TẠO KẾ HOẠCH BÀI DẠY (GIÁO ÁN)</>}
        </button>
        <button
          type="button"
          onClick={() => { clearForm(); setSelectedSuggestion(''); }}
          disabled={isLoading}
          className="w-full sm:w-1/4 flex items-center justify-center px-6 py-4 bg-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-300 transition-all border border-slate-300 shadow-sm"
        >
          <ClearIcon /> Reset Form
        </button>
      </div>
    </form>
  );
};

export default LessonPlanForm;
