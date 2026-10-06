import { z } from 'zod';

export const garmentSizeSchema = z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']);

export const sizeMeasurementSchema = z.object({
  bust: z.number().positive(),
  waist: z.number().positive(),
  hip: z.number().positive(),
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  sleeveLength: z.number().positive(),
  shoulderWidth: z.number().positive(),
  neckCircumference: z.number().positive(),
});

export const sizeTableSchema = z.record(garmentSizeSchema, sizeMeasurementSchema);

export const point2DSchema = z.object({
  x: z.number(),
  y: z.number(),
  name: z.string().optional(),
  isControl: z.boolean().optional(),
  isNotch: z.boolean().optional(),
});

export const patternPathCommandSchema = z.object({
  type: z.enum(['M', 'L', 'C', 'Q', 'Z']),
  points: z.array(point2DSchema),
  annotation: z.string().optional(),
  zone: z
    .enum([
      'neck',
      'shoulder',
      'armhole',
      'bust',
      'waist',
      'hip',
      'hem',
      'sleeve-cap',
      'sleeve-seam',
      'sleeve-hem',
      'center-fold',
    ])
    .optional(),
});

export const patternComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  cutInstruction: z.string(),
  grainline: z.object({
    start: point2DSchema,
    end: point2DSchema,
    label: z.string(),
  }),
  paths: z.array(patternPathCommandSchema),
  notches: z.array(point2DSchema),
  labels: z.array(
    z.object({
      text: z.string(),
      position: point2DSchema,
      type: z.string().optional(),
    })
  ),
  measurements: z.record(z.string(), z.number().optional()),
  offset: point2DSchema,
});

export const garmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['t-shirt', 'polo', 'shirt', 'trouser', 'jacket', 'dress']),
  version: z.string(),
  baseSize: garmentSizeSchema,
  currentSize: garmentSizeSchema,
  position: point2DSchema,
  components: z.array(patternComponentSchema).min(1),
  sizeTable: sizeTableSchema,
  lastGradedAt: z.string().optional(),
  gradeHistory: z
    .array(
      z.object({
        from: garmentSizeSchema,
        to: garmentSizeSchema,
        timestamp: z.string(),
      })
    )
    .optional(),
});

export const projectSchema = z.object({
  _id: z.string().optional(),
  id: z.string(),
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  garment: garmentSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const gradeRequestSchema = z.object({
  targetSize: garmentSizeSchema,
  garment: garmentSchema.optional(),
});

export const createProjectRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  garment: garmentSchema.optional(),
});

export const updateProjectRequestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  garment: garmentSchema.optional(),
});
