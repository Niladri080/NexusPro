import mongoose from 'mongoose';

const DailyUserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  lastAnsweredDate : { type: String, required: true },
  currentStreak: { type: Number, required: true,default:1 },
});

export const DailyUser = mongoose.model('DailyUser', DailyUserSchema);