import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  deadline: timestamp("deadline"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTodoSchema = createInsertSchema(todos)
  .pick({
    title: true,
    deadline: true,
  })
  .extend({
    deadline: z.string().optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
