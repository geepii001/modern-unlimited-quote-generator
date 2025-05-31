import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  quotesGenerated: integer("quotes_generated").default(0),
  favoriteQuotes: integer("favorite_quotes").default(0),
  wallpapersSaved: integer("wallpapers_saved").default(0),
});

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  text: true,
  author: true,
  category: true,
});

export const insertStatsSchema = createInsertSchema(stats).pick({
  quotesGenerated: true,
  favoriteQuotes: true,
  wallpapersSaved: true,
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Stats = typeof stats.$inferSelect;
