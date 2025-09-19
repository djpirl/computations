import express from 'express';
import { ClaudeService } from '../services/claude';
import { GenerateRequest, GenerateResponse } from '../../../shared/src/types';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { prompt, context }: GenerateRequest = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const claudeService = new ClaudeService();
    const result: GenerateResponse = await claudeService.generateFunction(prompt, context);
    res.json(result);
  } catch (error) {
    console.error('Error generating function:', error);
    res.status(500).json({ error: 'Failed to generate function' });
  }
});

export { router as generateRouter };