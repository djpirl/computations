import { Router } from 'express';
import { CSVDataService } from '../../services/csvDataService';

const router = Router();
const csvService = new CSVDataService();

// List all available datasets
router.get('/datasets', async (req, res) => {
  try {
    const datasets = await csvService.getAvailableDatasets();
    res.json(datasets);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ error: 'Failed to fetch datasets' });
  }
});

// Get schema for a specific dataset
router.get('/datasets/:name/schema', async (req, res) => {
  try {
    const { name } = req.params;
    const dataset = await csvService.getDatasetByName(name);

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    res.json(dataset.schema);
  } catch (error) {
    console.error('Error fetching dataset schema:', error);
    res.status(500).json({ error: 'Failed to fetch dataset schema' });
  }
});

// Get sample data from a dataset
router.get('/datasets/:name/sample', async (req, res) => {
  try {
    const { name } = req.params;
    const dataset = await csvService.getDatasetByName(name);

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    res.json(dataset.sample);
  } catch (error) {
    console.error('Error fetching dataset sample:', error);
    res.status(500).json({ error: 'Failed to fetch dataset sample' });
  }
});

// Get full data from a dataset
router.get('/datasets/:name/data', async (req, res) => {
  try {
    const { name } = req.params;
    const dataset = await csvService.getDatasetByName(name);

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    const data = await csvService.loadDataset(dataset.path);
    res.json(data);
  } catch (error) {
    console.error('Error fetching dataset data:', error);
    res.status(500).json({ error: 'Failed to fetch dataset data' });
  }
});

export { router as datasetsRouter };