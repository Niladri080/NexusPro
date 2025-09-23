import mongoose from "mongoose";
const ResourceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  resource:[
    {
      description:{type:String,required:true}, 
      difficulty: {type:String,required:true},
      duration:{type:String,required:true},
      id: {type:Number,required:true},
    isPaid:{type:Boolean,required:true},
    link:{type:String,required:true},
    rating:{type:Number,required:true},
    students:{type:Number,required:true},
    tags:[String],
    title:{type:String,required:true},
    type:{type:String,required:true}
    }
  ]
});

export const Resource = mongoose.model("Resource", ResourceSchema);
