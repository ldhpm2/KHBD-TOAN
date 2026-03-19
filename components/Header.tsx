
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-b-4 border-indigo-600">
      <div className="container mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-center text-center md:text-left">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg mb-4 md:mb-0 md:mr-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            SOẠN GIÁO ÁN TOÁN (KNTT)
          </h1>
          <p className="text-base text-indigo-600 font-semibold flex items-center justify-center md:justify-start">
            <span className="bg-indigo-100 px-2 py-0.5 rounded mr-2 text-xs uppercase tracking-widest">Hỗ trợ AI</span>
            Chuẩn Phụ lục IV Công văn 5512
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
