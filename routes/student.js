import express from "express";
import StudentModel from '../model/styu.js'
import { generate_Installments } from "../utils.js";
const router = express.Router();




router.get('/students/filter', async (req, res) => {

 try {
      const { classId,feeStatus,gender } = req.query;
      const currentDate = new Date('2024-12-01');
  
   console.log(classId,gender,feeStatus);
      // Build the main query object
      let query = {};
  
      if (classId) { query.classId = classId }
      if (gender) {query.gender=gender}
        
  
      // Add fee-based filtering using $all or $not
      if (feeStatus === 'paid') {
        query['fees'] = {
          $not: {
            $elemMatch: { dueDate: { $lt: currentDate }, isPaid: false, }
          }
        };
      } else if (feeStatus === 'unpaid') {
        query['fees'] = {
          $elemMatch: { dueDate: { $lt: currentDate }, isPaid: false, }
        };
      }
  
      // Fetch students based on the query
      const students = await StudentModel.find(query).sort('name').lean();
  
      res.status(200).json({
        success: true,
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching students',
        error: error.message,
      });
    }
});
  
router.post('/students/add', async (req, res) => {
  const { name, gender, classId, term } = req.body;

  if (!name||!gender||!classId||!term) {
    return res.status(400).json({ message: 'add all required fields', });
  }

  try {
    // Create a new student document
    const newStudent = new StudentModel({ name, gender, classId, term, fees:generate_Installments() })

    // Save the student to the database
    const savedStudent = await newStudent.save();
    res.status(201).json({
      message: 'Student added successfully',
      student: savedStudent
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error adding student',
      error: error.message
    });
  }
})

router.get('/students/by-course', async (req, res) => {

  const { classId, term } = req.query
  
  if (!classId || !term) {
      return res.status(400).json({
          message: "course and year not mentioned",
        });
  }

  const allClassStudents=await StudentModel.aggregate([
      { '$match': { 'classId': classId, 'term': term } },
      { '$project': { 'name': 1, 'gender': 1 } },
      { '$sort': { 'name': 1 } }
  ])
  

  
  if (!allClassStudents||allClassStudents.length<1) {
      return res.status(400).json({
          message: "Something went wrong cannot get students",
        });
  }

  res.status(201).json({ message: "sucessfully get students", data: allClassStudents });

})
  
export default router;