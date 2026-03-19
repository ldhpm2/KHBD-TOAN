
import React, { useState, useEffect, useRef } from 'react';
import { LessonPlanDisplayProps } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { CopyIcon } from './icons/CopyIcon';
import { ExportIcon } from './icons/ExportIcon';
import { PdfIcon } from './icons/PdfIcon';
import { EditIcon } from './icons/EditIcon';
import { InfoIcon } from './icons/InfoIcon';
import { BoldIcon, ItalicIcon, ListIcon, H1Icon, H2Icon, H3Icon, MathIcon, MathBlockIcon, UndoIcon, RedoIcon } from './icons/EditorIcons';
import * as docx from 'docx';
import saveAs from 'file-saver';
import { marked } from 'marked';

const mathExtension: any = {
  name: 'math',
  level: 'inline',
  start(src: string) { return src.indexOf('$'); },
  tokenizer(src: string) {
    const rule = /^\$\$([\s\S]+?)\$$|^\$([^\$\n]+?)\$/;
    const match = rule.exec(src);
    if (match) {
      return { type: 'math', raw: match[0], text: match[1] || match[2], displayMode: !!match[1] };
    }
  },
  renderer(token: any) {
    return token.displayMode ? `\n$$${token.text}$$\n` : `$${token.text}$`;
  }
};

marked.use({ extensions: [mathExtension] });

