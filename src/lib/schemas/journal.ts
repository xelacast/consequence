import z from "zod";

/**
 * @relationship one-to-many day to journal
 * @field entries: array of journal entries for read only purposes
 * @field entry: string for writing to the database date: string or date
 * @dependents jounrnalContainer, journalEntries, journalActio
 */
export const journalSchema = z.object({
  date: z.union([z.string(), z.date()]).optional(),
  id: z.string().optional(),
  content: z.string().min(1).max(5000),
  title: z.string().min(1).max(100).optional(),
  // read for database
  entries: z
    .object({
      id: z.string().optional(),
      content: z.string().min(1).max(5000),
      time: z.union([z.date(), z.string()]).optional(),
      title: z.string().min(1).max(100).optional(),
    })
    .array()
    .optional(),
});
