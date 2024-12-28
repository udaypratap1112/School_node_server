import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
// import Student from "./model/student.js";
import Student from './model/styu.js'
import classModel from "./model/attendance.js";
const MONGO_URL = process.env.MONGO_URL
  ? process.env.MONGO_URL
  : "mongodb://127.0.0.1:27017/your_database_name"; // Change this to your MongoDB connection URL

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const FIXED_DUE_DATES = [
  { year: 2024, month: 6, day: 30 }, // July 31
  { year: 2024, month: 11, day: 30 }, // November 30
  { year: 2025, month: 3, day: 30 }, // March 31
];
const PAID = [true, false, false];


// const years = [2024, 2025, 2026];

// Function to generate a single student's data
function generateStudentData(index) {
  const name = faker.person.fullName();
  
  const classId = faker.helpers.arrayElement([ "10th", "5th", "6th", "7th", "8th","9th" ]);
  const gender = faker.helpers.arrayElement(["male", "female"]);
  return { name, gender, classId,  term: '2024-25', fees:generate_Installments() };
}

// Run the data generation

function generate_Installments() {
  const installments = [];

  FIXED_DUE_DATES.forEach((dat, index) => {
    const dueDate = new Date(`${dat.year}-${dat.month}-${dat.day}`);

    installments.push({
      term: "2024-25",
      installmentNumber: index + 1,
      amount: faker.number.int({ min: 3000, max: 5000 }),
      dueDate: dueDate,
      isPaid: PAID[index],
      paymentDate: PAID[index] ? dueDate : null, // Optional, when payment is made
    });
  });

 return installments
}
export {generate_Installments}



async function generateSampleData(numberOfStudents = 5) {
  const students = [];

  for (let i = 1; i <= numberOfStudents; i++) {
    const studentData = generateStudentData();
    students.push(studentData);
  }


  try {
    // Insert generated data into the MongoDB collection
    await Student.insertMany(students);
    console.log(`${numberOfStudents} students data generated successfully.`);
  } catch (error) {
    console.error("Error generating sample data:", error);
  } finally {
    mongoose.connection.close();
  }
}
// generateSampleData(80)


async function generateClass() {
const classs=  [ "10th", "5th", "6th", "7th", "8th","9th" ]
  const classc= classs.map((val)=>{
    return { classId: val, term: '2024-25', attendanceRecords: [] }
  })
 try {
   await classModel.insertMany(classc);
   console.log("data updated");
 } catch (error) {
    console.log("data failed");
 }
  
}
// generateClass()

//attendance data generator

const updateAttendanceForClass = async (classId, term, startDate, endDate) => {
  try {
    // Step 1: Fetch all students in the specified class and term
    const students = await Student.find({ classId });

    if (students.length === 0) {
      console.log("No students found for the specified class and term.");
      return;
    }

    // Step 2: Create attendance records for the specified date range
    const attendanceRecords = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const attendanceDate = new Date(currentDate); // Copy the current date

      const records = students.map((student) => ({
        studentId: student._id,
        isPresent: Math.random() < 0.8, // 80% chance of being present
      }));

      attendanceRecords.push({ attendanceDate, records });

      // Increment the date
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Step 3: Update the ClassAttendance collection
    await classModel.updateOne(
      { classId}, // Filter by class and term
      { $push: { attendanceRecords: { $each: attendanceRecords } } }, // Add attendance
     // Create document if it doesn't exist
    );

   

    console.log(`Attendance updated successfully for class ${classId}, term ${term}!`);
  } catch (error) {
    console.error("Error updating attendance data:", error);
  }
};

// Usage example
// (async () => {
//   const classId = "7th"; // Replace with your class ID
//   const term = "2024-2025"; // Replace with your term
//   const startDate = "2024-12-01"; // Start date (1st Dec)
//   const endDate = "2024-12-15"; // End date (31st Dec)

//   await updateAttendanceForClass(classId, term, startDate, endDate);
// })();


