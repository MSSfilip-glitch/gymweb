import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "./db.js";
import { news, events, clubs, results, users, settings, galleryAlbums, galleryAlbumImages } from "./schema.js";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-gszz-token-key";

// Context to extract Auth header (or cookie)
export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    let token = req.cookies?.token;
    // Fallback for transition mostly
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    return { req, res, token };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to check if user is authenticated via JWT
const isAuthed = t.middleware(async ({ ctx, next }) => {
    if (!ctx.token) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing token" });
    }
    
    let userId: number;
    try {
        const decoded = jwt.verify(ctx.token, JWT_SECRET) as { id: number };
        userId = decoded.id;
    } catch (err) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
    }

    const user = db.select().from(users).where(eq(users.id, userId)).all();
    if (user.length === 0) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
    }

    return next({
        ctx: {
            user: user[0],
        },
    });
});

export const protectedProcedure = t.procedure.use(isAuthed);

export const appRouter = router({
    // ==================== SETTINGS (CMS) ====================
    settings: router({
        // Publicly query all settings as a key-value object
        getAll: publicProcedure.query(async () => {
            const allSettings = db.select().from(settings).all();
            const settingsMap: Record<string, string> = {};
            allSettings.forEach(s => {
                settingsMap[s.key] = s.value;
            });
            return settingsMap;
        }),

        // Protected endpoint to bulk update settings
        updateMany: protectedProcedure
            .input(z.record(z.string(), z.string()))
            .mutation(async ({ input }) => {
                for (const [key, value] of Object.entries(input)) {
                    // UPSERT logic in SQLite isn't native to basic Drizzle without ON CONFLICT,
                    // so we do a quick check and insert/update
                    const existing = db.select().from(settings).where(eq(settings.key, key)).all();
                    if (existing.length > 0) {
                        db.update(settings).set({ value, updatedAt: new Date().toISOString() }).where(eq(settings.key, key)).run();
                    } else {
                        db.insert(settings).values({ key, value }).run();
                    }
                }
                return { success: true };
            }),
    }),

    // ==================== NEWS ====================
    news: router({
        list: publicProcedure.query(async () => {
            return db.select().from(news).orderBy(desc(news.createdAt)).all();
        }),

        getById: publicProcedure.input(z.number()).query(async ({ input }) => {
            const result = db.select().from(news).where(eq(news.id, input)).all();
            return result[0] ?? null;
        }),

        create: protectedProcedure
            .input(z.object({
                title: z.string().min(1).max(300),
                excerpt: z.string().min(1).max(1000),
                content: z.string().max(200000).optional(),
                category: z.string().min(1).max(100),
                imageUrl: z.string().max(2000).optional(),
            }))
            .mutation(async ({ input }) => {
                const result = db.insert(news).values({
                    title: input.title,
                    excerpt: input.excerpt,
                    content: input.content ?? null,
                    category: input.category,
                    imageUrl: input.imageUrl ?? null,
                }).returning().all();
                return result[0];
            }),

        update: protectedProcedure
            .input(z.object({
                id: z.number(),
                title: z.string().optional(),
                excerpt: z.string().optional(),
                content: z.string().optional(),
                category: z.string().optional(),
                imageUrl: z.string().max(2000).optional(),
            }))
            .mutation(async ({ input }) => {
                const { id, ...data } = input;
                const updateData: Record<string, unknown> = {};
                if (data.title !== undefined) updateData.title = data.title;
                if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
                if (data.content !== undefined) updateData.content = data.content;
                if (data.category !== undefined) updateData.category = data.category;
                if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
                updateData.updatedAt = new Date().toISOString();
                db.update(news).set(updateData).where(eq(news.id, id)).run();
                return { success: true };
            }),

        delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
            db.delete(news).where(eq(news.id, input)).run();
            return { success: true };
        }),
    }),

    // ==================== EVENTS ====================
    events: router({
        list: publicProcedure.query(async () => {
            return db.select().from(events).orderBy(desc(events.eventDate)).all();
        }),

        create: protectedProcedure
            .input(z.object({
                title: z.string().min(1).max(300),
                description: z.string().max(5000).optional(),
                eventDate: z.string().min(1).max(100),
                eventTime: z.string().max(100).optional(),
                location: z.string().min(1).max(500),
                type: z.string().min(1).max(100),
                imageUrl: z.string().max(2000).optional(),
            }))
            .mutation(async ({ input }) => {
                const result = db.insert(events).values({
                    title: input.title,
                    description: input.description ?? null,
                    eventDate: input.eventDate,
                    eventTime: input.eventTime ?? null,
                    location: input.location,
                    type: input.type,
                    imageUrl: input.imageUrl ?? null,
                }).returning().all();
                return result[0];
            }),

        update: protectedProcedure
            .input(z.object({
                id: z.number(),
                title: z.string().optional(),
                description: z.string().optional(),
                eventDate: z.string().optional(),
                location: z.string().optional(),
                type: z.string().optional(),
                imageUrl: z.string().optional(),
            }))
            .mutation(async ({ input }) => {
                const { id, ...data } = input;
                const updateData: Record<string, unknown> = {};
                if (data.title !== undefined) updateData.title = data.title;
                if (data.description !== undefined) updateData.description = data.description;
                if (data.eventDate !== undefined) updateData.eventDate = data.eventDate;
                if (data.location !== undefined) updateData.location = data.location;
                if (data.type !== undefined) updateData.type = data.type;
                if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
                db.update(events).set(updateData).where(eq(events.id, id)).run();
                return { success: true };
            }),

        delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
            db.delete(events).where(eq(events.id, input)).run();
            return { success: true };
        }),
    }),

    // ==================== CLUBS ====================
    clubs: router({
        list: publicProcedure.query(async () => {
            return db.select().from(clubs).all();
        }),

        create: protectedProcedure
            .input(z.object({
                name: z.string().min(1).max(300),
                city: z.string().min(1).max(200),
                address: z.string().max(500).optional(),
                phone: z.string().max(50).optional(),
                email: z.string().max(200).optional(),
                website: z.string().max(500).optional(),
                imageUrl: z.string().max(2000).optional(),
            }))
            .mutation(async ({ input }) => {
                const result = db.insert(clubs).values({
                    name: input.name,
                    city: input.city,
                    address: input.address ?? null,
                    phone: input.phone ?? null,
                    email: input.email ?? null,
                    website: input.website ?? null,
                    imageUrl: input.imageUrl ?? null,
                }).returning().all();
                return result[0];
            }),

        update: protectedProcedure
            .input(z.object({
                id: z.number(),
                name: z.string().optional(),
                city: z.string().optional(),
                address: z.string().optional(),
                phone: z.string().optional(),
                email: z.string().optional(),
                imageUrl: z.string().optional(),
            }))
            .mutation(async ({ input }) => {
                const { id, ...data } = input;
                const updateData: Record<string, unknown> = {};
                if (data.name !== undefined) updateData.name = data.name;
                if (data.city !== undefined) updateData.city = data.city;
                if (data.address !== undefined) updateData.address = data.address;
                if (data.phone !== undefined) updateData.phone = data.phone;
                if (data.email !== undefined) updateData.email = data.email;
                if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
                db.update(clubs).set(updateData).where(eq(clubs.id, id)).run();
                return { success: true };
            }),

        delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
            db.delete(clubs).where(eq(clubs.id, input)).run();
            return { success: true };
        }),
    }),

    // ==================== GALLERY ALBUMS ====================
    gallery: router({
        list: publicProcedure.query(async () => {
            const albums = db.select().from(galleryAlbums).orderBy(desc(galleryAlbums.eventDate)).all();
            const allImages = db.select().from(galleryAlbumImages).orderBy(galleryAlbumImages.displayOrder).all();
            
            // Map images to albums
            return albums.map(album => ({
                ...album,
                images: allImages.filter(img => img.albumId === album.id)
            }));
        }),

        create: protectedProcedure
            .input(z.object({
                title: z.string().min(1).max(300),
                description: z.string().max(2000).optional(),
                eventDate: z.string().min(1).max(100),
            }))
            .mutation(async ({ input }) => {
                const result = db.insert(galleryAlbums).values({
                    title: input.title,
                    description: input.description ?? null,
                    eventDate: input.eventDate,
                }).returning().all();
                return result[0];
            }),

        delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
            db.delete(galleryAlbums).where(eq(galleryAlbums.id, input)).run();
            // Note: album images cascade delete via SQLite schema foreign keys
            return { success: true };
        }),

        update: protectedProcedure
            .input(z.object({
                id: z.number(),
                title: z.string().optional(),
                description: z.string().optional(),
                eventDate: z.string().optional(),
            }))
            .mutation(async ({ input }) => {
                const { id, ...data } = input;
                const updateData: Record<string, unknown> = {};
                if (data.title !== undefined) updateData.title = data.title;
                if (data.description !== undefined) updateData.description = data.description;
                if (data.eventDate !== undefined) updateData.eventDate = data.eventDate;
                db.update(galleryAlbums).set(updateData).where(eq(galleryAlbums.id, id)).run();
                return { success: true };
            }),
            
        addImages: protectedProcedure
            .input(z.object({
                albumId: z.number(),
                images: z.array(z.string().min(1).max(2000)),
            }))
            .mutation(async ({ input }) => {
                for (const url of input.images) {
                     db.insert(galleryAlbumImages).values({
                         albumId: input.albumId,
                         imageUrl: url,
                     }).run();
                }
                return { success: true };
            }),
            
        removeImage: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
            db.delete(galleryAlbumImages).where(eq(galleryAlbumImages.id, input)).run();
            return { success: true };
        }),
    }),

    // ==================== RESULTS ====================
    results: router({
        list: publicProcedure.query(async () => {
            return db.select().from(results).orderBy(desc(results.eventDate)).all();
        }),

        create: protectedProcedure
            .input(z.object({
                title: z.string().min(1).max(300),
                eventDate: z.string().min(1).max(100),
                location: z.string().min(1).max(500),
                pdfUrl: z.string().max(2000).optional(),
                imageUrl: z.string().max(2000).optional(),
                content: z.string().max(200000).optional(),
            }))
            .mutation(async ({ input }) => {
                const result = db.insert(results).values({
                    title: input.title,
                    eventDate: input.eventDate,
                    location: input.location,
                    pdfUrl: input.pdfUrl ?? null,
                    imageUrl: input.imageUrl ?? null,
                    content: input.content ?? null,
                }).returning().all();
                return result[0];
            }),

        delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
            db.delete(results).where(eq(results.id, input)).run();
            return { success: true };
        }),

        update: protectedProcedure
            .input(z.object({
                id: z.number(),
                title: z.string().optional(),
                eventDate: z.string().optional(),
                location: z.string().optional(),
                pdfUrl: z.string().optional(),
                imageUrl: z.string().optional(),
                content: z.string().optional(),
            }))
            .mutation(async ({ input }) => {
                const { id, ...data } = input;
                const updateData: Record<string, unknown> = {};
                if (data.title !== undefined) updateData.title = data.title;
                if (data.eventDate !== undefined) updateData.eventDate = data.eventDate;
                if (data.location !== undefined) updateData.location = data.location;
                if (data.pdfUrl !== undefined) updateData.pdfUrl = data.pdfUrl;
                if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
                if (data.content !== undefined) updateData.content = data.content;
                db.update(results).set(updateData).where(eq(results.id, id)).run();
                return { success: true };
            }),
    }),

    // ==================== AUTH ====================
    auth: router({
        login: publicProcedure
            .input(z.object({
                username: z.string().min(1),
                password: z.string().min(1),
            }))
            .mutation(async ({ input, ctx }) => {
                const user = db.select().from(users).where(eq(users.username, input.username)).all();
                if (user.length === 0) {
                    throw new Error("Krivi korisničko ime ili lozinka");
                }
                const valid = bcrypt.compareSync(input.password, user[0].passwordHash);
                if (!valid) {
                    throw new Error("Krivi korisničko ime ili lozinka");
                }
                
                // Sign JWT
                const token = jwt.sign({ id: user[0].id }, JWT_SECRET, { expiresIn: "7d" });
                
                // Set cookie on response
                ctx.res.cookie("token", token, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

                // Return user info.
                return {
                    id: user[0].id,
                    username: user[0].username,
                    name: user[0].name,
                    role: user[0].role,
                };
            }),


        // Logout — clear the httpOnly cookie
        logout: publicProcedure.mutation(async ({ ctx }) => {
            ctx.res.clearCookie("token", {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
            });
            return { success: true };
        }),
    }),
});

export type AppRouter = typeof appRouter;
