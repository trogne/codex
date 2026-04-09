import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 3000;

const cats = ['Romaine', 'Vianney', 'Ratoune'];
const complimentTimes = (process.env.COMPLIMENT_TIMES || '09:00,18:00')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);

const complimentTemplates = [
  '{name}, you are a magnificent little cloud of joy.',
  '{name}, your whiskers are pure elegance.',
  '{name}, you make the whole home brighter.',
  '{name}, you are brave, clever, and adorable.',
  '{name}, your purr is top-tier healing magic.',
  '{name}, you are a superstar and you know it.'
];

app.use(express.json());
app.use(express.static('public'));

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

const buildComplimentBatch = () => {
  const generatedAt = new Date().toISOString();

  return {
    generatedAt,
    compliments: cats.map((name) => ({
      name,
      message: pickRandom(complimentTemplates).replace('{name}', name)
    }))
  };
};

const parseTime = (timeString) => {
  const [hourText, minuteText] = timeString.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return { hour, minute };
};

const getNextOccurrence = (timeString, now = new Date()) => {
  const parsed = parseTime(timeString);
  if (!parsed) return null;

  const scheduled = new Date(now);
  scheduled.setHours(parsed.hour, parsed.minute, 0, 0);

  if (scheduled <= now) {
    scheduled.setDate(scheduled.getDate() + 1);
  }

  return scheduled;
};

let latestBatch = buildComplimentBatch();

const runComplimentsNow = () => {
  latestBatch = buildComplimentBatch();

  latestBatch.compliments.forEach(({ name, message }) => {
    console.log(`[${latestBatch.generatedAt}] ${name}: ${message}`);
  });

  return latestBatch;
};

const scheduleCompliments = () => {
  complimentTimes.forEach((timeString) => {
    const armNextTimer = () => {
      const nextOccurrence = getNextOccurrence(timeString);

      if (!nextOccurrence) {
        console.warn(`Skipping invalid COMPLIMENT_TIMES entry: ${timeString}`);
        return;
      }

      const delay = nextOccurrence.getTime() - Date.now();

      setTimeout(() => {
        runComplimentsNow();
        armNextTimer();
      }, delay);
    };

    armNextTimer();
  });
};

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/compliments', (_req, res) => {
  res.status(200).json(latestBatch);
});

app.post('/api/compliments/send-now', (_req, res) => {
  const batch = runComplimentsNow();
  res.status(200).json(batch);
});

app.get('/api/schedule', (_req, res) => {
  const now = new Date();
  const upcomingRuns = complimentTimes
    .map((timeString) => ({
      time: timeString,
      nextRun: getNextOccurrence(timeString, now)?.toISOString() ?? null
    }))
    .filter(({ nextRun }) => nextRun !== null);

  res.status(200).json({
    cats,
    complimentTimes,
    upcomingRuns
  });
});

app.listen(port, () => {
  scheduleCompliments();
  console.log(`Cat compliment app running on port ${port}`);
  console.log(`Compliments scheduled at: ${complimentTimes.join(', ')}`);
});
