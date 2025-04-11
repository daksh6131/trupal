import mongoose, { Schema, Document } from "mongoose";

export interface ICreditCard extends Document {
  name: string;
  minCibilScore: number;
  annualFee: number;
  utmLink: string;
  benefits: string[];
  tags: string[];
  status: "active" | "inactive";
  imageUrl: string;
}

const CreditCardSchema = new Schema<ICreditCard>(
  {
    name: { type: String, required: true },
    minCibilScore: { type: Number, required: true },
    annualFee: { type: Number, required: true },
    utmLink: { type: String, required: true },
    benefits: { type: [String], required: true },
    tags: { type: [String], required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CreditCard || mongoose.model<ICreditCard>("CreditCard", CreditCardSchema);
