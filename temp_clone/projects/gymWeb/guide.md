# GymWeb - Detailed Deployment & Hosting Guide

This document is a step-by-step manual designed for users without advanced programming knowledge. It covers everything needed to purchase a server, configure a CARNET domain, and deploy the GymWeb application to the internet.

Based on the infrastructure analysis, the recommended and most cost-effective option for this application stack is a **Virtual Private Server (VPS) on Hetzner Cloud**.

---

## Phase 1: Server Procurement (Hetzner)
1. Go to [Hetzner Cloud](https://www.hetzner.com/cloud) and create an account.
2. After verification, click on **"New Project"** in the console and name it, for example, `GymWeb`.
3. Click on **"Add Server"**:
   - **Location:** `Falkenstein` or `Nuremberg` (Germany - closest location).
   - **Image:** `Ubuntu 24.04`
   - **Type:** Leave it defined as `Shared vCPU`, and select the `x86` architecture.
   - Choose the **CX22** package (or the smallest available, e.g., CPX11). This costs around €4.50/month and provides ample resources (4GB RAM) for this application.
   - **SSH Keys:** Strongly recommended — add your public SSH key instead of relying on a root password. Click "Add SSH Key" and paste the contents of your `~/.ssh/id_rsa.pub` file.
   - **Networking:** `IPv4 & IPv6`.
   - **Name:** Enter a name, e.g., `gymweb-server`.
4. Click **"Create & Buy Now"**.
5. You will receive the server's **IP Address** via email (and a root password if you didn't add an SSH key). Save these details!

---

## Phase 2: CARNET DNS Configuration (.hr domain)
If you have a free or paid `.hr` domain (issued by CARNET), you need to point that domain to the IP address of your new Hetzner server.

1. If you registered the domain through a reseller (Avalon, Plus hosting, InfoNet), log into their customer portal and locate the **DNS Management** (or DNS Zone Editor) option.
   - If you registered the domain directly with CARNET (e.g., domene.hr portal), request admin access and follow the email instructions to manage DNS records.
2. Inside the DNS table, you need to add (or edit existing) **A Records**:
   - **First Record:** 
     - Host (Name): `@` (or leave blank)
     - Type: `A`
     - Value/IP: *Enter the IPv4 address you received from Hetzner.*
   - **Second Record:** 
     - Host (Name): `www`
     - Type: `A`
     - Value/IP: *The same IPv4 address.*
3. Save the changes. *Note: It can sometimes take 1 to 24 hours for DNS changes to propagate globally.*

