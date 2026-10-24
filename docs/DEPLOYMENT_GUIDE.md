# Virtual Circuit Builder — Deployment Guide

## 1. Instant Public Live URL (Active Now)
Your full-stack application is currently running live on the internet with SSL (HTTPS) termination:
- **Live App URL**: [https://c80a895b2cd874.lhr.life](https://c80a895b2cd874.lhr.life)
- **API Health Check**: [https://c80a895b2cd874.lhr.life/api/health](https://c80a895b2cd874.lhr.life/api/health)

You can open this URL on any phone, tablet, or browser worldwide.

---

## 2. Permanent Free Cloud Hosting with Render (Recommended)
The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint that deploys **both the Flask Backend & Vite Frontend for 100% free**.

### Steps to Deploy:
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add production deployment configurations"
   git push origin main
   ```
2. Go to [https://dashboard.render.com/](https://dashboard.render.com/) (sign up for free with your GitHub account).
3. Click **New +** > **Blueprint**.
4. Select your repository `Akshay2009-codder/Virtual-Circuit-Builder-`.
5. Render will read `render.yaml` and automatically configure:
   - **`virtual-circuit-backend`**: Python 3.11 + Gunicorn WSGI server (Free tier).
   - **`virtual-circuit-frontend`**: Vite Static Site with SPA rewrites (Free tier).
   - Automatically injects the backend API URL into the frontend.
6. Click **Apply** — your app will be deployed with custom `.onrender.com` URLs!

---

## 3. Alternative: Deploy Frontend on Vercel
Vercel offers an ultra-fast global CDN for the frontend:
1. Import your repository into [Vercel](https://vercel.com).
2. Set Root Directory to `circuit-lab/frontend`.
3. The included [`circuit-lab/frontend/vercel.json`](../circuit-lab/frontend/vercel.json) ensures all SPA client-side routes (`/builder`, `/dashboard`, etc.) resolve properly.
4. Add environment variable `VITE_API_URL` pointing to your deployed backend URL.

---

## 4. Deploying with Docker
To deploy to any VPS or cloud container service (Render, Railway, Fly.io, DigitalOcean):
```bash
docker compose up -d --build
```
- Frontend available on port `80`.
- Backend available on port `5000`.
