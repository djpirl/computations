import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { generateRouter } from './routes/generate';
import { datasetsRouter } from './routes/datasets';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 9999;

app.use(cors());
app.use(express.json());

app.use('/api', generateRouter);
app.use('/api', datasetsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});