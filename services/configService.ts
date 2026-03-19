
export interface AIConfig {
  apiKey: string;
  model: string;
}

const CONFIG_KEY = 'ai_assistant_config';

export const getAIConfig = (): AIConfig => {
  const savedConfig = localStorage.getItem(CONFIG_KEY);
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error('Failed to parse AI config', e);
    }
  }
  return {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-3-flash-preview',
  };
};

export const saveAIConfig = (config: AIConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};
