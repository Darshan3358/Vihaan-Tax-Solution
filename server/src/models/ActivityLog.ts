import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user: string;
  action: string;
  resource: string;
  details?: string;
  ip?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    details: { type: String, default: '' },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
