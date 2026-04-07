import express from 'express';
import { z } from 'zod';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

let items = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  category: index % 2 === 0 ? 'even' : 'odd',
  createdAt: new Date(Date.now() - index * 60_000).toISOString()
}));

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().min(1).max(100).optional(),
  category: z.enum(['even', 'odd']).optional(),
  sortBy: z.enum(['id', 'name', 'createdAt']).default('id'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

const createItemSchema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.enum(['even', 'odd'])
});

const parseOrSendError = (schema, input, res) => {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors
    });
    return null;
  }

  return parsed.data;
};

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/items', (req, res) => {
  const query = parseOrSendError(listQuerySchema, req.query, res);
  if (!query) return;

  const { page, limit, search, category, sortBy, sortOrder } = query;

  let result = [...items];

  if (search) {
    const needle = search.toLowerCase();
    result = result.filter((item) => item.name.toLowerCase().includes(needle));
  }

  if (category) {
    result = result.filter((item) => item.category === category);
  }

  result.sort((a, b) => {
    const left = a[sortBy];
    const right = b[sortBy];

    if (left < right) return sortOrder === 'asc' ? -1 : 1;
    if (left > right) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = result.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  if (page > totalPages) {
    return res.status(400).json({
      message: `Page ${page} is out of range. Maximum page is ${totalPages}.`
    });
  }

  const startIndex = (page - 1) * limit;
  const data = result.slice(startIndex, startIndex + limit);

  return res.status(200).json({
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
});

app.post('/items', (req, res) => {
  const payload = parseOrSendError(createItemSchema, req.body, res);
  if (!payload) return;

  const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

  const newItem = {
    id: nextId,
    name: payload.name,
    category: payload.category,
    createdAt: new Date().toISOString()
  };

  items = [newItem, ...items];

  return res.status(201).json({ data: newItem });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
