import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory user store: username -> { id, username, passwordHash, role }
const users = new Map();

function wrapAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get('/api/ping', (req, res) => res.send('pong'));

app.post('/api/register', wrapAsync(async (req, res) => {
  const { role, username, password } = req.body || {};
  if (!role || !username || !password) return res.status(400).json({ error: 'role, username and password are required' });
  if (users.has(username)) return res.status(409).json({ error: 'User already exists' });
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const id = randomUUID();
  users.set(username, { id, username, passwordHash: hash, role });
  return res.json({ user: { id, username, role } });
}));

app.post('/api/login', wrapAsync(async (req, res) => {
  const { role, username, password } = req.body || {};
  if (!role || !username || !password) return res.status(400).json({ error: 'role, username and password are required' });
  const u = users.get(username);
  if (!u) return res.status(401).json({ error: 'Invalid credentials or role' });
  if (u.role !== role) return res.status(401).json({ error: 'Invalid credentials or role' });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials or role' });
  return res.json({ user: { id: u.id, username: u.username, role: u.role } });
}));

// global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Express server listening on http://localhost:${port}`));
