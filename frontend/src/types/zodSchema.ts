import { z } from 'zod';

export const productVersionSchema = z.object({
  id: z.string(),
  productId: z.string(),
  versionNumber: z.string(),
  changes: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  isRevert: z.boolean().optional(),
  revertedFromVersion: z.string().optional(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  versions: z.array(productVersionSchema),
});
