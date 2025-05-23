import { users, todos, categories, type User, type InsertUser, type Todo, type InsertTodo, type Category, type InsertCategory } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCategories(userId: number): Promise<Category[]>;
  createCategory(userId: number, category: InsertCategory): Promise<Category>;
  deleteCategory(id: number, userId: number): Promise<void>;

  getTodos(userId: number): Promise<Todo[]>;
  createTodo(userId: number, todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, userId: number, completed: boolean): Promise<Todo>;
  updateTodoDetails(id: number, userId: number, todo: Partial<InsertTodo>): Promise<Todo>;
  deleteTodo(id: number, userId: number): Promise<void>;

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

  async getCategories(userId: number): Promise<Category[]> {
    return db.select().from(categories).where(eq(categories.userId, userId));
  }

  async createCategory(userId: number, category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values({ ...category, userId })
      .returning();
    return newCategory;
  }

  async deleteCategory(id: number, userId: number): Promise<void> {
    await db.delete(categories)
      .where(
        and(
          eq(categories.id, id),
          eq(categories.userId, userId)
        )
      );
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

  async updateTodo(id: number, userId: number, completed: boolean): Promise<Todo> {
    const [todo] = await db
      .update(todos)
      .set({ completed })
      .where(
        and(
          eq(todos.id, id),
          eq(todos.userId, userId)
        )
      )
      .returning();
    if (!todo) throw new Error("Todo not found or unauthorized");
    return todo;
  }

  async updateTodoDetails(id: number, userId: number, todo: Partial<InsertTodo>): Promise<Todo> {
    const [updatedTodo] = await db
      .update(todos)
      .set({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : undefined,
      })
      .where(
        and(
          eq(todos.id, id),
          eq(todos.userId, userId)
        )
      )
      .returning();
    if (!updatedTodo) throw new Error("Todo not found or unauthorized");
    return updatedTodo;
  }

  async deleteTodo(id: number, userId: number): Promise<void> {
    await db.delete(todos)
      .where(
        and(
          eq(todos.id, id),
          eq(todos.userId, userId)
        )
      );
  }
}

export const storage = new DatabaseStorage();