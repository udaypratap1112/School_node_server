import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    course: { type: String, required: true },
    fees: [
      {
        year: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        installments: [
          {
            installmentNumber: { type: Number, required: true },
            amount: { type: Number, required: true },
            dueDate: { type: Date, required: true },
            isPaid: { type: Boolean, default: false },
            paymentDate: { type: Date }, // Optional, when payment is made
          },
        ],
        yearPaidAmount: { type: Number, default: 0 }, // Total paid amount for the year
      },
    ],
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
