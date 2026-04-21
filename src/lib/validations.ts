import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(6).max(30).optional().or(z.literal("")),
  subject: z.string().min(2).max(160).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
  consent: z.boolean(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const appointmentSchema = z.object({
  serviceId: z.string().min(1),
  professionalId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  email: z.email(),
  notes: z.string().max(2000).optional().or(z.literal("")),
  consent: z.boolean(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const adminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});
