import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.static('public'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', site: 'silver-tree' });
});

app.listen(port, () => {
  console.log(`Silver Tree website running on port ${port}`);
});
