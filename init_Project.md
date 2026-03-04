Here's exactly what to do, step by step:

---

## Step 1 — Generate your password hash (run this locally)

```bash
node scripts/generate-hash.js yourpassword
```

Copy the output (looks like `$2a$12$...`).

---

## Step 2 — Generate a JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output.

---

## Step 3 — Set up Vercel Postgres

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) → your project
2. Click **Storage** tab → **Create Database** → choose **Neon** (formerly Vercel Postgres)
3. Follow the prompts → at the end click **Connect to Project**
4. Vercel will **automatically add** all `POSTGRES_*` env vars to your project

---

## Step 4 — Set up Vercel Blob (for image uploads)

1. Same **Storage** tab → **Create Store** → choose **Blob**
2. Connect to your project
3. Vercel will **automatically add** `BLOB_READ_WRITE_TOKEN`

---

## Step 5 — Add your 3 manual env vars

Go to your project → **Settings** → **Environment Variables** → add these:

| Name | Value |
|---|---|
| `ADMIN_USERNAME` | `imad` (or whatever you want) |
| `ADMIN_PASSWORD_HASH` | the hash from Step 1 |
| `JWT_SECRET` | the random string from Step 2 |

---

## Step 6 — Create a `.env.local` for local development

Create a file called `.env.local` at the root of the project (it's already gitignored by Next.js):

```env
POSTGRES_URL=<copy from Vercel dashboard>
POSTGRES_URL_NON_POOLING=<copy from Vercel dashboard>
POSTGRES_USER=<copy from Vercel dashboard>
POSTGRES_HOST=<copy from Vercel dashboard>
POSTGRES_PASSWORD=<copy from Vercel dashboard>
POSTGRES_DATABASE=<copy from Vercel dashboard>

BLOB_READ_WRITE_TOKEN=<copy from Vercel dashboard>

ADMIN_USERNAME=imad
ADMIN_PASSWORD_HASH=<your hash from Step 1>
JWT_SECRET=<your random string from Step 2>
```

You can copy the Postgres values from Vercel: **Storage** → your DB → **.env.local** tab → it shows all the values ready to copy.

---

## Step 7 — Initialize the database (once)

After your first deploy (or locally with `npm run dev`), visit:

```
https://yoursite.com/dashboard
```

Log in → the dashboard will show an **"Initialize Database"** button → click it **once** to create all the tables.

---

That's it. After that everything works — adding projects, experiences, education, and editing the homepage from `/dashboard/admin`.