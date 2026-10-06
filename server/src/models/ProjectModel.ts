import mongoose, { Schema, Document } from 'mongoose';
import { Project } from '../../../shared/types.js';

export interface ProjectDocument extends Document {
  id: string;
  title: string;
  description?: string;
  garment: any;
  createdAt: string;
  updatedAt: string;
}

const Point2DSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    name: { type: String },
    isControl: { type: Boolean },
    isNotch: { type: Boolean },
  },
  { _id: false }
);

const PatternPathCommandSchema = new Schema(
  {
    type: { type: String, enum: ['M', 'L', 'C', 'Q', 'Z'], required: true },
    points: [Point2DSchema],
    annotation: { type: String },
    zone: { type: String },
  },
  { _id: false }
);

const PatternComponentSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    cutInstruction: { type: String, required: true },
    grainline: {
      start: Point2DSchema,
      end: Point2DSchema,
      label: { type: String, required: true },
    },
    paths: [PatternPathCommandSchema],
    notches: [Point2DSchema],
    labels: [
      {
        text: { type: String, required: true },
        position: Point2DSchema,
        type: { type: String },
      },
    ],
    measurements: { type: Schema.Types.Mixed },
    offset: Point2DSchema,
  },
  { _id: false }
);

const GarmentSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    version: { type: String, required: true },
    baseSize: { type: String, required: true },
    currentSize: { type: String, required: true },
    position: Point2DSchema,
    components: [PatternComponentSchema],
    sizeTable: { type: Schema.Types.Mixed, required: true },
    lastGradedAt: { type: String },
    gradeHistory: [
      {
        from: { type: String },
        to: { type: String },
        timestamp: { type: String },
      },
    ],
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    garment: { type: GarmentSchema, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ProjectModel = mongoose.model<ProjectDocument>('Project', ProjectSchema);
