import mongoose from "mongoose";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ques } from "../Models/QuesModel.js";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fetchAndSaveQuestion = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `**Role:** You are an AI expert tasked with creating daily technical quizzes for a community of software developers and tech enthusiasts.

**Task:** Generate a single, high-quality Multiple Choice Question (MCQ) on a relevant and interesting technical topic. The output must be a single, valid JSON object and nothing else.

**Instructions:**
1.  **Question:** Formulate a clear and concise question about a concept in software engineering, programming languages, web development, data structures, or algorithms.
2.  **Options:** Provide exactly four possible answers. One must be correct, and the other three should be plausible but incorrect distractors.
3.  **Correct Answer:** Identify the correct option using its 0-based index.
4.  **Explanation:** Write a brief explanation (under 30 words).
5.  **Format:** Ensure the final output is only the JSON object, with no extra text.

**JSON Output Structure:**
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "integer",
  "explanation": "string",
  "topic": "string"
}
`;

    const result = await model.generateContent(prompt);
    if (!result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("AI response malformed");
    }
    const generatedText = result.response.candidates[0].content.parts[0].text;
    const cleaned = generatedText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    await Ques.deleteMany({});
    const newQuestion = new Ques({
      question: parsed.question,
      options: parsed.options,
      correctAnswer: parsed.correctAnswer,
      explanation: parsed.explanation,
      topic: parsed.topic,
      answeredBy: [],
    });
    await newQuestion.save();
    console.log("✅ New question saved:", parsed.question);
  } catch (err) {
    console.error("❌ Cron job failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fetchAndSaveQuestion();
