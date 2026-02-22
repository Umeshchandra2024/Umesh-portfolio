# Deploying Frontend and Dashboard Separately

You have two Vite apps:
- **Portfolio (frontend)** – root folder, public site
- **Dashboard** – `dashboard/` folder, admin app

Both need your **backend API URL** as an environment variable: `VITE_API_URL`.

---

## 1. Deploy the backend first

Deploy your Node.js backend (e.g. Render, Railway, Fly.io) and note the API URL, e.g.:

- `https://your-api.onrender.com`

The frontend and dashboard will call this URL.

---

## 2. Set environment variable

For both apps, set in the hosting dashboard:

| Variable       | Value                    | Required |
|----------------|--------------------------|----------|
| `VITE_API_URL` | Your backend API URL     | Yes      |

Example: `VITE_API_URL=https://your-api.onrender.com`  
(No trailing slash.)

---

## 3a. Deploy with Vercel (recommended)

### Portfolio (frontend)

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New Project** → import your repo.
3. **Root Directory:** leave as **`.`** (project root).
4. **Framework Preset:** Vite (or leave auto).
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Environment Variables:** add `VITE_API_URL` = your backend URL.
8. Deploy. Your portfolio will be at `https://your-project.vercel.app`.

### Dashboard

1. **Add New Project** again → same repo.
2. **Root Directory:** set to **`dashboard`**.
3. **Framework Preset:** Vite.
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables:** add `VITE_API_URL` = same backend URL.
7. Deploy. Dashboard will be at a different URL, e.g. `https://your-dashboard.vercel.app`.

`vercel.json` in root and in `dashboard/` are already set for SPA routing.

---

## 3b. Deploy with Netlify

### Portfolio (frontend)

1. Go to [netlify.com](https://netlify.com) and sign in.
2. **Add new site** → **Import an existing project** (e.g. GitHub).
3. **Base directory:** leave empty (root).
4. **Build command:** `npm run build`
5. **Publish directory:** `dist`
6. **Environment variables:** add `VITE_API_URL` = your backend URL.
7. Deploy.

### Dashboard

1. **Add new site** again → same repo.
2. **Base directory:** `dashboard`
3. **Build command:** `npm run build`
4. **Publish directory:** `dist`
5. **Environment variables:** `VITE_API_URL` = same backend URL.
6. Deploy.

`netlify.toml` in root and in `dashboard/` are set for build and SPA redirects.

---

## 4. Backend CORS (important)

Your backend must allow the new frontend and dashboard URLs. In backend `.env` (or host env vars), set:

```env
FRONTEND_URL=https://your-portfolio-url.vercel.app
DASHBOARD_URL=https://your-dashboard-url.vercel.app
```

Then restart the backend. The backend `app.js` already uses these in `allowedOrigins`.

---

## 5. Quick reference

| App        | Root directory | Build command   | Publish |
|-----------|----------------|-----------------|---------|
| Portfolio | `.` or empty  | `npm run build` | `dist`  |
| Dashboard | `dashboard`   | `npm run build` | `dist`  |

Both need **`VITE_API_URL`** set to your deployed backend URL.

---

## 6. Test before deploy

**Portfolio (from project root):**
```bash
npm run build
npm run preview
```
Open the URL shown (e.g. http://localhost:4173). Set `VITE_API_URL` in `.env` if you want to hit a real API.

**Dashboard:**
```bash
cd dashboard
npm run build
npm run preview
```
Same idea; use `.env` with `VITE_API_URL` if needed.