> **Tip:** You can verify DNS propagation using [dnschecker.org](https://dnschecker.org) by entering your domain and checking the A records.

---

## Phase 3: Server Connection and Preparation
On your computer (Windows: use **PowerShell** or **CMD**; macOS/Linux: use **Terminal**) and follow the instructions:

### 1. Connecting
Type the following command, replacing `IP_ADDRESS` with your Hetzner IP:
```bash
ssh root@IP_ADDRESS
```
Type `yes` if asked to confirm the `fingerprint`, then enter the root password from your email (or it will connect automatically if you used an SSH key). You will immediately be prompted to define a new, permanent password.

### 2. Setting up a Basic Firewall
Before installing anything, secure the server with a basic firewall:
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```
Type `y` when prompted. This allows only SSH (port 22) and web traffic (ports 80/443), blocking everything else.

### 3. Updating and installing essential tools
Once inside the server terminal (it will display something like `root@gymweb-server:~#`), copy and run the following commands in order (press Enter for each text block):

```bash
# Update the system
apt update && apt upgrade -y

# Install Nginx (Web server) and utility packages
apt install nginx curl git certbot python3-certbot-nginx -y

# Install Node.js (version 20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install PM2 globally (keeps the API running permanently)
npm install -g pm2
```

---

## Phase 4: Application Transfer and Startup

### 1. Cloning the Code
We need to fetch the application source code. Assuming the code is hosted on GitHub:
```bash
mkdir -p /var/www
cd /var/www
# Clone your repository (update the URL below with your actual repo):
git clone https://github.com/your-username/gymweb.git gymWeb
cd gymWeb
```
*(If you don't use GitHub or Git, you can transfer the files directly from your computer to the `/var/www/gymWeb` folder using an SFTP client like FileZilla or WinSCP).*

### 2. Environment Configuration
The application loads its environment from a `.env` file in the **project root**. Create it:
```bash
cd /var/www/gymWeb
nano .env
```
In the editor, paste the following:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE
CORS_ORIGIN=https://your-domain.hr
```

> **How to generate a secure JWT secret:**
> On the server, run: `openssl rand -hex 48` and paste the output as the `JWT_SECRET` value.
> Replace `your-domain.hr` in `CORS_ORIGIN` with your actual domain (e.g., `https://gszz.hr`).

Press `CTRL + X`, type `Y`, then press `Enter` to save the file.

### 3. Installing Packages and Building

Install dependencies and build both the server and client:
```bash
cd /var/www/gymWeb

# Install root-level dependencies
npm install

# Install and build the backend
cd server
npm install
npm run build

# Install and build the frontend
cd ../client
npm install
npm run build

# Return to project root
cd ..
```

### 4. Seeding the Database
The database (SQLite) is created automatically on first run. Seed it with initial data:
```bash
cd /var/www/gymWeb
npm run db:seed
```
This creates the initial clubs, news, events, and sample content. Then create the admin user by starting the server temporarily:
```bash
cd /var/www/gymWeb
node server/dist/index.js &
# Wait 2 seconds for it to start, then call the seed endpoint:
sleep 2
curl -X POST http://localhost:3000/trpc/auth.seedAdmin
# Stop the temporary server
kill %1
```

### 5. Starting the Backend with PM2
Now start the server permanently using PM2 with the **compiled JavaScript** (not tsx — it's faster and more stable for production):
```bash
cd /var/www/gymWeb
pm2 start server/dist/index.js --name "gszz-api" --cwd /var/www/gymWeb

# Save the PM2 state so it restarts after reboots
pm2 save
pm2 startup
```

> **Important:** The `--cwd /var/www/gymWeb` flag ensures the server runs from the project root, which is required for `dotenv` to find the `.env` file and for the database path (`gszz.db`) to resolve correctly.

### 6. Upload Directory & Hero Video
Create the public uploads directory and add any media assets:
```bash
mkdir -p /var/www/gymWeb/public/uploads
```
*(ATTENTION: Upload your specific background video to `/var/www/gymWeb/client/dist/hero-video.mp4` so the animated hero section background works. If the video is in `client/public/`, rebuild the client to include it in `dist/`.)*

---

## Phase 4.5: Post-QA Security Hardening

> ⚠️ **Complete these steps AFTER QA testing is finished and BEFORE the site goes live to the public.**

### 1. Remove the Admin Seed Endpoint
The `seedAdmin` tRPC endpoint allows anyone to create an admin account if none exists. It must be removed before going public.

Open the router file:
```bash
nano /var/www/gymWeb/server/router.ts
```
Find and **delete** the entire `seedAdmin` block (search for `seedAdmin` — it's about 15 lines). Save the file.

### 2. Remove the Default Credential Hint
The admin login page currently displays `Zadano: admin / admin123`. This must be removed.

Open the Admin page:
```bash
nano /var/www/gymWeb/client/src/pages/Admin.tsx
```
Find and **delete** the following lines (search for `Zadano`):
```html
<p className="text-xs text-muted-foreground text-center">
  Zadano: admin / admin123
</p>
```
Save the file.

### 3. Change the Default Admin Password
Connect to the database directly to set a strong password:
```bash
cd /var/www/gymWeb
node -e "
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('./gszz.db');
const hash = bcrypt.hashSync('YOUR_NEW_STRONG_PASSWORD', 10);
db.prepare('UPDATE users SET password_hash = ? WHERE username = ?').run(hash, 'admin');
console.log('Password updated successfully');
db.close();
"
```
Replace `YOUR_NEW_STRONG_PASSWORD` with a strong, unique password (at least 12 characters, mixed case, numbers, symbols).

### 4. Regenerate the JWT Secret
Generate a fresh JWT secret for production (this invalidates any tokens from QA testing):
```bash
openssl rand -hex 48
```
Edit the `.env` file and replace the `JWT_SECRET` value:
```bash
nano /var/www/gymWeb/.env
```

### 5. Rebuild and Restart
After making the above changes, rebuild everything and restart:
```bash
cd /var/www/gymWeb/client && npm run build
cd /var/www/gymWeb/server && npm run build
pm2 restart gszz-api
```

---

## Phase 5: Connecting the Domain via Nginx (Go Live)

### 1. Nginx Configuration
We must tell Nginx where to route incoming traffic correctly.
```bash
nano /etc/nginx/sites-available/gszz
```
Paste the following configuration (**change `your-domain.hr` to your actual domain name!**):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.hr www.your-domain.hr;

    # Backend API Routing
    location /trpc/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /uploads/ {
        proxy_pass http://localhost:3000;
    }

    # Serve the built React Frontend
    location / {
        root /var/www/gymWeb/client/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Allow larger file uploads (images, PDFs)
    client_max_body_size 15M;
}
```
Press `CTRL + X`, `Y`, `Enter`.

> **Note:** The `X-Real-IP` and `X-Forwarded-For` headers are important — they allow the Express rate limiter and logging to see the real visitor IP instead of `127.0.0.1`.

### 2. Activate Nginx Profile
```bash
# Activate the configuration by creating a symlink
ln -s /etc/nginx/sites-available/gszz /etc/nginx/sites-enabled/

# Remove the default Nginx splash page
rm -f /etc/nginx/sites-enabled/default

# Test the configuration for syntax errors
nginx -t

# Restart Nginx
systemctl restart nginx
```
> **Important:** If `nginx -t` shows any errors, fix them before restarting. Common issues are typos in the domain name or missing semicolons.

### 3. SSL Certificate (HTTPS — The Green Padlock 🔒)
An SSL certificate encrypts all traffic between your visitors and the server. This is **required** for:
- The browser's green padlock/HTTPS indicator
- Secure cookie transmission (your auth cookies are set with `secure: true` in production)
- SEO (Google ranks HTTPS sites higher)
- User trust

We use **Let's Encrypt** which provides free, auto-renewing certificates:
```bash
certbot --nginx -d your-domain.hr -d www.your-domain.hr
```
Follow the prompts:
1. Enter your email address (for renewal notifications)
2. Agree to the Terms of Service (`Y`)
3. Choose whether to share your email with EFF (optional)
4. Certbot will automatically configure Nginx for HTTPS and redirect HTTP → HTTPS

> **About certificates:** Unlike commercial SSL certificates (which can cost €50-200/year), Let's Encrypt is completely free and is used by the majority of websites worldwide. It auto-renews every 90 days via a systemd timer that certbot installs automatically. You do **not** need to purchase any certificate for a website like this.

### 4. Verify Everything is Working
After SSL is configured, test the complete setup:
```bash
# Check Nginx is running
systemctl status nginx

# Check PM2 is running the API
pm2 status

# Check the site loads over HTTPS
curl -I https://your-domain.hr
```
You should see `HTTP/2 200` in the curl output.

Also verify in your browser:
- `https://your-domain.hr` — main site loads
- `https://your-domain.hr/admin` — admin panel loads
- `http://your-domain.hr` — automatically redirects to HTTPS

---

## Phase 6: Database Backups (Recommended)

SQLite stores all your data in a single file (`gszz.db`). If the server fails or you accidentally delete content, you'll want a backup. Set up automatic daily backups:

```bash
# Create a backup directory
mkdir -p /var/backups/gymweb

# Create a backup script
nano /var/www/gymWeb/backup.sh
```

Paste the following:
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/gymweb"
DB_PATH="/var/www/gymWeb/gszz.db"

# Use SQLite's .backup command for a safe copy (even while the app is running)
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/gszz_$TIMESTAMP.db'"

# Also backup uploaded files
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C /var/www/gymWeb/public uploads/ 2>/dev/null

# Keep only the last 14 backups (2 weeks)
ls -t "$BACKUP_DIR"/gszz_*.db | tail -n +15 | xargs rm -f 2>/dev/null
ls -t "$BACKUP_DIR"/uploads_*.tar.gz | tail -n +15 | xargs rm -f 2>/dev/null

echo "Backup completed: gszz_$TIMESTAMP.db"
```

Save and make it executable:
```bash
chmod +x /var/www/gymWeb/backup.sh

# Install sqlite3 CLI for safe backups
apt install sqlite3 -y

# Test the backup manually
/var/www/gymWeb/backup.sh

# Schedule daily automatic backups at 3:00 AM
crontab -e
```
Add this line at the bottom of the crontab file:
```
0 3 * * * /var/www/gymWeb/backup.sh >> /var/log/gymweb-backup.log 2>&1
```

---

## Finished! 🎉
Your GymWeb application, administrative panel, and local database are now live on your actual domain protected by SSL encryption. You can access the CMS login via `your-domain.hr/admin`, and upload content normally.

> ⚠️ **Security Reminder:** If you skipped Phase 4.5 (Post-QA Security Hardening), go back and complete it NOW before announcing the site publicly. The default admin credentials and seed endpoint are serious vulnerabilities if left in production.

**Routine Maintenance:**
- After any future code changes pushed to GitHub:
  ```bash
  cd /var/www/gymWeb && git pull
  cd client && npm install && npm run build
  cd ../server && npm install && npm run build
  pm2 restart gszz-api
  ```
- SSL certificates automatically renew every 90 days. You can check the auto-renewal timer with `systemctl list-timers | grep certbot`. To force a renewal test: `certbot renew --dry-run`.
- Periodically check for dependency vulnerabilities: `npm audit` in both `client/` and `server/` directories.
- Check PM2 logs if the API has issues: `pm2 logs gszz-api`.
- Database backups are saved daily at 3:00 AM in `/var/backups/gymweb/`. To restore a backup, stop the server (`pm2 stop gszz-api`), replace `gszz.db` with a backup file, and restart (`pm2 start gszz-api`).

**Monitoring (optional):**
- View real-time server metrics: `pm2 monit`
- Check Nginx access logs: `tail -f /var/log/nginx/access.log`
- Check Nginx error logs: `tail -f /var/log/nginx/error.log`
