import { PersonalityQuestion } from "./types";

export const WEBHOOK_URL = "https://n8n.dipakreddy.com/webhook-test/e82e0c96-2ae0-4bee-b7cd-06606ded59ca";

export const QUESTIONS: PersonalityQuestion[] = [
  {
    id: "question1",
    text: "How do you prefer to work?",
    options: [
      "I prefer working alone and focusing deeply",
      "I thrive in group settings and collaborative work"
    ]
  },
  {
    id: "question2",
    text: "How do you make decisions?",
    options: [
      "I rely on logic and objective analysis",
      "I consider emotions and how it affects people"
    ]
  },
  {
    id: "question3",
    text: "How do you approach tasks?",
    options: [
      "I plan everything in advance with clear structure",
      "I prefer flexibility and spontaneity"
    ]
  },
  {
    id: "question4",
    text: "What do you focus on?",
    options: [
      "Facts, details, and practical matters",
      "Ideas, concepts, and possibilities"
    ]
  },
  {
    id: "question5",
    text: "What energizes you?",
    options: [
      "Spending time alone to recharge",
      "Social interactions and meeting people"
    ]
  }
];