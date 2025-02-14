import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTodoSchema, insertCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const categories = await storage.getCategories(req.user.id);
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const parseResult = insertCategorySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const category = await storage.createCategory(req.user.id, parseResult.data);
    res.status(201).json(category);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    await storage.deleteCategory(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Todos endpoints
  app.get("/api/todos", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const todos = await storage.getTodos(req.user.id);
    res.json(todos);
  });

  app.post("/api/todos", async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const parseResult = insertTodoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const todo = await storage.createTodo(req.user.id, parseResult.data);
    res.status(201).json(todo);
  });

  app.patch("/api/todos/:id", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const todo = await storage.updateTodo(
      parseInt(req.params.id),
      req.body.completed
    );
    res.json(todo);
  });

  app.delete("/api/todos/:id", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    await storage.deleteTodo(parseInt(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}