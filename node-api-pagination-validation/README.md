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


## Deploy online

### Option 1: Render (recommended)

This repo now includes `render.yaml`, so you can deploy quickly:

1. Push this repository to GitHub.
2. In Render, choose **New +** → **Blueprint** and select your repo.
3. Render will pick up `render.yaml` at the repository root.
4. After deploy, your app will be live at a Render URL, with health checks on `/api/health`.

### Option 2: Any Docker host

A production Dockerfile is included at `node-api-pagination-validation/Dockerfile`.

```bash
docker build -t cat-compliment-app .
docker run -p 3000:3000 -e COMPLIMENT_TIMES=09:00,18:00 cat-compliment-app
```

Then expose the container through your hosting provider (Fly.io, Railway, DigitalOcean, etc.).

## API

- `GET /api/health` → app status
- `GET /api/compliments` → latest compliment batch
- `POST /api/compliments/send-now` → generate new compliments immediately
- `GET /api/schedule` → schedule and next run timestamps
