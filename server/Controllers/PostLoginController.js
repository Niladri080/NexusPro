import { Clerk } from "@clerk/clerk-sdk-node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { Roadmap } from "../Models/RoadmapModel.js";
import PdfParse from "pdf-parse";
import fs from "fs";
import { Reusme } from "../Models/ResumeModel.js";
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
let cachedResources=null;
let ResourcesCacheTime=0;
const RESOURCE_CACHE_DURATION = 24*60 * 60 * 1000;
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
export const RoadmapGen = async (req, res) => {
  try {
    const { description } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an expert career advisor. Your task is to create a detailed, step-by-step learning roadmap based on the user's desired career path. The output MUST be a valid JSON object that strictly follows the provided schema.

The JSON object must contain two top-level keys: role and roadmap.

The role key's value should be a concise, lowercase, hyphenated string representing the career path (e.g., "software-engineer", "frontend-developer").

The roadmap key's value should be an array of step objects.

Each step object in the roadmap array must contain the following five properties:

id: A unique sequential integer for the step, starting from 1.

title: A concise string for the step's title.

description: A short string explaining what the step involves.

duration: A string estimating the time to complete the step (e.g., "4-6 weeks").

completed: A boolean value, which must always be false.

link: Link of resource for the particular step

Here is the user's career goal: ${description}`;
    const result = await model.generateContent(prompt);
    res
      .status(200)
      .json({ message: result.response.candidates[0].content.parts[0].text });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
export const SaveRoadmap = async (req, res) => {
  try {
    const { role, roadmap, user } = req.body;
    const newData = new Roadmap({
      userId: user.id,
      role: role,
      roadmap: roadmap,
    });
    await newData.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err.message);
  }
};
export const fetchRoadmap = async (req, res) => {
  try {
    const { userId } = req.body;
    const results = await Roadmap.findOne({ userId: userId });
    if (!results) {
      return res.status(500).json({ message: "Can't find details" });
    }
    res.status(200).json({
      roadmap: results.roadmap,
      currentIndex: results.currentIndex,
      hasCompleted: results.hasCompleted,
    });
  } catch (err) {
    res.status(500);
    console.log(err.message);
  }
};
export const getUserRoadmap = async (req, res) => {
  try {
    const { userId } = req.query;
    const roadmap = await Roadmap.findOne({ userId });

    if (!roadmap) {
      return res.status(404).json({ message: "No roadmap found" });
    }

    res.status(200).json(roadmap);
  } catch (err) {
    console.error("Error fetching roadmap:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteRoadmap = async (req, res) => {
  try {
    const { userId } = req.body;
    await Roadmap.findOneAndDelete({ userId: userId });
    res.status(200).json({ message: "Your roadmap deleted" });
  } catch (err) {
    res.status(500).json({ message: "Data could not be fetched" });
  }
};
export const markComplete = async (req, res) => {
  try {
    const { userId, stepId } = req.body;
    const roadmapDoc = await Roadmap.findOne({ userId });
    if (!roadmapDoc) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    const stepIndex = roadmapDoc.roadmap.findIndex(
      (step) => step.id === stepId
    );
    if (stepIndex === -1) {
      return res.status(404).json({ message: "Step not found" });
    }
    roadmapDoc.roadmap[stepIndex].completed = true;
    let allCompleted = true;
    for (let i = 0; i < roadmapDoc.roadmap.length; i++) {
      if (!roadmapDoc.roadmap[i].completed) {
        roadmapDoc.currentIndex = i;
        allCompleted = false;
        break;
      }
    }
    if (allCompleted) {
      roadmapDoc.currentIndex = roadmapDoc.roadmap.length - 1;
      roadmapDoc.hasCompleted = true;
    } else {
      roadmapDoc.hasCompleted = false;
    }
    await roadmapDoc.save();
    res.status(200).json({
      success: true,
      currentIndex: roadmapDoc.currentIndex,
      hasCompleted: roadmapDoc.hasCompleted,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not mark step as completed" });
  }
};
// ...existing imports and code...

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(500).json({ message: "No files received" });
    }
    const { Role, userId } = req.body;
    const fileSize = (req.file.size / 1024).toFixed(2) + " KB";
    const fileBuffer = fs.readFileSync(req.file.path);
    const parsedPdf = await PdfParse(fileBuffer);
    const resumeText = parsedPdf.text;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const resumeAnalysisPrompt = `**Role:** You are an expert AI-powered resume analysis tool designed to help job seekers improve their resumes. Your analysis should mimic how an Applicant Tracking System (ATS) and a professional recruiter would evaluate a resume.

**Task:** Analyze the provided resume text against the provided target job role. Based on your analysis, generate a single, valid JSON object that strictly follows the specified format and logic. Do not provide any text or explanation outside of the JSON object.If the role is None then analysis according to the resume text

**JSON Output Format:**

\`\`\`json
{
  "fileName": "string",(This if the file url: /uploads/filename.pdf)
  "uploadDate": "string (YYYY-MM-DD)",
  "atsScore": "integer (0-100)",
  "fileSize": "string"(FileSize: ...),
  "analysis": {
    "strengths": [
      "string"
    ],
    "improvements": [
      "string"
    ],
    "critical": [
      "string"
    ]
  },
  "keywordMatch": "integer (0-100)",
  "formatScore": "integer (0-100)",
  "contentScore": "integer (0-100)"
}
\`\`\`

**Instructions for each field:**

* \`fileName\`: Use a placeholder name like "resume_analysis.pdf".
* \`uploadDate\`: Use the current date.
* \`fileSize\`: Use a placeholder value like "N/A".
* \`atsScore\`: Calculate an overall score from 0-100 representing the resume's general effectiveness. It should be a weighted average of the other scores.
* \`analysis\`: An object containing three arrays of strings:
    * \`strengths\`: List 3-4 key positive aspects of the resume.
    * \`improvements\`: List 3-4 actionable suggestions for enhancement.
    * \`critical\`: List 1-2 major issues that could cause the resume to be rejected. If none, return an empty array \`[]\`.
* \`keywordMatch\`: A score (0-100) reflecting how well the skills and experience on the resume match keywords for the **target job role**.
* \`formatScore\`: A score (0-100) assessing the resume's layout, readability, and ATS compatibility.
* \`contentScore\`: A score (0-100) evaluating the quality of the language, use of action verbs, and quantified achievements.
* \`suggestion:\`: A 15-20 word suggestion for the resume according to the user role.
---

**BEGIN ANALYSIS:**

**Target Job Role:**
${Role}
**Resume Text:**
${resumeText}`;
    const result = await model.generateContent(resumeAnalysisPrompt);
    const geminiResponse = result.response.candidates[0].content.parts[0].text;
    const cleaned = geminiResponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    parsed.fileSize = fileSize;
    parsed.fileName = req.file.originalname;
    parsed.suggestion = parsed.suggestion || "";

    const newResume = new Reusme({
      userId,
      atsScore: Number(parsed.atsScore),
      contentScore: Number(parsed.contentScore),
      formatScore: Number(parsed.formatScore),
      keywordMatch: Number(parsed.keywordMatch),
      fileName: parsed.fileName,
      fileSize: parsed.fileSize,
      uploadDate: parsed.uploadDate,
      analysis: parsed.analysis,
      suggestion: parsed.suggestion, // <-- add this line
    });
    await newResume.save();
    res.status(200).json({ response: JSON.stringify(parsed) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
};
export const fetchResume = async (req, res) => {
  try {
    const { userId } = req.body;
    const resume = await Reusme.findOne({ userId });
    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }
    res.status(200).json(resume);
  } catch (err) {
    console.error("Error fetching resume:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const ResubmitResume = async (req, res) => {
  try {
    const { userId } = req.body;
    await Reusme.findOneAndDelete(userId);
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Request failed" });
  }
};
export const fetchMyLearning = async (req, res) => {
  try {
    const { userId } = req.body;
    const roadmapData = await Roadmap.findOne({ userId });
    let hasRoadmap = false;
    let hasResume = false;
    let atsScore = 0;
    let percentage = 0;
    if (roadmapData && roadmapData.roadmap.length > 0) {
      const completedSteps = roadmapData.roadmap.filter(
        (step) => step.completed
      ).length;
      percentage = Math.floor(
        (completedSteps / roadmapData.roadmap.length) * 100
      );
      hasRoadmap = true;
    }
    const resumeData = await Reusme.findOne({ userId });
    if (resumeData) {
      atsScore = resumeData.atsScore;
      hasResume = true;
    }
    res.status(200).json({ percentage, atsScore, hasRoadmap, hasResume });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Data can't be fetched" });
  }
};
export const fetchResources = async (req, res) => {
  try {
    const now = Date.now();
     if (cachedResources && now - ResourcesCacheTime < RESOURCE_CACHE_DURATION) {
      return res.status(200).json({ response : cachedResources });
    }
    const { goal } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
     learning assistant that curates high-quality, real-world educational resources for tech professionals.

**Task:** Generate a list of 15-20 diverse and practical learning resources based on the user's specified goal: "${goal}". If the user's goal is "none", provide a general but valuable list of resources for a software developer.

**Instructions & Constraints:**
1.  **Output Format:** The output MUST be a single, valid JSON array of objects. Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the array.
2.  **Resource Types:** Each resource's "type" must be one of the following four strings: "course", "article", "quiz", or "video".
3.  **Working Links:** The "link" for each resource must be a real, valid, and publicly accessible URL. **DO NOT use placeholder links.** Find actual resources on platforms like YouTube, Medium, Coursera, Udemy, freeCodeCamp, etc.
4.  **Data Realism:** All data points (rating, students, etc.) should be realistic and plausible for the resource provided.
5.  **Diversity:** The list should include a mix of resource types and difficulty levels (beginner, intermediate, advanced).

**JSON Object Schema (Strictly follow this structure for each object in the array):**
\`\`\`json
{
  "id": "integer",
  "title": "string",
  "type": "string (must be 'course', 'article', 'quiz', or 'video')",
  "difficulty": "string (e.g., 'beginner', 'intermediate', 'advanced')",
  "description": "string (A concise, one-sentence description)",
  "duration": "string (e.g., '12 hours', '15 min read', '30 questions')",
  "rating": "float (e.g., 4.8)",
  "students": "integer (e.g., 45000)",
  "tags": ["array", "of", "strings"],
  "isPaid": "boolean",
  "link": "string (A valid, working URL to the resource)"
}
\`\`\`

**Example Object:**
\`\`\`json
{
  "id": 1,
  "title": "Python for Everybody - Full Course",
  "type": "course",
  "difficulty": "beginner",
  "description": "Learn the fundamentals of programming using Python 3, taught by Dr. Charles Severance.",
  "duration": "13 hours",
  "rating": 4.9,
  "students": 5000000,
  "tags": ["Python", "Programming", "Free"],
  "isPaid": false,
  "link": "https://www.youtube.com/watch?v=8DvywoWv6fI"
}
\`\`\`

Now, generate the JSON array based on the user's goal.
`;
    const result = await model.generateContent(prompt);
    const generatedText = result.response.candidates[0].content.parts[0].text;
    cachedResources = generatedText;
    ResourcesCacheTime = now;
    res.status(200).json({ response: generatedText });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Data can't be fetched" });
  }
};
export const fetchSteps=async (req,res)=>{
  
  try{
  const {userId}=req.body;
  const roadMapData=await Roadmap.findOne({userId});
  if (!roadMapData){
    return res.status(200).json({current:0,Total:0});
  }
  const current =roadMapData.currentIndex;
  const Total=roadMapData.roadmap.length;
  return res.status(200).json({current,Total});
  }
  catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Data can't be fetched" });
  }
  
}