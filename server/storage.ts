import { users, todos, type User, type InsertUser, type Todo, type InsertTodo } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getTodos(userId: number): Promise<Todo[]>;
  createTodo(userId: number, todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, completed: boolean): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTodos(userId: number): Promise<Todo[]> {
    return db.select().from(todos).where(eq(todos.userId, userId));
  }

  async createTodo(userId: number, todo: InsertTodo): Promise<Todo> {
    const [newTodo] = await db
      .insert(todos)
      .values({
        ...todo,
        userId,
        completed: false,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      })
      .returning();
    return newTodo;
  }

  async updateTodo(id: number, completed: boolean): Promise<Todo> {
    const [todo] = await db
      .update(todos)
      .set({ completed })
      .where(eq(todos.id, id))
      .returning();
    if (!todo) throw new Error("Todo not found");
    return todo;
  }

  async deleteTodo(id: number): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }
}

export const storage = new DatabaseStorage();