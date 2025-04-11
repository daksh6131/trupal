import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  action: "form_submit" | "card_shared" | "login" | "logout";
  agentPhone: string;
  agentName: string;
  customerId?: string;
  customerName?: string;
  sharedCards?: string[];
  details?: Record<string, any>;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: { 
      type: String, 
      enum: ["form_submit", "card_shared", "login", "logout"], 
      required: true 
    },
    agentPhone: { type: String, required: true },
    agentName: { type: String, required: true },
    customerId: { type: String },
    customerName: { type: String },
    sharedCards: { type: [String] },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
