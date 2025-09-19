import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { generateRouter } from './routes/generate';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', generateRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});