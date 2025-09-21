import mongoose from "mongoose";
const RoadmapSchema=new mongoose.Schema({
  userId:{type:String,required:true},
  role:{type:String,required:true},
  roadmap:[{
    id:{type:Number},
    title:{type:String},
    description:{type:String},
    duration:{type:String},
    completed:{type:Boolean,default:false},
    link:{type:String},
  }],
  currentIndex:{type:Number,default:0},
  hasCompleted:{type:Boolean,default:false}
})
export const Roadmap=mongoose.model("Roadmap",RoadmapSchema)