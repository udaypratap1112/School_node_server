import express from "express";
import classModel from '../model/attendance.js'
import Student from "../model/styu.js";
const router = express.Router();



router.post('/class/attendance', async (req, res) => {
  
    const { course,year,attendanceDate,records } = req.body;
    
    const existingAttendance = await classModel.findOne({
        course: course,
        year: year,
        attendanceRecords: {
          $elemMatch: { attendanceDate: new Date(attendanceDate) },
        },
      });

      if (existingAttendance) {
        return res.status(400).json({
          message: "Attendance record already exists for the given date",
        });
    }
    
    const newAttendance = {
        attendanceDate: new Date(attendanceDate),
        records: records.map((record) => ({
          studentId: record.studentId,
          isPresent: record.isPresent,
        })),
    };
    

    let classAttendance = await classModel.findOne({ course: course, year: year });

    if (classAttendance) {
      classAttendance.attendanceRecords.push(newAttendance);
    }else {
        classAttendance = new classModel({
          class: classId,
          year: year,
          attendanceRecords: [newAttendance],
        });
    }
    
    await classAttendance.save();

    res.status(201).json({ message: "Attendance added successfully", data: classAttendance });

})

router.get("/attendance/:classId", async (req, res) => {
  const { classId, term } = req.params;

  try {
    // Aggregate attendance data by classId and term
    const result = await classModel.aggregate([
      { $match: { classId } }, // Filter for the specific classId
      { $unwind: "$attendanceRecords" }, // Unwind attendanceRecords array
      { $unwind: "$attendanceRecords.records" }, // Unwind records array
      {
        $group: {
          _id: "$attendanceRecords.records.studentId", // Group by studentId
          attendance: {
            $push: {
              date: "$attendanceRecords.attendanceDate", // Use attendanceDate as key
              isPresent: "$attendanceRecords.records.isPresent", // Add isPresent as value
            },
          },
        },
      },
      {
        $lookup: {
          from: "students", // Name of the Student collection
          localField: "_id", // Grouped studentId
          foreignField: "_id", // Match with _id in Student collection
          as: "studentInfo", // Join results as studentInfo
        },
      },
      {
        $project: {
          _id: 0,
          studentId: "$_id", // Rename _id to studentId
          name: { $arrayElemAt: ["$studentInfo.name", 0] }, // Directly access the name from the array
          attendance: {
            $arrayToObject: {
              $map: {
                input: "$attendance",
                as: "item",
                in: {
                  k: { $dateToString: { format: "%Y-%m-%d", date: "$$item.date" } },
                  v: "$$item.isPresent",
                },
              },
            },
          },
        },
      },
    ]);

    res.json(result); // Send the attendance data as a JSON response
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ message: "Error fetching attendance data." });
  }
});





export default router;