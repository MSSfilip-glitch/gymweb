import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import jwt from "jsonwebtoken";
import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import { appRouter, createContext } from "./router.js";

const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);
// If running from dist, the server root is one level up
const serverDir = currentDir.endsWith('dist') || currentDir.endsWith('dist\\') ? path.resolve(currentDir, '..') : currentDir;
const projectRoot = path.resolve(serverDir, '..');

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-gszz-token-key";

// Reusable Express middleware: verifies the httpOnly JWT cookie
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Security headers
  app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled for now since we serve inline styles/scripts

  // Trust Nginx/Cloudflare proxy — required for rate limiter and X-Forwarded-For headers
  app.set('trust proxy', 1);

  // CORS — configurable via env, defaults to localhost for dev
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(',');
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // Rate limiting on auth endpoints
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // 15 attempts per window
    message: { error: "Previše pokušaja prijave. Pokušajte ponovno za 15 minuta." },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/trpc/auth.login', loginLimiter);

  // Mount tRPC
  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Multer upload logic
  const uploadDir = path.resolve(projectRoot, "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        // Sanitize filename: remove path traversal, special chars
        const safeName = file.originalname
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9._-]/g, "")
          .slice(0, 100);
        cb(null, `${Date.now()}-${safeName}`);
      }
  });
  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (_req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Nedopušteni tip datoteke. Dopušteni: JPEG, PNG, GIF, WebP, SVG, PDF.'));
      }
    }
  });

  // Protected upload endpoint — requireAuth runs before Multer processes the file
  // Using upload.array to support both single and multiple file uploads (up to 20 files at once)
  app.post("/api/upload", requireAuth, upload.array("files", 20), (req, res) => {
      // Multer stores files in req.files when using .array()
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
          res.status(400).json({ error: "Nema datoteka za učitavanje" });
          return;
      }
      
      const urls = files.map(f => `/uploads/${f.filename}`);
      
      // For backwards compatibility with single upload components, also return the first URL as `url`
      res.json({ url: urls[0], urls: urls });
      return;
  });

  // Serve static files (uploads + frontend dist)
  app.use("/uploads", express.static(uploadDir));

  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(projectRoot, "client", "dist");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`tRPC API available at http://localhost:${port}/trpc`);
  });
}

startServer().catch(console.error);
