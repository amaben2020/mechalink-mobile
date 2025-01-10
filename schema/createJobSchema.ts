import { z } from 'zod';

export const createJobSchema = z.object({
  description: z
    .string()
    .nonempty('Description is required')
    .max(255, 'Description must not exceed 255 characters'),
  rate: z
    .number({ invalid_type_error: 'Rate must be a number' })
    .min(1, 'Rate must be at least 1'),
  latitude: z
    .number({ invalid_type_error: 'Latitude must be a number' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number({ invalid_type_error: 'Longitude must be a number' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  locationDetails: z
    .string()
    .nonempty('Location details are required')
    .max(255, 'Location details must not exceed 255 characters'),
  isPendingReview: z.boolean().optional(), // Optional field
  status: z.enum(['NOTIFYING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  userId: z
    .number({ invalid_type_error: 'User ID must be a number' })
    .int('User ID must be an integer')
    .positive('User ID must be a positive number'),
});