const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ plan, isLoading, formData }) => {
  const [editablePlan, setEditablePlan] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setEditablePlan(plan); }, [plan]);

  // MathJax re-rendering logic
  useEffect(() => {
    if (activeTab === 'preview' && editablePlan && !isLoading && contentRef.current) {
      const mathJax = (window as any).MathJax;
      if (mathJax && mathJax.typesetPromise) {
        const timer = setTimeout(() => {
          try {
            mathJax.typesetClear([contentRef.current]);
            mathJax.typesetPromise([contentRef.current]);
          } catch (e) { console.error(e); }
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [editablePlan, isLoading, activeTab]);

  useEffect(() => {
    if (copyStatus === 'copied') {
      const timer = setTimeout(() => setCopyStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(editablePlan.replace(/!\[.*?\]\(.*?\)/g, '')).then(() => setCopyStatus('copied'));
  };

  const exportToPdf = () => { window.print(); };

  // Advanced Toolbar Insertion
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    // const selectedText = text.substring(start, end);

    // Sử dụng document.execCommand để hỗ trợ Undo/Redo của trình duyệt
    document.execCommand('insertText', false, before + text.substring(start, end) + after);
    
    // Restore cursor / selection (Cần tính toán lại vị trí vì text đã thay đổi)
    // Tuy nhiên execCommand thường đặt con trỏ ở cuối text vừa insert
    // Chúng ta có thể set lại thủ công nếu cần
    setTimeout(() => {
       textarea.focus();
       // textarea.setSelectionRange(start + before.length, end + before.length); // Tùy chọn
    }, 0);
  };

  const performAction = (command: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      document.execCommand(command, false);
    }
  }

  const handleExportWord = async (mode: 'text' | 'equation') => {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Math: DocxMath, MathRun } = docx;
      
      const paragraphs: any[] = [];
      const lines = editablePlan.split('\n');

      lines.forEach(line => {
        if (line.trim() === '') {
            paragraphs.push(new Paragraph({ children: [] }));
            return;
        }

        const indent = line.search(/\S|$/);
        let currentLine = line.trim();

        let headingLevel: any = undefined;
        let bulletLevel: number | undefined = undefined;
        let alignment: any = AlignmentType.JUSTIFIED;
        let isBold = false;

        // Logic xử lý đặc biệt cho phần Header để giống mẫu 5512
        if (currentLine.startsWith('# ')) { 
            // TÊN BÀI DẠY
            headingLevel = HeadingLevel.HEADING_1; 
            currentLine = currentLine.substring(2).trim(); 
            alignment = AlignmentType.CENTER; 
        }
        else if (currentLine.startsWith('**Môn học') || currentLine.startsWith('**Thời gian')) {
            // Dòng Môn học và Thời gian thực hiện (Căn giữa, đậm)
            alignment = AlignmentType.CENTER;
        }
        else if (currentLine.startsWith('## ')) { 
            headingLevel = HeadingLevel.HEADING_2; 
            currentLine = currentLine.substring(3).trim(); 
            alignment = AlignmentType.LEFT; 
        }
        else if (currentLine.startsWith('### ')) { 
            headingLevel = HeadingLevel.HEADING_3; 
            currentLine = currentLine.substring(4).trim(); 
            alignment = AlignmentType.LEFT; 
        }
        
        if (!headingLevel && (currentLine.startsWith('- ') || currentLine.startsWith('* '))) {
            bulletLevel = Math.floor(indent / 2); 
            currentLine = currentLine.substring(2).trim();
            alignment = AlignmentType.LEFT;
        }
        
        const textWithoutImages = currentLine.replace(/!\[.*?\]\(.*?\)/g, '[Hình ảnh]');
        const parts = textWithoutImages.split(/(\$\$.*?\$\$|\$.*?\$)/g);
        const children: any[] = [];

        parts.forEach(part => {
          if (!part) return;

          if (part.startsWith('$$') && part.endsWith('$$')) {
            // Block Math
            const mathText = part.substring(2, part.length - 2).trim();
            if (children.length > 0) {
                paragraphs.push(new Paragraph({
                    children: [...children],
                    heading: headingLevel,
                    spacing: { before: 120, after: 120, line: 360 },
                    alignment: alignment,
                    bullet: bulletLevel !== undefined ? { level: bulletLevel } : undefined,
                }));
                children.length = 0;
            }
            
            // Push Math Paragraph
            if (mode === 'equation') {
               paragraphs.push(new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new DocxMath({ children: [new MathRun(mathText)] })],
                  spacing: { before: 200, after: 200 }
               }));
            } else {
               paragraphs.push(new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `$$${mathText}$$`, font: "Times New Roman" })],
                  spacing: { before: 200, after: 200 }
               }));
            }

          } else if (part.startsWith('$') && part.endsWith('$')) {
            // Inline Math
            const mathText = part.substring(1, part.length - 1).trim();
            if (mode === 'equation') {
               children.push(new DocxMath({ children: [new MathRun(mathText)] }));
            } else {
               children.push(new TextRun({ text: `$${mathText}$`, font: "Times New Roman" }));
            }
          } else {
            // Normal Text with potential bold/italic
            const boldParts = part.split(/(\*\*.*?\*\*|\*.*?\*)/g);
            boldParts.forEach(bPart => {
              if (bPart.startsWith('**') && bPart.endsWith('**')) {
                children.push(new TextRun({ text: bPart.substring(2, bPart.length - 2), bold: true, font: "Times New Roman" }));
              } else if (bPart.startsWith('*') && bPart.endsWith('*')) {
                children.push(new TextRun({ text: bPart.substring(1, bPart.length - 1), italics: true, font: "Times New Roman" }));
              } else if (bPart.length > 0) {
                children.push(new TextRun({ text: bPart, bold: !!headingLevel, font: "Times New Roman" }));
              }
            });
          }
        });

        if (children.length > 0) {
          paragraphs.push(new Paragraph({
            children: children,
            heading: headingLevel,
            spacing: { before: 120, after: 120, line: 360 },
            alignment: alignment,
            bullet: bulletLevel !== undefined ? { level: bulletLevel } : undefined,
          }));
        }
      });

      const doc = new Document({
        styles: { default: { document: { run: { font: "Times New Roman", size: 26 } } } },
        sections: [{
          children: [
            ...paragraphs
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const safeTitle = formData.lessonTitle.replace(/[^a-z0-9]/gi, '_') || 'GiaoAn';
      const typeStr = mode === 'equation' ? '_Equation' : '_Chuan';
      saveAs(blob, `GiaoAn_${safeTitle}${typeStr}.docx`);
    } catch (e) {
      console.error("Export Error:", e);
      alert("Lỗi xuất file. Vui lòng thử lại với chế độ khác.");
    }
  };

  if (isLoading) return <div className="flex flex-col items-center justify-center h-96"><LoadingSpinner /><p className="mt-6 text-slate-600 animate-pulse font-semibold text-lg">Đang thiết kế giáo án thông minh...</p></div>;
  if (!editablePlan) return <div className="flex flex-col items-center justify-center h-96 text-center bg-white p-10 rounded-3xl shadow-sm border-2 border-dashed border-slate-200"><div className="bg-indigo-50 p-6 rounded-full mb-6"><span className="text-6xl" role="img" aria-label="sparkles">🎓</span></div><h3 className="text-2xl font-black text-slate-800">Chưa có bản thảo</h3><p className="text-slate-500 mt-2 max-w-sm text-lg">Nhập thông tin bài học và để AI giúp bạn hoàn thiện giáo án.</p></div>;

  const htmlContent = marked.parse(editablePlan);

  return (
    <div className="mt-12 no-print">
      <style>{`@media print { body * { visibility: hidden; } .print-content, .print-content * { visibility: visible; } .print-content { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; border: none !important; box-shadow: none !important; } .no-print { display: none !important; } } .prose h1 { text-align: center; text-transform: uppercase; margin-bottom: 0.5rem; } .prose strong { color: #000; } .prose > p:nth-of-type(1), .prose > p:nth-of-type(2) { text-align: center; font-weight: bold; margin-top: 0; }`}</style>
      
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center self-start">
           <div className="w-2 h-10 bg-indigo-600 rounded-full mr-4"></div>
           <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Giáo án của bạn</h2>
             <p className="text-sm text-slate-500">Xem trước, chỉnh sửa và xuất bản</p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
           {/* Tab Switcher */}
           <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
              <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}>Xem trước</button>
              <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center ${activeTab === 'edit' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}><EditIcon /><span className="ml-1.5">Chỉnh sửa</span></button>
           </div>
           
           <div className="h-6 w-px bg-slate-300 mx-1"></div>

           {/* Export Actions */}
           <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Sao chép nội dung"><CopyIcon /></button>
           <button onClick={exportToPdf} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="In / Lưu PDF"><PdfIcon /></button>
           
           {/* Separate Export Buttons */}
           <button 
                onClick={() => handleExportWord('text')} 
                className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-200 transition whitespace-nowrap"
                title="Tải file Word định dạng Latex ($...$). Tương thích tốt nhất."
            >
                <ExportIcon /> <span className="ml-2">Tải Word (LaTeX)</span>
            </button>

            <button 
                onClick={() => handleExportWord('equation')} 
                className="flex items-center px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-md shadow-teal-200 transition whitespace-nowrap"
                title="Tải file Word định dạng Equation (Beta)"
            >
                <ExportIcon /> <span className="ml-2">Tải Word (Equation)</span>
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[800px]">
        {activeTab === 'preview' ? (
          <div 
            ref={contentRef}
            className="bg-white p-12 md:p-16 rounded shadow-xl border border-slate-200 prose prose-slate prose-lg max-w-none 
            prose-headings:text-slate-900 prose-headings:font-bold prose-headings:font-times
            prose-p:font-times prose-p:text-justify
            prose-li:font-times prose-li:text-justify
            prose-strong:text-slate-900
            print-content font-times mx-auto w-full md:w-[210mm] min-h-[297mm]"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[800px]">
            {/* Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 select-none">
               <div className="flex gap-1 pr-2 border-r border-slate-300">
                  <button onClick={() => performAction('undo')} className="p-2 hover:bg-white hover:text-indigo-600 rounded text-slate-600 transition" title="Hoàn tác (Undo)"><UndoIcon /></button>
                  <button onClick={() => performAction('redo')} className="p-2 hover:bg-white hover:text-indigo-600 rounded text-slate-600 transition" title="Làm lại (Redo)"><RedoIcon /></button>
               </div>
               <div className="flex gap-1 px-2 border-r border-slate-300">
                  <button onClick={() => insertText('**', '**')} className="p-2 hover:bg-white hover:text-indigo-600 rounded text-slate-600 transition" title="In đậm"><BoldIcon /></button>
                  <button onClick={() => insertText('*', '*')} className="p-2 hover:bg-white hover:text-indigo-600 rounded text-slate-600 transition" title="In nghiêng"><ItalicIcon /></button>
               </div>
               <div className="flex gap-1 px-2 border-r border-slate-300">
                  <button onClick={() => insertText('# ')} className="p-2 hover:bg-white hover:text-indigo-600 rounded text-slate-600 transition" title="Tiêu đề 1"><H1Icon /></button>
                  <button onClick={() => insertText('## ')} className="p-2 hover:bg-white hover:text-indigo-600 rounded text-slate-600 transition" title="Tiêu đề 2"><H2Icon /></button>
                  <button onClick={() => insertText('### ')} className="p-2 hover:bg-white hover:text-indigo-600 rounded text-slate-600 transition" title="Tiêu đề 3"><H3Icon /></button>
               </div>
               <div className="flex gap-1 px-2 border-r border-slate-300">
                   <button onClick={() => insertText('- ')} className="p-2 hover:bg-white hover:text-indigo-600 rounded text-slate-600 transition" title="Danh sách"><ListIcon /></button>
               </div>
               <div className="flex gap-1 px-2 border-r border-slate-300">
                  <button onClick={() => insertText('$ ', ' $')} className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded text-slate-600 transition flex items-center gap-1 font-bold text-xs" title="Công thức toán (trong dòng)"><MathIcon /> Inline</button>
                  <button onClick={() => insertText('\n$$ ', ' $$\n')} className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded text-slate-600 transition flex items-center gap-1 font-bold text-xs" title="Công thức toán (riêng biệt)"><MathBlockIcon /> Block</button>
               </div>
               <div className="ml-auto text-xs text-slate-400 font-medium px-2 hidden sm:block">
                  Markdown Editor
               </div>
            </div>
            
            {/* Textarea */}
            <textarea 
              ref={textareaRef}
              value={editablePlan} 
              onChange={(e) => setEditablePlan(e.target.value)} 
              className="flex-grow w-full p-8 text-slate-800 font-mono text-sm leading-relaxed border-none focus:ring-0 resize-none outline-none bg-slate-50/30"
              placeholder="Nội dung giáo án..."
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlanDisplay;
