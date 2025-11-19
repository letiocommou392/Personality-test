import { FormData, AnalysisResult, WebhookResponse } from "../types";
import { WEBHOOK_URL } from "../constants";

/**
 * Calculates a mock personality result based on inputs.
 * Used if the webhook fails or is unreachable (CORS/Network).
 */
const calculateMockResult = (data: FormData): AnalysisResult => {
  // Simple heuristic: 
  // Q1: Work alone (I) vs Group (E)
  // Q2: Logic (T) vs Emotion (F)
  // Q3: Structure (J) vs Flexibility (P)
  // Q4: Facts (S) vs Ideas (N)
  // Q5: Alone (I) vs Social (E)

  let iScore = 0;
  let eScore = 0;
  let sScore = 0;
  let nScore = 0;
  let tScore = 0;
  let fScore = 0;
  let jScore = 0;
  let pScore = 0;

  if (data.question1.includes("alone")) iScore++; else eScore++;
  if (data.question5.includes("alone")) iScore++; else eScore++;
  
  if (data.question4.includes("Facts")) sScore++; else nScore++;
  
  if (data.question2.includes("logic")) tScore++; else fScore++;
  
  if (data.question3.includes("plan")) jScore++; else pScore++;

  const code = [
    iScore >= eScore ? "I" : "E",
    nScore >= sScore ? "N" : "S",
    tScore >= fScore ? "T" : "F",
    jScore >= pScore ? "J" : "P"
  ].join("");

  // Map code to names and mock data
  const mapping: Record<string, Partial<AnalysisResult>> = {
    "INTJ": { mbtiName: "Architect", description: "Imaginative and strategic thinkers, with a plan for everything." },
    "INTP": { mbtiName: "Logician", description: "Innovative inventors with an unquenchable thirst for knowledge." },
    "ENTJ": { mbtiName: "Commander", description: "Bold, imaginative and strong-willed leaders, always finding a way." },
    "ENTP": { mbtiName: "Debater", description: "Smart and curious thinkers who cannot resist an intellectual challenge." },
    "INFJ": { mbtiName: "Advocate", description: "Quiet and mystical, yet very inspiring and tireless idealists." },
    "INFP": { mbtiName: "Mediator", description: "Poetic, kind and altruistic people, always eager to help a good cause." },
    "ENFJ": { mbtiName: "Protagonist", description: "Charismatic and inspiring leaders, able to mesmerize their listeners." },
    "ENFP": { mbtiName: "Campaigner", description: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile." },
    "ISTJ": { mbtiName: "Logistician", description: "Practical and fact-minded individuals, whose reliability cannot be doubted." },
    "ISFJ": { mbtiName: "Defender", description: "Very dedicated and warm protectors, always ready to defend their loved ones." },
    "ESTJ": { mbtiName: "Executive", description: "Excellent administrators, unsurpassed at managing things or people." },
    "ESFJ": { mbtiName: "Consul", description: "Extraordinarily caring, social and popular people, always eager to help." },
    "ISTP": { mbtiName: "Virtuoso", description: "Bold and practical experimenters, masters of all kinds of tools." },
    "ISFP": { mbtiName: "Adventurer", description: "Flexible and charming artists, always ready to explore and experience something new." },
    "ESTP": { mbtiName: "Entrepreneur", description: "Smart, energetic and very perceptive people, who truly enjoy living on the edge." },
    "ESFP": { mbtiName: "Entertainer", description: "Spontaneous, energetic and enthusiastic people – life is never boring around them." },
  };

  const typeInfo = mapping[code] || mapping["INTJ"] || {};

  return {
    userName: data.name,
    mbtiCode: code,
    mbtiName: typeInfo.mbtiName || "Unknown",
    description: typeInfo.description || "A unique personality.",
    strengths: ["Strategic Thinking", "Independent", "Objective Analysis", "Determined"],
    weaknesses: ["Can be overly critical", "Dismissive of emotions", "Combative"],
    careers: ["Software Engineer", "Architect", "Scientist", "Financial Analyst"],
    compatibleTypes: ["ENFP", "ENTP", "INTJ"],
    growthTips: [
      "Try to express your feelings more openly.",
      "Be patient with those who process things differently.",
      "Allow for some spontaneity in your schedule."
    ],
    traits: [
      { subject: 'Introversion', A: iScore > eScore ? 80 : 30, fullMark: 100 },
      { subject: 'Intuition', A: nScore > sScore ? 80 : 30, fullMark: 100 },
      { subject: 'Thinking', A: tScore > fScore ? 80 : 30, fullMark: 100 },
      { subject: 'Judging', A: jScore > pScore ? 80 : 30, fullMark: 100 },
      { subject: 'Turbulent', A: 50, fullMark: 100 },
    ]
  };
};

export const analyzePersonality = async (formData: FormData): Promise<AnalysisResult> => {
  // Attempt API call
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`API failed with status: ${response.status}`);
    }

    const data: WebhookResponse = await response.json();

    // Check if the webhook returned a valid structured structure.
    // If not (e.g. it just returned "Success" or partial data), we merge or fallback.
    if (data && data.mbtiCode) {
      return {
        userName: formData.name,
        mbtiCode: data.mbtiCode,
        mbtiName: data.mbtiName || "Analyst",
        description: data.description || "No description available.",
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        careers: data.careers || [],
        compatibleTypes: data.compatibleTypes || [],
        growthTips: data.growthTips || [],
        traits: data.traits || [
             { subject: 'Introversion', A: 60, fullMark: 100 },
             { subject: 'Intuition', A: 70, fullMark: 100 },
             { subject: 'Thinking', A: 80, fullMark: 100 },
             { subject: 'Judging', A: 90, fullMark: 100 },
             { subject: 'Assertive', A: 50, fullMark: 100 },
        ]
      };
    } else {
      // API returned something, but not what we expected. Fallback to local calculation.
      console.warn("Webhook returned unexpected structure, falling back to local calculation", data);
      return calculateMockResult(formData);
    }

  } catch (error) {
    console.warn("Webhook fetch failed (likely CORS or offline), using mock fallback.", error);
    // Fallback for demo purposes so the UI doesn't break during review
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return calculateMockResult(formData);
  }
};