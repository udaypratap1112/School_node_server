import express from 'express'
import { createClient } from 'redis';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import catchAsync from './middleware/errorMiddleware.js';
import myError from './middleware/error.js';
import StudentRoutes from './routes/student.js'
import ClassRoutes from './routes/class.js'
const app = express()
dotenv.config()


const MONGO_URL =process.env.MONGO_URL?process.env.MONGO_URL: 'mongodb://127.0.0.1:27017/your_database_name'; // Change this to your MongoDB connection URL
const REDIS_URL =process.env.REDIS_HOST?process.env.REDIS_URL: 'redis://127.0.0.1:6379'; // Change this to your MongoDB connection URL


// console.log(MONGO_URL,REDIS_URL);
// const client = createClient({url:'redis://redis:6379'
//   // password: 'your_password', // Uncomment if Redis requires a password
// });
// client.on('connect', () => { console.log('Connected to Redis'); });
// client.on('error', (err) => { console.error('Redis connection error:', err); });
// client.connect()

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });  

app.use(StudentRoutes)
app.use(ClassRoutes)

// app.get('/dashboard-data', catchAsync(async (req, res) => {
//   try {
//     const cache = await client.get('dash')
//     if (cache) {
//      return res.status(200).json(JSON.parse(cache))
//     }
//     // const agg = [
//     //   {
//     //     '$facet': {
//     //       'genderWise': [
//     //         {
//     //           '$group': {
//     //             '_id': '$gender', 
//     //             'count': {
//     //               '$sum': 1
//     //             }
//     //           }
//     //         }, {
//     //           '$project': {
//     //             'gender': '$_id', 
//     //             'count': 1, 
//     //             '_id': 0
//     //           }
//     //         }
//     //       ], 
//     //       'totalStudents': [
//     //         {
//     //           '$count': 'totalStudents'
//     //         }
//     //       ], 
//     //       'courseWise': [
//     //         {
//     //           '$group': {
//     //             '_id': '$course', 
//     //             'count': {
//     //               '$sum': 1
//     //             }, 
//     //             'male': {
//     //               '$sum': {
//     //                 '$cond': [
//     //                   {
//     //                     '$eq': [
//     //                       '$gender', 'male'
//     //                     ]
//     //                   }, 1, 0
//     //                 ]
//     //               }
//     //             }, 
//     //             'female': {
//     //               '$sum': {
//     //                 '$cond': [
//     //                   {
//     //                     '$eq': [
//     //                       '$gender', 'female'
//     //                     ]
//     //                   }, 1, 0
//     //                 ]
//     //               }
//     //             }
//     //           }
//     //         }
//     //       ], 
//     //       'revenue': [
//     //         {
//     //           '$unwind': '$fees'
//     //         }, {
//     //           '$unwind': '$fees.installments'
//     //         }, {
//     //           '$group': {
//     //             '_id': '$fees.year', 
//     //             'totalAmount': {
//     //               '$sum': '$fees.installments.amount'
//     //             }
//     //           }
//     //         }
//     //       ]
//     //     }
//     //   }
//     // ];
//     // const data = await Student.aggregate(agg)
//     // if (!data) {
//     //   throw new myError('data not found', 500)
//     // }
//     const data= await Student.find()
//     await client.set('dash', JSON.stringify(data))
//     await client.expire('dash',30)
//     return res.status(200).json(data)

//   } catch (error) {
//     console.log(error);
//     throw new myError('data not found', 500)
//   }
// }))
  










app.use((err, req, res, next) => {
    
  const message=err.message??'Something Went Wrong'
  const status=err.status??500
    console.log('got');
    res.status(status).send(message)
  })


  app.listen(4000,(req,res)=>{
     console.log("server is running on port 4000");
  })


