import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  name: string;
  phone: string;
  password: string;
  status: "active" | "inactive";
  lastLogin: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Agent || mongoose.model<IAgent>("Agent", AgentSchema);
