# Cat Compliment App

A simple Node.js app that compliments your cats **Romaine**, **Vianney**, and **Ratoune** twice a day, in French.

## Features

- Automatically generates French compliments on a schedule (default: `09:00` and `18:00` server time).
- Displays latest compliments in a small web UI.
- Lets you trigger compliments instantly with a button.
- Exposes a JSON API for health checks, compliments, and schedule details.

## Run locally

```bash
npm install
npm start
```

Then open <http://localhost:3000>.

## Configuration

You can change schedule times via `COMPLIMENT_TIMES` (24-hour format):

```bash
COMPLIMENT_TIMES=08:00,20:00 npm start
```

## Publish online (step-by-step)

If you want everyone to use your app, the fastest path is **Render**.

### 1) Push your code to GitHub

From your project root:

```bash
git add .
git commit -m "Prepare app for production"
git push origin <your-branch>
```

Then merge to your main branch so Render can deploy it.

### 2) Create a Render account

- Go to <https://render.com/> and sign up.
- Connect your GitHub account.

### 3) Deploy with Blueprint

This repository already includes `render.yaml` at the root.

- In Render dashboard, click **New +**.
- Choose **Blueprint**.
- Select your GitHub repo.
- Confirm deploy.

Render will automatically:
- build in `node-api-pagination-validation`
- run `npm ci`
- start with `npm start`
- monitor `GET /api/health`

### 4) Verify it is live

After deployment, open your Render URL (for example `https://cat-compliment-app.onrender.com`).

Check:
- `/` shows the UI
- `/api/health` returns `{"status":"ok"}`
- `/api/compliments` returns French compliments

### 5) Share with everyone

- Send people the Render URL.
- Optional: add a custom domain in Render (**Settings → Custom Domains**) so it is easier to remember.

### 6) Keep it always available

- Use at least a paid Render plan if you want to avoid free-tier sleeping.
- Enable Render notifications for failed deploys.
- Keep your GitHub repo connected so every push can auto-deploy.

## Optional: publish with Docker on another host

A production Dockerfile is included at `node-api-pagination-validation/Dockerfile`.

```bash
cd node-api-pagination-validation
docker build -t cat-compliment-app .
docker run -p 3000:3000 -e COMPLIMENT_TIMES=09:00,18:00 cat-compliment-app
```

Then deploy that image to Fly.io, Railway, DigitalOcean, AWS, or any container platform.

## API

- `GET /api/health` → app status
- `GET /api/compliments` → latest compliment batch
- `POST /api/compliments/send-now` → generate new compliments immediately
- `GET /api/schedule` → schedule and next run timestamps
