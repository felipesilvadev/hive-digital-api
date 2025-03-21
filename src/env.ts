import { z } from 'zod';

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  TELEGRAM_TOKEN: z.string(),
  TELEGRAM_CHAT_ID: z.string()
});

export const env = envSchema.parse(process.env);
