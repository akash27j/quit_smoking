import { z } from "zod";

// Smoke Log Entry
export const smokeLogSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  trigger: z.string(),
  mood: z.string(),
  notes: z.string().optional(),
});

export type SmokeLog = z.infer<typeof smokeLogSchema>;

// Craving Log Entry
export const cravingLogSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  intensity: z.number().min(1).max(5),
  mood: z.string(),
  notes: z.string().optional(),
  duration: z.number().optional(), // in minutes
});

export type CravingLog = z.infer<typeof cravingLogSchema>;

// Goal
export const goalSchema = z.object({
  id: z.string(),
  type: z.enum(['smoke-free-days', 'reduce-cigarettes', 'money-target']),
  target: z.number(),
  duration: z.number(),
  unit: z.enum(['days', 'weeks', 'months']),
  startDate: z.string(),
  endDate: z.string(),
  completed: z.boolean().default(false),
  progress: z.number().default(0),
});

export type Goal = z.infer<typeof goalSchema>;

// Achievement/Badge
export const achievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  unlockedAt: z.string().optional(),
  requirement: z.object({
    type: z.string(),
    value: z.number(),
  }),
});

export type Achievement = z.infer<typeof achievementSchema>;

// Quote
export const quoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  author: z.string(),
  isFavorite: z.boolean().default(false),
  isCustom: z.boolean().default(false),
});

export type Quote = z.infer<typeof quoteSchema>;

// User Settings
export const settingsSchema = z.object({
  packCost: z.number().default(12),
  cigarettesPerPack: z.number().default(20),
  notificationsEnabled: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  dailyLimit: z.number().optional(),
});

export type Settings = z.infer<typeof settingsSchema>;

// Daily Stats
export const dailyStatsSchema = z.object({
  date: z.string(),
  cigaretteCount: z.number().default(0),
  moneySaved: z.number().default(0),
  cravingsResisted: z.number().default(0),
});

export type DailyStats = z.infer<typeof dailyStatsSchema>;

// App Data (complete user data structure)
export const appDataSchema = z.object({
  smokeLogs: z.array(smokeLogSchema).default([]),
  cravingLogs: z.array(cravingLogSchema).default([]),
  goals: z.array(goalSchema).default([]),
  achievements: z.array(achievementSchema).default([]),
  quotes: z.array(quoteSchema).default([]),
  settings: settingsSchema.default({}),
  dailyStats: z.array(dailyStatsSchema).default([]),
  startDate: z.string().optional(),
});

export type AppData = z.infer<typeof appDataSchema>;
