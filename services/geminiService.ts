
import { GoogleGenAI } from "@google/genai";
import { LessonPlanFormData } from '../types';
import { aiFrameworkData } from '../data/aiFramework';
import { digitalCompetenceData } from '../data/digitalCompetence';

const getDigitalLevel = (grade: string): { level: string, description: string, autonomy: string } => {
  const g = parseInt(grade);
  if (g >= 6 && g <= 7) return { level: 'TC1', description: 'Nhiệm vụ được xác định rõ ràng và thường xuyên và các vấn đề đơn giản', autonomy: 'Tự chủ hoàn toàn' };
  if (g >= 8 && g <= 9) return { level: 'TC2', description: 'Nhiệm vụ được xác định rõ ràng và không thường xuyên', autonomy: 'Độc lập và theo nhu cầu cá nhân' };
  if (g >= 10 && g <= 12) return { level: 'NC1', description: 'Các nhiệm vụ và vấn đề khác nhau', autonomy: 'Hướng dẫn người khác' };
  return { level: 'TC1', description: '', autonomy: '' };
};

const buildPrompt = (formData: LessonPlanFormData): string => {
  const { level } = getDigitalLevel(formData.grade);
  const isHighSchool = parseInt(formData.grade) >= 10;
  const schoolLevelName = isHighSchool ? "Trung học phổ thông (THPT)" : "Trung học cơ sở (THCS)";
  
  const latexInstruction = `
LƯU Ý VỀ ĐỊNH DẠNG TOÁN HỌC (LaTeX):
- Sử dụng cặp dấu $ ... $ cho công thức trong dòng (ví dụ: $y = ax^2$).
- Sử dụng cặp dấu $$ ... $$ cho công thức riêng dòng (ví dụ: $$ \\Delta = b^2 - 4ac $$).
`;

  let digitalCompetenceInstruction = '';
  if (formData.includeDigitalCompetence) {
    const relevantSamples = digitalCompetenceData.filter(item => item["Mức độ"] === level);
    const samplesStr = relevantSamples.slice(0, 3).map(item => `- ${item["Yêu cầu cần đạt của năng lực"]} (Mã: ${item.Mã})`).join('\n');
    digitalCompetenceInstruction = `\n    - Năng lực số (Mức độ ${level}):\n${samplesStr}`;
  }

  let aiCompetenceInstruction = '';
  if (formData.includeAICompetence) {
    const relevantAIFramework = aiFrameworkData.filter(item => item.lop === `Lớp ${formData.grade}`);
    if (relevantAIFramework.length > 0) {
      const frameworkDescription = relevantAIFramework.slice(0, 2).map(item => `- ${item.noi_dung}: ${item.yeu_cau_can_dat[0]}`).join('\n');
      aiCompetenceInstruction = `\n    - Tích hợp Giáo dục AI:\n${frameworkDescription}`;
    }
  }

  let exercisesInstruction = '';
  if (formData.includeExercises) {
    exercisesInstruction = `
- Trong "Hoạt động 3: Luyện tập", hãy đưa ra 3-5 bài tập cụ thể có lời giải chi tiết.
`;
  }

  return `
Bạn là chuyên gia giáo dục, hãy soạn Kế hoạch bài dạy (Giáo án) môn Toán lớp ${formData.grade} theo đúng mẫu **Phụ lục IV - Công văn 5512/BGDĐT-GDTrH**.

**THÔNG TIN ĐẦU VÀO:**
- Bài dạy: ${formData.lessonTitle}
- Thời gian thực hiện: ${formData.duration} tiết
- Yêu cầu cần đạt: ${formData.learningOutcomes}

**CẤU TRÚC VÀ NỘI DUNG BẮT BUỘC (Trả về định dạng Markdown):**

# TÊN BÀI DẠY: ${formData.lessonTitle.toUpperCase()}
**Môn học/Hoạt động giáo dục: Toán; Lớp: ${formData.grade}**
**Thời gian thực hiện: ${formData.duration} tiết**

## I. MỤC TIÊU
1. **Năng lực**:
    - Năng lực đặc thù Toán học: (Mô tả cụ thể biểu hiện).
    - Năng lực chung: (Tự chủ và tự học, Giao tiếp và hợp tác, Giải quyết vấn đề và sáng tạo).${digitalCompetenceInstruction}${aiCompetenceInstruction}
2. **Phẩm chất**: (Chăm chỉ, Trung thực, Trách nhiệm... gắn với nội dung bài học).

## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
- Giáo viên: (SGK, Kế hoạch bài dạy, thước, phấn màu, bảng phụ/máy chiếu...).
- Học sinh: (SGK, vở ghi, dụng cụ học tập...).

## III. TIẾN TRÌNH DẠY HỌC
(Thiết kế đủ 4 hoạt động sau đây. Với mỗi hoạt động, trình bày rõ 4 mục a, b, c, d)

### 1. Hoạt động 1: Xác định vấn đề/Nhiệm vụ học tập/Mở đầu
a) **Mục tiêu**: (Tạo tâm thế, gợi nhu cầu nhận thức...).
b) **Nội dung**: (Tình huống, câu hỏi, trò chơi khởi động...).
c) **Sản phẩm**: (Câu trả lời, kết quả của HS).
d) **Tổ chức thực hiện**: (Mô tả rõ 4 bước: Chuyển giao nhiệm vụ -> Thực hiện -> Báo cáo, thảo luận -> Kết luận, nhận định).

### 2. Hoạt động 2: Hình thành kiến thức mới/Giải quyết vấn đề
a) **Mục tiêu**: (Chiếm lĩnh kiến thức mới...).
b) **Nội dung**: (Hoạt động đọc, nghiên cứu, giải quyết nhiệm vụ...).
c) **Sản phẩm**: (Định lý, công thức, bài giải...).
d) **Tổ chức thực hiện**: (Mô tả chi tiết hoạt động của GV và HS theo 4 bước).

### 3. Hoạt động 3: Luyện tập
a) **Mục tiêu**: (Củng cố, rèn luyện kĩ năng...).
b) **Nội dung**: (Hệ thống bài tập...).
c) **Sản phẩm**: (Đáp án, lời giải chi tiết).
d) **Tổ chức thực hiện**: (GV giao bài tập, HS làm việc cá nhân/nhóm...).

### 4. Hoạt động 4: Vận dụng
a) **Mục tiêu**: (Vận dụng vào thực tiễn...).
b) **Nội dung**: (Bài toán thực tế, dự án nhỏ...).
c) **Sản phẩm**: (Kết quả giải quyết vấn đề thực tiễn).
d) **Tổ chức thực hiện**: (Giao về nhà hoặc thực hiện tại lớp nếu đủ thời gian).

${latexInstruction}
${exercisesInstruction}
**YÊU CẦU QUAN TRỌNG:**
- KHÔNG viết lời thoại (Ví dụ: "GV nói..."). Hãy mô tả hoạt động (Ví dụ: "GV giao nhiệm vụ...", "HS thực hiện...").
- Trình bày mạch lạc, rõ ràng, khoa học.
`;
};

import { getAIConfig } from './configService';

export const generateLessonPlan = async (formData: LessonPlanFormData): Promise<string> => {
  const config = getAIConfig();
  const ai = new GoogleGenAI({ apiKey: config.apiKey || process.env.API_KEY || '' });
  const prompt = buildPrompt(formData);

  try {
    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 15000 },
        temperature: 0.5
      }
    });
    return response.text || "AI không phản hồi.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Lỗi kết nối với trí tuệ nhân tạo. Vui lòng thử lại sau.");
  }
};
