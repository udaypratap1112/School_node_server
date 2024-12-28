import mongoose from "mongoose";

const studentSchema2 = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, default:null },
    gender: { type: String, required: true , enum: ['male', 'female', 'other']},
    classId: { type: String, required: true },
    classIdSecondary: { type: String,  default: null },
    term:{type:String,required:true},
    fees: [
        {   
            term:{type:String,required:true},
            installmentNumber: { type: Number, required: true },
            amount: { type: Number, required: true },
            dueDate: { type: Date, required: true },
            isPaid: { type: Boolean, default: false },
            paymentDate: { type: Date,default:null }, // Optional, when payment is made
          }
        ],
    
  },
  { timestamps: true }
);
const Student = mongoose.model("Student", studentSchema2);

export default Student