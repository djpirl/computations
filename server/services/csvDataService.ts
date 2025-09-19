import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface TableSchema {
  columns: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date';
  }>;
}

export interface DatasetInfo {
  name: string;
  path: string;
  category: string;
  rowCount: number;
  schema: TableSchema;
  sample: any[];
}

export class CSVDataService {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), '../data');
  }

  async loadDataset(relativePath: string): Promise<any[]> {
    try {
      const fullPath = path.join(this.dataPath, relativePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          // Try to cast to number
          const num = Number(value);
          if (!isNaN(num) && value.trim() !== '') {
            return num;
          }
          // Check for boolean
          if (value.toLowerCase() === 'true') return true;
          if (value.toLowerCase() === 'false') return false;
          // Return as string
          return value;
        }
      });
      return records;
    } catch (error) {
      console.error(`Error loading dataset ${relativePath}:`, error);
      throw new Error(`Failed to load dataset: ${relativePath}`);
    }
  }

  inferSchema(data: any[]): TableSchema {
    if (data.length === 0) {
      return { columns: [] };
    }

    const sample = data.slice(0, Math.min(10, data.length));
    const columns = Object.keys(data[0]).map(name => {
      const values = sample.map(row => row[name]).filter(v => v !== null && v !== undefined);

      // Determine type based on sample values
      let type: 'string' | 'number' | 'boolean' | 'date' = 'string';

      if (values.every(v => typeof v === 'number')) {
        type = 'number';
      } else if (values.every(v => typeof v === 'boolean')) {
        type = 'boolean';
      } else if (values.every(v => this.isDate(v))) {
        type = 'date';
      }

      return { name, type };
    });

    return { columns };
  }

  private isDate(value: any): boolean {
    if (typeof value !== 'string') return false;
    const datePattern = /^\d{4}-\d{2}-\d{2}/;
    return datePattern.test(value);
  }

  async getAvailableDatasets(): Promise<DatasetInfo[]> {
    const datasets: DatasetInfo[] = [];

    // Process single-table datasets
    const singleTablePath = path.join(this.dataPath, 'single-table');
    const singleTableFiles = await fs.readdir(singleTablePath);

    for (const file of singleTableFiles) {
      if (file.endsWith('.csv')) {
        const relativePath = path.join('single-table', file);
        const data = await this.loadDataset(relativePath);
        const schema = this.inferSchema(data);

        datasets.push({
          name: file.replace('.csv', ''),
          path: relativePath,
          category: 'single-table',
          rowCount: data.length,
          schema,
          sample: data.slice(0, 3)
        });
      }
    }

    // Process multi-table datasets
    const multiTablePath = path.join(this.dataPath, 'multi-table');
    const multiTableDirs = await fs.readdir(multiTablePath);

    for (const dir of multiTableDirs) {
      const dirPath = path.join(multiTablePath, dir);
      const stats = await fs.stat(dirPath);

      if (stats.isDirectory()) {
        const files = await fs.readdir(dirPath);

        for (const file of files) {
          if (file.endsWith('.csv')) {
            const relativePath = path.join('multi-table', dir, file);
            const data = await this.loadDataset(relativePath);
            const schema = this.inferSchema(data);

            datasets.push({
              name: `${dir}/${file.replace('.csv', '')}`,
              path: relativePath,
              category: `multi-table/${dir}`,
              rowCount: data.length,
              schema,
              sample: data.slice(0, 3)
            });
          }
        }
      }
    }

    return datasets;
  }

  async getDatasetByName(name: string): Promise<DatasetInfo | null> {
    const datasets = await this.getAvailableDatasets();
    return datasets.find(d => d.name === name) || null;
  }
}