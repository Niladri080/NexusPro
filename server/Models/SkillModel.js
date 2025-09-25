import mongoose from "mongoose";
const SkillSchema=new mongoose.Schema({
  userId: {type:String,required:true},
  skills:[{type:String,required:true}],
})
export const Skill=mongoose.model("Skill",SkillSchema)