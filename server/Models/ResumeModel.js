import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    strengths: [String],
    improvements: [String],
    critical: [String],
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  atsScore: { type: Number, required: true },
  contentScore: { type: Number, required: true },
  formatScore: { type: Number, required: true },
  keywordMatch: { type: Number, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: String, required: true },
  uploadDate: { type: String, required: true },
  analysis: { type: AnalysisSchema, required: true },
  suggestion: {type:String,required:true}
});

export const Reusme = mongoose.model("Resume", ResumeSchema);
