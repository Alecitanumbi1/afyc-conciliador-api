import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'AFyC Conciliador API', status: 'running' });
});

app.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Usuarios').select('id').limit(1);
    if (error) throw error;
    res.json({ ok: true, db: 'connected', sample: (data && data.length ? data[0] : null) });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get('/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .select('id, Nombre, Email, Estado')
      .limit(3);
    if (error) throw error;
    res.json({ ok: true, rows: data });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.use((req, res) => res.status(404).json({ ok: false, error: 'Not Found' }));

app.listen(PORT, () => {
  console.log(`AFyC Conciliador API listening on port ${PORT}`);
});
