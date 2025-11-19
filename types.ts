export interface FormData {
  name: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
}

export interface PersonalityQuestion {
  id: keyof FormData;
  text: string;
  options: [string, string];
}

export interface AnalysisResult {
  userName: string;
  mbtiCode: string;
  mbtiName: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  compatibleTypes: string[];
  growthTips: string[];
  traits: {
    subject: string;
    A: number;
    fullMark: number;
  }[];
}

export interface WebhookResponse {
  // This attempts to type the potential response from n8n, 
  // though we will likely map it to AnalysisResult carefully.
  [key: string]: any;
}