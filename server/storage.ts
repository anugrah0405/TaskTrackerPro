import { User, InsertUser, Todo, InsertTodo } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private todos: Map<number, Todo>;
  private currentUserId: number;
  private currentTodoId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.todos = new Map();
    this.currentUserId = 1;
    this.currentTodoId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTodos(userId: number): Promise<Todo[]> {
    return Array.from(this.todos.values()).filter(
      (todo) => todo.userId === userId,
    );
  }

  async createTodo(userId: number, todo: InsertTodo): Promise<Todo> {
    const id = this.currentTodoId++;
    const newTodo: Todo = {
      id,
      userId,
      title: todo.title,
      completed: false,
      deadline: todo.deadline ? new Date(todo.deadline) : null,
    };
    this.todos.set(id, newTodo);
    return newTodo;
  }

  async updateTodo(id: number, completed: boolean): Promise<Todo> {
    const todo = this.todos.get(id);
    if (!todo) throw new Error("Todo not found");
    const updatedTodo = { ...todo, completed };
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<void> {
    this.todos.delete(id);
  }
}

export const storage = new MemStorage();
