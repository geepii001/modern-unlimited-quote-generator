import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema, insertStatsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get favorite quotes
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavoriteQuotes();
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Add quote to favorites
  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertQuoteSchema.parse(req.body);
      const quote = await storage.addToFavorites(validatedData);
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid quote data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add to favorites" });
      }
    }
  });

  // Remove from favorites
  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid quote ID" });
        return;
      }
      await storage.removeFromFavorites(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  // Get stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Update stats
  app.patch("/api/stats", async (req, res) => {
    try {
      const validatedData = insertStatsSchema.partial().parse(req.body);
      const stats = await storage.updateStats(validatedData);
      res.json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid stats data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update stats" });
      }
    }
  });

  // Proxy for ZenQuotes API to handle CORS
  app.get("/api/quotes", async (req, res) => {
    try {
      const response = await fetch("https://zenquotes.io/api/quotes");
      const quotes = await response.json();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes from external API" });
    }
  });

  // Proxy for Type.fit quotes API
  app.get("/api/quotes/typefit", async (req, res) => {
    try {
      const response = await fetch("https://type.fit/api/quotes");
      const quotes = await response.json();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes from Type.fit API" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
