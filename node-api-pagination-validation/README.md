# Cat Compliment App

A simple Node.js app that compliments your cats **Romaine**, **Vianney**, and **Ratoune** twice a day.

## Features

- Automatically generates compliments on a schedule (default: `09:00` and `18:00` server time).
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

## API

- `GET /api/health` → app status
- `GET /api/compliments` → latest compliment batch
- `POST /api/compliments/send-now` → generate new compliments immediately
- `GET /api/schedule` → schedule and next run timestamps
