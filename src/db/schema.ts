import { InferModel } from 'drizzle-orm'
import { pgTable, uuid, boolean, varchar } from 'drizzle-orm/pg-core'

export const todos = pgTable("todos", {
  id: uuid('id').defaultRandom().primaryKey(),
  content: varchar('content', { length: 256 }).notNull(),
  completed: boolean('completed').notNull().default(false),
})

export type Todo = InferModel<typeof todos>