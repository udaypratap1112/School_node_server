import mongoose from "mongoose";
import Student from "./styu.js";

const studentHistorySchema = new mongoose.Schema(
  {
    StudentId: { type: mongoose.Schema.Types.ObjectId, ref: Student },
    history: [],
  },
  { timestamps: true }
);

export default studentHistorySchema;
