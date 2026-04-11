# GymWeb - Deployment & Finalization Roadmap

## Phase 4: Production Deployment (VPS) 🚀

This list focuses exclusively on the steps required to take the finalized, CMS-driven platform and deploy it to a live production server.

### 1. Server Preparation (Ubuntu/Debian VPS)
- [ ] SSH into the VPS and update packages (`sudo apt update && sudo apt upgrade`).
- [ ] Install Node.js (v20+ recommended) and npm.
- [ ] Install PM2 globally (`npm install -g pm2`).
- [ ] Install Nginx (`sudo apt install nginx`).
- [ ] Clone the GSZZ repository to `/var/www/gymWeb`.

### 2. Environment Configuration
- [ ] In `/var/www/gymWeb/server`, create a `.env` file containing:
  ```env
  NODE_ENV=production
  PORT=3000
  JWT_SECRET=vaša-vrlo-sigurna-i-dugacka-tajna
  ```
- [ ] Ensure the `/var/www/gymWeb/server/public/uploads` directory exists and has write permissions.
- [ ] **MANDATORY:** Upload your video file (`hero-video.mp4`) into the `/var/www/gymWeb/client/public/` directory. This video is used for the automated background loop on the Home page as requested.

### 3. Build & Run
- [ ] In `/var/www/gymWeb/client`, run `npm install` and then `npm run build` to generate the Vite dist folder.
- [ ] In `/var/www/gymWeb/server`, run `npm install` and then `npm run build` (if TypeScript compilation is required) or just use standard execution.
- [ ] Start the Express server using PM2:
  `pm2 start index.ts --name "gszz-api" --interpreter ./node_modules/.bin/tsx`
  *(Note: Adapt the interpreter based on your TS setup. Alternatively, compile to JS first).*

### 4. Nginx Reverse Proxy & SSL
- [ ] Configure an Nginx Server Block (`/etc/nginx/sites-available/gszz`):
  ```nginx
  server {
      server_name vasa-domena.hr www.vasa-domena.hr;

      # Serve API and Uploads from backend
      location /trpc/ {
          proxy_pass http://localhost:3000;
          # standard proxy headers...
      }
      location /api/ {
          proxy_pass http://localhost:3000;
      }
      location /uploads/ {
          proxy_pass http://localhost:3000;
      }

      # Serve Frontend SPA
      location / {
          root /var/www/gymWeb/client/dist;
          try_files $uri $uri/ /index.html;
      }
  }
  ```
- [ ] Enable the site and restart Nginx (`systemctl restart nginx`).
- [ ] Install Certbot and obtain a free SSL certificate: `sudo certbot --nginx -d vasa-domena.hr -d www.vasa-domena.hr`.

### 5. Final Checks
- [ ] Access the live URL. Ensure the Admin panel loads and logs in successfully.
- [ ] Test the global CMS text overrides.
- [ ] Upload a test image in the News section to verify local Multer storage rules.
- [ ] Register Google Analytics or Search Console if requested.
