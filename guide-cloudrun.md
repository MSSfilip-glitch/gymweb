# Alternative Deployment Guide: Google Cloud Run

This guide outlines the theoretical steps and required architectural changes necessary to host the GymWeb application on **Google Cloud Run** instead of a traditional VPS like Hetzner.

Cloud Run is a highly scalable, serverless environment. However, because it is "stateless", this setup differs significantly from the standard `guide.md`.

---

## 1. The Serverless "Stateless" Reality

Google Cloud Run automatically spins containers up when traffic hits your site, and spins them down to zero when the site is inactive to save money. When a container shuts down, **everything saved on its local file system is permanently deleted.**

Because the current GymWeb stack uses local storage for both its database and its media files, **you cannot deploy the current codebase directly to Cloud Run without losing data.**

### Required Architecture Changes:

#### A. Database Migration (SQLite -> PostgreSQL)
- **Current State:** The app uses `SQLite`, storing all tables in a local `gszz.db` file.
- **Problem:** If deployed to Cloud Run, `gszz.db` will be wiped clean every time the container goes to sleep.
- **Cloud Run Solution:** You must rewrite the Drizzle ORM schema to use `PostgreSQL` instead of `SQLite` (`drizzle-orm/pg-core`). You will then need to host a stateful database externally. Options include:
  - **Google Cloud SQL:** Fully managed, but costs ~$10-15+/month minimum.
  - **Neon / Supabase:** Third-party providers with generous free tiers for serverless Postgres.

#### B. Media Uploads Migration (Local Disk -> Cloud Storage)
- **Current State:** Images and PDFs are uploaded via the `multer` package and saved securely to `/client/public/uploads`.
- **Problem:** Just like the DB, any uploaded files will vanish upon container restart.
- **Cloud Run Solution:** You must provision a **Google Cloud Storage (GCS)** Bucket. The backend's `/api/upload` endpoint must be rewritten using the `@google-cloud/storage` SDK. The Node server will intercept the upload and stream the file directly into the GCS bucket, saving the public Google URL into the database instead of a local file path.

---

## 2. Dockerizing the Application

Cloud Run solely runs Docker containers. Since GymWeb consists of both a client and a server, you must containerize them together.

You would need to create a `Dockerfile` in the project root:

```dockerfile
# Build the Vite Frontend
FROM node:20-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Build the Express/tRPC Backend
FROM node:20-alpine AS build-server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .
RUN npm run build

# Final Production Image
FROM node:20-alpine
WORKDIR /app
# Copy built files
COPY --from=build-client /app/client/dist ./client/dist
COPY --from=build-server /app/server/dist ./server/dist
COPY --from=build-server /app/server/package*.json ./server/

# Install only production dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Cloud Run injects the PORT env variable (usually 8080)
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
```

---

## 3. Automation via gcloud CLI

If the codebase were updated to PostgreSQL and GCS, the deployment would be incredibly fast and automated using the Google Cloud CLI (`gcloud`).

Instead of manually setting up Nginx, SSHing, and installing Node on a server, deployment becomes a single command run from the project root:

```bash
gcloud run deploy gymweb-service \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=your_postgres_url,GCS_BUCKET=gymweb-media"
```

Google's Cloud Build would automatically read the Dockerfile, compile the application, distribute it across Google's infrastructure, and provision a free SSL certificate.

---

## 4. Connecting a Custom .hr Domain

Unlike Nginx configs, Cloud Run handles domain mapping graphically via the cloud console:

1. Go to the **Cloud Run** console.
2. Select your deployed `gymweb-service`.
3. Click "Integrations" and select **"Add Custom Domain"**.
4. Enter your `your-domain.hr`.
5. Google will provide you with specific **A**, **AAAA**, or **CNAME** DNS records.
6. Simply copy those records into your CARNET/provider DNS management panel. Cloud Run handles the automated routing and Let's Encrypt SSL certificates dynamically.

---

## Summary

Hosting on Cloud Run is a fantastic option for zero-maintenance auto-scaling. However, because it fundamentally demands an external database and external file storage, sticking to a traditional VPS (Hetzner) is heavily recommended for this specific project if maintaining a zero-to-low cost infrastructure using native SQLite and local disk files is the primary goal.
