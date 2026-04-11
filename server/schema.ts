import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * GSZZ Database Schema - SQLite version
 * Tables: users, news, events, clubs, results, galleryImages
 */

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  email: text("email"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const news = sqliteTable("news", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  published: integer("published").default(1).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time"),
  location: text("location").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url"),
  published: integer("published").default(1).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const clubs = sqliteTable("clubs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  imageUrl: text("image_url"),
  mapUrl: text("map_url"),
  memberCount: text("member_count"),
  foundedYear: text("founded_year"),
  managerName: text("manager_name"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Club = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;

export const results = sqliteTable("results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  eventDate: text("event_date").notNull(),
  location: text("location").notNull(),
  pdfUrl: text("pdf_url"),
  imageUrl: text("image_url"),
  content: text("content"),
  published: integer("published").default(1).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Result = typeof results.$inferSelect;
export type InsertResult = typeof results.$inferInsert;

export const galleryAlbums = sqliteTable("gallery_albums", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: text("event_date").notNull(),
  published: integer("published").default(1).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type GalleryAlbum = typeof galleryAlbums.$inferSelect;
export type InsertGalleryAlbum = typeof galleryAlbums.$inferInsert;

export const galleryAlbumImages = sqliteTable("gallery_album_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  albumId: integer("album_id").references(() => galleryAlbums.id, { onDelete: "cascade" }).notNull(),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type GalleryAlbumImage = typeof galleryAlbumImages.$inferSelect;
export type InsertGalleryAlbumImage = typeof galleryAlbumImages.$inferInsert;

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(), // e.g., 'hero_title', 'contact_email'
  value: text("value").notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  pdfUrl: text("pdf_url"),
  published: integer("published").default(1).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;