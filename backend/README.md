# Portfolio Logos API

## Setup

1. Copy `.env.example` to `.env` and set your `MONGO_URI`.
2. Install and run:

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

### MongoDB connection error: `querySrv ECONNREFUSED` or "IP isn't whitelisted"

**If you see "IP that isn't whitelisted"** – Atlas is reachable but your current IP is not allowed. Fix in Atlas:

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → log in.
2. Left sidebar: click **Network Access** (under "Security"), not "Database".
3. Click **"+ ADD IP ADDRESS"**.
4. Either:
   - Click **"ALLOW ACCESS FROM ANYWHERE"** – this sets the address to `0.0.0.0/0` (all IPs). Use for local/dev only.
   - Or click **"ADD CURRENT IP ADDRESS"** then **Confirm** (your IP may change if you use Wi‑Fi/dynamic IP).
5. Click **Confirm**. Wait 1–2 minutes for Atlas to apply the rule.
6. Restart your backend: `npm run dev`.

**If you still get `querySrv ECONNREFUSED`** (DNS/network):

- **Network Access** → add `0.0.0.0/0` as above.
- Try **Google DNS** (8.8.8.8) or **Cloudflare** (1.1.1.1) on your PC.
- Password with `#` `@` `%` must be URL-encoded in `MONGO_URI`.

## API

### GET /api/logos

Fetch all logos, or filter by category:

- `GET /api/logos` → all logos
- `GET /api/logos?category=skill` → only skills
- `GET /api/logos?category=app` → only apps

### POST /api/logos

Create one logo:

```json
{
  "name": "GitHub",
  "category": "skill",
  "svg": {
    "public_id": "portfolio-logos/github",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/portfolio-logos/github.svg"
  }
}
```

Create multiple logos (bulk):

```json
[
  { "name": "HTML", "category": "skill", "svg": { "public_id": "portfolio-logos/html", "url": "https://..." } },
  { "name": "GitHub", "category": "app", "svg": { "public_id": "portfolio-logos/github", "url": "https://..." } }
]
```

## Flow

1. Upload SVG logos to Cloudinary (or any CDN).
2. POST each logo to `http://localhost:5000/api/logos` (or use `node scripts/seed.js` after adding URLs).
3. Frontend fetches via `GET /api/logos?category=skill` and `GET /api/logos?category=app` and displays `<img src={logo.svg.url} />`.

## Post your Apps logos (Axios)

The 8 app logos (MongoDB, VS Code, Chrome, Claude, Github, PowerShell, Linux, Postman) with your Cloudinary URLs are in `scripts/postAppsLogos.js`. To add them to the database:

1. Start the backend: `npm run dev` (from `backend` folder).
2. In another terminal, from the **project root**:
   ```bash
   node backend/scripts/postAppsLogos.js
   ```
   Or from `backend`: `npm run post-apps`.

The script uses **Axios** to:
- `DELETE /api/logos?category=app` (clear existing app logos)
- `POST /api/logos` with the 8 app objects (bulk insert)

After this, the frontend **My Apps** section will load these from the API and show your Cloudinary images.

## Optional: Cloudinary transform

Use `w_48,f_auto,q_auto` in the URL for smaller, optimized images. The frontend applies this automatically when the URL contains `cloudinary.com`.
