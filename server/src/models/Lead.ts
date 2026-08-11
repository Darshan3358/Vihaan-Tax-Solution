import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadNote {
  author: string;
  note: string;
  createdAt: Date;
}

export interface ILead extends Document {
  leadNumber: string;
  name: string;
  phone: string;
  email: string;
  serviceId?: mongoose.Types.ObjectId;
  serviceName: string;
  customerType: 'Individual' | 'Business';
  message: string;
  preferredContactMethod: 'Call' | 'WhatsApp' | 'Email';
  preferredContactTime?: string;
  whatsappConsent: boolean;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Follow-Up' | 'Converted' | 'Closed' | 'Rejected';
  notes: ILeadNote[];
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    leadNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
    serviceName: { type: String, required: true, default: 'General Consultation' },
    customerType: { type: String, enum: ['Individual', 'Business'], default: 'Individual' },
    message: { type: String, default: '' },
    preferredContactMethod: { type: String, enum: ['Call', 'WhatsApp', 'Email'], default: 'Call' },
    preferredContactTime: { type: String, default: 'Anytime' },
    whatsappConsent: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Discussion', 'Follow-Up', 'Converted', 'Closed', 'Rejected'],
      default: 'New',
    },
    notes: [
      {
        author: { type: String, required: true },
        note: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    source: { type: String, default: 'Website Form' },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
