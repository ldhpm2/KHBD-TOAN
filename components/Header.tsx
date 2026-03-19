
import React from 'react';

interface HeaderProps {
  onOpenConfig: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenConfig }) => {
  return (
    <header className="bg-white shadow-md border-b-4 border-indigo-600 sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
              SOẠN GIÁO ÁN TOÁN (KNTT)
            </h1>
            <p className="text-xs text-indigo-600 font-semibold flex items-center">
              <span className="bg-indigo-100 px-1.5 py-0.5 rounded mr-2 text-[10px] uppercase tracking-widest">Hỗ trợ AI</span>
              Chuẩn Phụ lục IV Công văn 5512
            </p>
          </div>
        </div>

        <button 
          onClick={onOpenConfig}
          className="p-2.5 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm flex items-center gap-2 group"
          title="Cấu hình AI"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings group-hover:rotate-90 transition-transform duration-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          <span className="hidden md:inline font-bold text-sm">Cấu hình</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
