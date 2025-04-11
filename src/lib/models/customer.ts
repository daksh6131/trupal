import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email: string;
  dob: string;
  pan: string;
  salary: number;
  pin: string;
  address: string;
  cibilScore?: number;
  linkedAgent: string;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    pan: { type: String, required: true },
    salary: { type: Number, required: true },
    pin: { type: String, required: true },
    address: { type: String, required: true },
    cibilScore: { type: Number },
    linkedAgent: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
