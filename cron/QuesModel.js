import mongoose from "mongoose";
const QuesSchema = new mongoose.Schema({
  question : {type:String,required:true},
  options:[String],
  correctAnswer:{type:Number,required:true},
  topic:{type:String,required:true},
  explanation:{type:String,required:true},
  answeredBy:[String]
})
export const Ques=mongoose.model("Ques",QuesSchema);