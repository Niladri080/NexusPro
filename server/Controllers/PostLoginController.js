import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { Roadmap } from "../Models/RoadmapModel.js";
import PdfParse from "pdf-parse";
import fs from "fs";
import { Reusme } from "../Models/ResumeModel.js";
import { Resource } from "../Models/ResourceModel.js";
import Post from "../Models/PostModel.js";
import { Skill } from "../Models/SkillModel.js";
import { Job } from "../Models/JobModel.js";
import { Ques } from "../Models/QuesModel.js";
import { DailyUser } from "../Models/DailyUserModel.js";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let cachedTip = null;
let cacheTime = 0;
const CACHE_DURATION = 12 * 60 * 60 * 1000;
let cachedSuggestions = null;
let suggestionsCacheTime = 0;
const SUGGESTIONS_CACHE_DURATION = 12 * 60 * 60 * 1000;
let cachedCurrentAffairs = null;
let currentAffairsCacheTime = 0;
const CURRENT_AFFAIRS_CACHE_DURATION = 12 * 60 * 60 * 1000;
export const get_tip = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedTip && now - cacheTime < CACHE_DURATION) {
      return res.status(200).json({ success: true, message: cachedTip });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
    Give me one unique, practical and motivational tech tip of the day for developers.
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
    await Resource.findOneAndDelete({ userId: user.id });
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
      return res
        .status(200)
        .json({ success: false, message: "Can't find details" });
    }
    res.status(200).json({
      success: true,
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
      return res.status(200).json({ message: "No roadmap found" });
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
    await Resource.findOneAndDelete({ userId: userId });
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

**Task:** Analyze the provided resume text against the provided target job role. Based on your analysis, generate a single, valid JSON object that strictly follows the specified format and logic. Do not provide any text or explanation outside of the JSON object. If the role is "None", then analyze the resume generally.

**JSON Output Format:**

\`\`\`json
{
  "fileName": "string",
  "uploadDate": "string (YYYY-MM-DD)",
  "atsScore": "integer (0-100)",
  "fileSize": "string",
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
  "extractedSkills": [
    "string"
  ],
  "keywordMatch": "integer (0-100)",
  "formatScore": "integer (0-100)",
  "contentScore": "integer (0-100)",
  "suggestion": "string"
}
\`\`\`

**Instructions for each field:**

* \`fileName\`: Extract from the file URL if provided (e.g., from "/uploads/filename.pdf" get "filename.pdf"), otherwise use a placeholder like "resume.pdf".
* \`uploadDate\`: Use the current date.
* \`fileSize\`: Extract from file metadata if provided (e.g., "FileSize: 245 KB"), otherwise use "N/A".
* \`atsScore\`: Calculate an overall score from 0-100 representing the resume's general effectiveness. This should be a weighted average of the keyword, format, and content scores.
* \`analysis\`: An object containing three arrays of strings:
    * \`strengths\`: List 3-4 key positive aspects of the resume.
    * \`improvements\`: List 3-4 actionable suggestions for enhancement.
    * \`critical\`: List 1-2 major issues that could cause the resume to be rejected. If none, return an empty array \`[]\`.
* **\`extractedSkills\`**: **Extract all relevant technical skills (e.g., Python, React, AWS) and soft skills (e.g., Leadership, Communication) from the resume text and list them as an array of strings.**
* \`keywordMatch\`: A score (0-100) reflecting how well the skills and experience on the resume match keywords for the **target job role**.
* \`formatScore\`: A score (0-100) assessing the resume's layout, readability, and ATS compatibility.
* \`contentScore\`: A score (0-100) evaluating the quality of the language, use of action verbs, and quantified achievements.
* \`suggestion\`: A concise 15-20 word suggestion for improving the resume based on the analysis.

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
    const skills = parsed.extractedSkills || [];
    const existingSkill = await Skill.findOne({ userId });
    if (existingSkill) {
      for (let i = 0; i < skills.length; i++) {
        if (!existingSkill.skills.includes(skills[i])) {
          existingSkill.skills.push(skills[i]);
        }
      }
      await existingSkill.save();
    } else {
      const newSkill = new Skill({
        userId: userId,
        skills: skills,
        role: Role,
      });
      await newSkill.save();
    }

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
      suggestion: parsed.suggestion,
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
      return res
        .status(202)
        .json({ success: false, message: "No resume found" });
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
    const { goal, userId } = req.body;
    const preResult = await Resource.findOne({ userId });
    if (preResult) {
      return res.status(200).json({ response: preResult.resource });
    }
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
  "link": "string (A valid, working URL to the resource) Please provide a valid working specially the youtube links they should be working"
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
    const cleaned = generatedText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const newResource = new Resource({
      userId: userId,
      resource: parsed,
    });
    await newResource.save();
    res.status(200).json({ response: parsed });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Data can't be fetched" });
  }
};
export const fetchSteps = async (req, res) => {
  try {
    const { userId } = req.body;
    const roadMapData = await Roadmap.findOne({ userId });
    if (!roadMapData) {
      return res.status(200).json({ current: 0, Total: 0 });
    }
    const current = roadMapData.currentIndex;
    const Total = roadMapData.roadmap.length;
    return res.status(200).json({ current:current===Total-1?Total:current, Total });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Data can't be fetched" });
  }
};
export const DashResource = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await Resource.findOne({ userId });
    if (!result){
      return res.status(200).json({success: false, resource: [] });
    }
    const response = [];
    for (let i = 0; i < 6 && i < result.resource.length; i++) {
      response.push(result.resource[i]);
    }
    res.status(200).json({success:true,resource: response });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Data can't be fetched" });
  }
};

export const CreatePost = async (req, res) => {
  try {
    const {
      userId,
      userName,
      imgUrl,
      category,
      title,
      content,
      tags,
      Comments,
      Likes,
      time,
    } = req.body;
    const newPost = new Post({
      userId,
      userName,
      imgUrl,
      category,
      title,
      content,
      tags,
      Comments,
      Likes,
      time,
    });
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Post creation failed" });
  }
};
export const fetchPost = async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.status(200).json({ posts: allPosts });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Data can't be fetched" });
  }
};
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post
    const userLiked = post.LikedBy?.includes(userId);

    if (userLiked) {
      // Unlike the post
      post.Likes = Math.max(0, post.Likes - 1);
      post.LikedBy = post.LikedBy.filter((id) => id !== userId);
    } else {
      // Like the post
      post.Likes += 1;
      if (!post.LikedBy) {
        post.LikedBy = [];
      }
      post.LikedBy.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: userLiked
        ? "Post unliked successfully"
        : "Post liked successfully",
      post: post,
      isLiked: !userLiked,
      totalLikes: post.Likes,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { by, byimg, comment, byId } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      by: by || "Anonymous",
      byimg: byimg || "",
      byId: byId || "Unknown",
      comment: comment.trim(),
      time: Date.now().toString(),
    };

    post.Comments.push(newComment);
    await post.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
      post: post,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the post owner
    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = userId ? post.LikedBy?.includes(userId) || false : false;

    res.status(200).json({
      post: post,
      isLiked: isLiked,
      totalLikes: post.Likes,
      totalComments: post.Comments.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to fetch post details" });
  }
};
export const findJobs = async (req, res) => {
  const { location, userId, role, remote, jobType } = req.body;
  try {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
      role
    )}%20in%20${encodeURIComponent(location)}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const skill = await Skill.findOne({ userId });
    const userSkillsString = JSON.stringify(skill?.skills || []);
    const rawJobDataString = JSON.stringify(data.data, null, 2);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `**Role:** You are an intelligent job data processing engine. Your task is to act as a smart job matching algorithm that transforms a raw JSON array of job listings into a refined, user-centric JSON array.

**Task:** Analyze the provided raw job data and the user's profile. For each job, you must calculate a 'matchScore' and extract key information, formatting it exactly as specified.

---

### User Profile for Matching:
- **Desired Role:** "${role}"
- **Current Skills:** ${userSkillsString}
- **Location:** "${location}"
- **jobType:** "${jobType}" (This may include Full-time,Part-time,internship,Contract or FreeLance or it can be all types)
- **include-remote-jobs:** "${remote}"
---

### Instructions for Processing:

1.  **Parse the Raw Job Data:** Analyze each job object in the provided JSON data.
2.  **Extract and Transform:** For each job, create a new object that strictly follows the **Output JSON Schema**.
3.  **Calculate Match Score:** This is the most critical step. Follow these rules precisely:
    * **If User Skills are provided (the array is not empty):** The score is primarily based on the overlap between the user's skills and the skills listed in the job's qualifications.
        * High overlap (e.g., 75%+) should result in a score of 85-95.
        * Moderate overlap (e.g., 40-75%) should result in a score of 70-84.
        * Low overlap (e.g., <40%) should result in a score of 50-69.
    * **If User Skills are NOT provided (the array is empty):** The score should be based on how closely the job title ('job_title') matches the user's desired role. Also, consider location as a minor factor.
        * A very close title match (e.g., "Senior AI Engineer" vs "AI Engineer") should be 80-90.
        * A related but different role (e.g., "Data Scientist" vs "AI Engineer") should be 60-75.
    * **Add a bonus of +5 to the score if 'job_is_remote' is true.**
4.  **Generate a Concise Description:** Summarize the 'job_description' into a short, engaging sentence (max 30 words).
5.  **Extract Skills:** Identify and list the key technical skills (programming languages, frameworks, tools) from the 'job_description' and 'job_highlights.Qualifications'.
6. **Format Salary (Normalize to USD):**
    * Always convert the salary to USD, regardless of the job's original currency.
    * Conversion rules:
        - Assume approximate rates:
          * 1 INR = 0.012 USD
          * 1 EUR = 1.1 USD
          * 1 GBP = 1.25 USD
          * If an unknown currency is encountered, leave the values as-is but still append "USD".
    * If 'job_salary_period' is 'YEAR', format as "$[min/1000]k - $[max/1000]k / year".
    * If 'job_salary_period' is 'MONTH', first annualize (×12) and then format as yearly in USD.
    * If 'job_salary_period' is 'HOUR', format as "$[min] - $[max] / hour".
    * If salary data is null, use the string "Not Disclosed"
7.  **Generate Placeholders:** For 'rating' and 'reviews', generate plausible integer values as this data is not in the source. Rating should be between 3 and 5. Reviews should be between 50 and 300.

---

### Output JSON Schema (Strictly Enforce This):
\`\`\`json
[
  {
    "id": "integer",(starting from 1)
    "title": "string",
    "company": "string",
    "location": "string",
    "remote": "boolean",
    "salary": "string",
    "type": "string",
    "rating": "integer",
    "reviews": "integer",
    "matchScore": "integer",
    "postedTime": "string",
    "description": "string",
    "link": "string",
    "skills": ["string"]
  }
]
\`\`\`
**CRITICAL:** Your final output must be ONLY the JSON array, with no surrounding text, explanations, or markdown formatting like \`\`\`json.

---

### Raw Job Data for Analysis:
${rawJobDataString}
`;
    const result = await model.generateContent(prompt);
    const generatedText = result.response.candidates[0].content.parts[0].text;
    const cleaned = generatedText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    await Job.deleteMany({ userId });
    const newJob = new Job({
      userId: userId,
      job: parsed,
    });
    await newJob.save();
    res.status(200).json({ response: parsed });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to fetch post details" });
  }
};
export const fetchJobs = async (req, res) => {
  try {
    const { userId } = req.body;
    const jobs = await Job.find({ userId: userId });
    if (!jobs) {
      return res
        .status(200)
        .json({ success: false, message: "Can't find details" });
    }
    res.status(200).json({ success: true, jobs: jobs });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to fetch post details" });
  }
};
export const fetchQuestion = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `**Role:** You are an AI expert tasked with creating daily technical quizzes for a community of software developers and tech enthusiasts.

**Task:** Generate a single, high-quality Multiple Choice Question (MCQ) on a relevant and interesting technical topic. The output must be a single, valid JSON object and nothing else.

**Instructions:**
1.  **Question:** Formulate a clear and concise question about a concept in software engineering, programming languages, web development, data structures, or algorithms.
2.  **Options:** Provide exactly four possible answers. One must be correct, and the other three should be plausible but incorrect distractors.
3.  **Correct Answer:** Identify the correct option using its 0-based index (i.e., 0 for the first option, 1 for the second, and so on).
4.  **Explanation:** Write a brief, clear explanation (under 30 words) detailing why the correct answer is right.
5.  **Format:** Ensure the final output is only the JSON object, with no additional text or markdown formatting.

**JSON Output Structure:**
\`\`\`json
{
  "question": "string",
  "options": [
    "string",
    "string",
    "string",
    "string"
  ],
  "correctAnswer": "integer",
  "explanation": "string",
  "topic": "string"
}
\`\`\`
`;
    const result = await model.generateContent(prompt);
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
    res.status(200).json({ response: parsed });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to fetch post details" });
  }
};
export const DailyQuestion = async (req, res) => {
  try {
    const { userId } = req.body;
    const questions = await Ques.find({});

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions available" });
    }

    const hasAnswered = questions[0].answeredBy.includes(userId);

    const user = await DailyUser.findOne({ userId: userId });
    let streak = 0;
    if (user) {
      streak = user.currentStreak;
    }

    res.status(200).json({
      hasAnswered: hasAnswered,
      questions: questions,
      streak: streak,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Failed to fetch post details" });
  }
};

export const SubmitDaily = async (req, res) => {
  try {
    const { userId } = req.body;
    let question = await Ques.findOne({});
    if (!question) {
      return res.status(404).json({ message: "No question found" });
    }
    if (!Array.isArray(question.answeredBy)) {
      question.answeredBy = [];
    }

    if (!question.answeredBy.includes(userId)) {
      question.answeredBy.push(userId);
      await question.save();
    }
    let existingUser = await DailyUser.findOne({ userId });
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (!existingUser) {
      existingUser = new DailyUser({
        userId,
        lastAnsweredDate: today,
        currentStreak: 1,
        lastAnswerCorrect: true,
      });
      await existingUser.save();
      return res.status(200).json({ message: "User created", streak: 1 });
    }

    if (existingUser.lastAnsweredDate === today) {
      return res.status(200).json({
        message: "Already answered today",
        streak: existingUser.currentStreak,
      });
    }

    if (
      existingUser.lastAnsweredDate === yesterday &&
      existingUser.lastAnswerCorrect
    ) {
      existingUser.currentStreak += 1;
    } else {
      existingUser.currentStreak = 1;
    }

    existingUser.lastAnsweredDate = today;
    existingUser.lastAnswerCorrect = true;
    await existingUser.save();

    return res.status(200).json({
      message: "Daily quiz submitted",
      streak: existingUser.currentStreak,
    });
  } catch (err) {
    console.error("SubmitDaily error:", err);
    res.status(500).json({ message: "Request failed" });
  }
};

export const submitWrong = async (req, res) => {
  try {
    const { userId } = req.body;
    const question = await Ques.findOne({});

    if (question && !question.answeredBy.includes(userId)) {
      question.answeredBy.push(userId);
      await question.save();
    }
    const existingUser = await DailyUser.findOne({ userId: userId });
    if (!existingUser) {
      const newUser = new DailyUser({
        userId: userId,
        lastAnsweredDate: new Date().toISOString().slice(0, 10),
        currentStreak: 0,
        lastAnswerCorrect: false,
      });
      await newUser.save();
      return res.status(200).json({ message: "User created", streak: 0 });
    }

    existingUser.currentStreak = 0;
    existingUser.lastAnsweredDate = new Date().toISOString().slice(0, 10);
    existingUser.lastAnswerCorrect = false;
    await existingUser.save();

    res.status(200).json({
      message: "Submitted",
      streak: existingUser.currentStreak,
    });
  } catch (err) {
    console.error("submitWrong error:", err);
    res.status(500).json({ message: "Request failed" });
  }
};
export const FetchStats = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await DailyUser.findOne({ userId: userId });
    const roadmap = await Roadmap.findOne({ userId: userId });
    res.status(200).json({
      streak: user ? user.currentStreak : 0,
      curr: roadmap ? roadmap.currentIndex : 0,
      total: roadmap ? roadmap.roadmap.length : 0,
    });
  } catch (err) {
    console.error("FetchStats error:", err);
    res.status(500).json({ message: "Request failed" });
  }
};
