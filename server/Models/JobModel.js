import mongoose from "mongoose";
const JobSchema = new mongoose.Schema({
  userId:{type:String,required:true},
  job:[{
            id: {type:Number,required:true},
            title: {type:String,required:true},
            company: {type:String,required:true},
            location: {type:String,required:true},
            remote: {type:Boolean},
            salary: {type:String,required:true},
            type: {type:String,required:true},
            rating: {type:Number,required:true},
            reviews: {type:Number,required:true},
            matchScore: {type:Number,required:true},
            postedTime: {type:String,required:true},
            description:{type:String,required:true},
            link:{type:String,required:true},
            skills: [{type:String}]
  }]
})
export const Job=mongoose.model("Job",JobSchema);