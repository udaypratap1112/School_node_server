import mongoose from "mongoose";
import Student from "./styu.js";

const classAttendanceSchema = new mongoose.Schema(
  {
    classId: { type: String, required: true },
    term: { type: String, required: true },
    attendanceRecords: [
      {
        attendanceDate: { type: Date, required: true },
        records: [
          {
            studentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: Student,
              required: true,
            },
            isPresent: { type: Boolean, default: false },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
const classModel = mongoose.model("class", classAttendanceSchema);

export default classModel