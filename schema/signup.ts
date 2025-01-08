import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*\d).*$/,
      'Password must include a number and an uppercase letter'
    ),
  addressOne: z.string().min(2, 'Invalid address'),
  role: z.enum(['client', 'mechalink']),
  phone: z.string().min(11, { message: 'Must be 11 digits' }),
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*\d).*$/,
      'Password must include a number and an uppercase letter'
    ),
});
