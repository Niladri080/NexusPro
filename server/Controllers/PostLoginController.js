import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let cachedTip = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
let cachedSuggestions = null;
let suggestionsCacheTime = 0;
const SUGGESTIONS_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
let cachedCurrentAffairs = null;
let currentAffairsCacheTime = 0;
const CURRENT_AFFAIRS_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
export const get_tip = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedTip && now - cacheTime < CACHE_DURATION) {
      return res.status(200).json({ success: true, message: cachedTip });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
    Give me one short, practical and motivational tech tip of the day for developers.
    Keep it under 20 words.
    Example: "Write tests first to avoid future bugs."
    `;
    const result = await model.generateContent(prompt);
    const tip = result.response.candidates[0].content.parts[0].text;
    cachedTip = tip;
    cacheTime = now;
    res.status(200).json({ success: true, message: tip });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Stay curious and keep learning!" });
  }
};
export const aiSuggestions = async (req, res) => {
  try {
    const now = Date.now();
    if (
      cachedSuggestions &&
      now - suggestionsCacheTime < SUGGESTIONS_CACHE_DURATION
    ) {
      return res
        .status(200)
        .json({ success: true, message: cachedSuggestions });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const suggestionsPrompt = `
Generate a JSON array of 4 AI-powered career suggestions for a tech professional.
Each object in the array should have the following properties and follow the specified format:

1.  "title": A short, compelling title (e.g., "Market Trending Skills").
2.  "category": A brief category for the suggestion (e.g., "Skills Intelligence", "Networking Opportunity").
3.  "description": A concise, actionable description of the suggestion.
4.  "buttonText": A short call-to-action string (e.g., "Start Learning", "Register Now").
5.  "secondaryButton": A secondary call-to-action string (e.g., "View Trends", "Learn More").
6.  "stats": An array of 3 objects, each with a "value" (string) and "label" (string). The stats should be relevant to the suggestion (e.g., {"value": "+25%", "label": "Demand"}).
7.Provide the valid and working link for buttonText where user can access
8.Provide the valid and working website link  for secondary button where user can navigate through

Ensure the entire output is a single, valid JSON array and nothing else. Do not include any introductory or concluding text. The entire response must be parsable as a JSON object.
`;
    const result = await model.generateContent(suggestionsPrompt);
    const suggestions = result.response.candidates[0].content.parts[0].text;
    console.log(suggestions)
    cachedSuggestions = suggestions;
    suggestionsCacheTime = now;
    res.status(200).json({ success: true, message: suggestions });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "No suggestions available at the moment." });
  }
};
export const currentAffairs = async (req, res) => {
  try {
    const now = Date.now();
    if (
      cachedCurrentAffairs &&
      now - currentAffairsCacheTime < CURRENT_AFFAIRS_CACHE_DURATION
    ) {
      return res.status(200).json({ message: cachedCurrentAffairs });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt =
      "Retrieve the 4 latest tech-related current affairs. The response must be a JSON array of objects. Each object should represent a single news article and contain the following fields: 'title' (string), 'source' (string), and 'time' (string, indicating how long ago the article was published, e.g., '2h ago', '1d ago').";
    const result = await model.generateContent(prompt);
    const affairs = result.response.candidates[0].content.parts[0].text;
    cachedCurrentAffairs = affairs;
    currentAffairsCacheTime = now;
    res.status(200).json({ message: affairs });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "No current affairs available at the moment." });
  }
};
