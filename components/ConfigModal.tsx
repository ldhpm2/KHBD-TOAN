
import React, { useState, useEffect } from 'react';
import { getAIConfig, saveAIConfig, AIConfig } from '../services/configService';
import { InfoIcon } from './icons/InfoIcon';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AIConfig>({ apiKey: '', model: 'gemini-3-flash-preview' });

  useEffect(() => {
    if (isOpen) {
      setConfig(getAIConfig());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveAIConfig(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            <h2 className="text-2xl font-bold">Cấu hình AI Assistant</h2>
          </div>
          <p className="text-emerald-50/80">Thiết lập kết nối để sử dụng tính năng tạo giáo án</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Google Gemini API Key <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
              </div>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="Nhập API Key của bạn..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            
            <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <div className="text-blue-500 shrink-0">
                <InfoIcon />
              </div>
              <div className="text-sm text-blue-700">
                <p className="font-bold mb-1">Chưa có API Key?</p>
                <p>Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google AI Studio</a> để lấy key miễn phí.</p>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Chọn Model AI (Ưu tiên)
            </label>
            <div className="space-y-3">
              {/* Gemini 3 Flash */}
              <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${config.model === 'gemini-3-flash-preview' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${config.model === 'gemini-3-flash-preview' ? 'border-emerald-500' : 'border-slate-300'}`}>
                      {config.model === 'gemini-3-flash-preview' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Gemini 3 Flash (Preview)</p>
                      <p className="text-xs text-slate-500">Nhanh nhất, tiết kiệm (Khuyên dùng)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded uppercase tracking-wider">Default</span>
                  <input
                    type="radio"
                    className="hidden"
                    name="model"
                    checked={config.model === 'gemini-3-flash-preview'}
                    onChange={() => setConfig({ ...config, model: 'gemini-3-flash-preview' })}
                  />
                </div>
              </label>

              {/* Gemini 3 Pro */}
              <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${config.model === 'gemini-3-pro-preview' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${config.model === 'gemini-3-pro-preview' ? 'border-emerald-500' : 'border-slate-300'}`}>
                    {config.model === 'gemini-3-pro-preview' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Gemini 3 Pro (Preview)</p>
                    <p className="text-xs text-slate-500">Cân bằng tốc độ và chất lượng</p>
                  </div>
                  <input
                    type="radio"
                    className="hidden"
                    name="model"
                    checked={config.model === 'gemini-3-pro-preview'}
                    onChange={() => setConfig({ ...config, model: 'gemini-3-pro-preview' })}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
          >
            Lưu Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
};
