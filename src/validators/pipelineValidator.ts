import { z } from 'zod';

export const scheduleInterviewSchema = z.object({
  body: z.object({
    date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    }),
    link: z.string().min(5),
  }),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}),
});
