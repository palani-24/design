import mongoose, { Schema, Document } from 'mongoose';
import { SizeTable } from '../../../shared/types.js';

export interface SizeTableDocument extends Document {
  id: string;
  name: string;
  isDefault: boolean;
  unit: string;
  table: Record<string, any>;
}

const SizeMeasurementSchema = new Schema(
  {
    bust: { type: Number, required: true },
    waist: { type: Number, required: true },
    hip: { type: Number, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    sleeveLength: { type: Number, required: true },
    shoulderWidth: { type: Number, required: true },
    neckCircumference: { type: Number, required: true },
  },
  { _id: false }
);

const SizeTableSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    unit: { type: String, default: 'cm' },
    table: {
      XS: SizeMeasurementSchema,
      S: SizeMeasurementSchema,
      M: SizeMeasurementSchema,
      L: SizeMeasurementSchema,
      XL: SizeMeasurementSchema,
      XXL: SizeMeasurementSchema,
    },
  },
  {
    timestamps: true,
    collection: 'size_tables',
  }
);

export const SizeTableModel = mongoose.model<SizeTableDocument>('SizeTable', SizeTableSchema);
