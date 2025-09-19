export class CSVProcessor {
  /**
   * Parse CSV string into array of objects
   */
  static parseCSV(csvContent: string): any[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length === 0) return [];

    // Parse headers
    const headers = this.parseCSVLine(lines[0]);

    // Parse data rows
    const data: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          const value = values[index];
          // Try to convert to number if possible
          const numValue = Number(value);
          if (!isNaN(numValue) && value.trim() !== '') {
            row[header] = numValue;
          } else if (value.toLowerCase() === 'true') {
            row[header] = true;
          } else if (value.toLowerCase() === 'false') {
            row[header] = false;
          } else {
            row[header] = value;
          }
        });
        data.push(row);
      }
    }

    return data;
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());

    return result;
  }

  /**
   * Load CSV from URL (fetches from server)
   */
  static async loadFromServer(datasetName: string): Promise<any[]> {
    try {
      const response = await fetch(`http://localhost:9999/api/datasets/${encodeURIComponent(datasetName)}/data`);
      if (!response.ok) {
        throw new Error('Failed to load dataset');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading dataset:', error);
      throw error;
    }
  }

  /**
   * Execute a function against dataset with optional aggregation
   */
  static executeFunction(
    data: any[],
    func: Function,
    isAggregation: boolean = false
  ): any {
    try {
      if (isAggregation) {
        // For aggregation functions, pass the entire array
        return func(data);
      } else {
        // For row-level transformations, map over each row
        return data.map(row => func(row));
      }
    } catch (error) {
      console.error('Error executing function:', error);
      throw error;
    }
  }

  /**
   * Perform aggregation operations
   */
  static aggregate(
    data: any[],
    groupBy?: string,
    aggregateField?: string,
    operation: 'sum' | 'avg' | 'count' | 'min' | 'max' = 'sum'
  ): any {
    if (!groupBy) {
      // Simple aggregation without grouping
      if (!aggregateField) return data.length; // count

      const values = data.map(row => row[aggregateField]).filter(v => v !== null && v !== undefined);

      switch (operation) {
        case 'sum':
          return values.reduce((a, b) => a + b, 0);
        case 'avg':
          return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        case 'count':
          return values.length;
        case 'min':
          return Math.min(...values);
        case 'max':
          return Math.max(...values);
      }
    }

    // Aggregation with grouping
    const groups: Record<string, any[]> = {};

    // Group data
    data.forEach(row => {
      const key = row[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(row);
    });

    // Aggregate each group
    const result: Record<string, any> = {};

    for (const [key, groupData] of Object.entries(groups)) {
      if (!aggregateField) {
        result[key] = groupData.length; // count
      } else {
        const values = groupData.map(row => row[aggregateField]).filter(v => v !== null && v !== undefined);

        switch (operation) {
          case 'sum':
            result[key] = values.reduce((a, b) => a + b, 0);
            break;
          case 'avg':
            result[key] = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            break;
          case 'count':
            result[key] = values.length;
            break;
          case 'min':
            result[key] = Math.min(...values);
            break;
          case 'max':
            result[key] = Math.max(...values);
            break;
        }
      }
    }

    return result;
  }

  /**
   * Join two datasets
   */
  static join(
    leftData: any[],
    rightData: any[],
    leftKey: string,
    rightKey: string,
    type: 'inner' | 'left' | 'right' = 'inner'
  ): any[] {
    const result: any[] = [];

    if (type === 'inner' || type === 'left') {
      leftData.forEach(leftRow => {
        const matches = rightData.filter(rightRow =>
          leftRow[leftKey] === rightRow[rightKey]
        );

        if (matches.length > 0) {
          matches.forEach(rightRow => {
            result.push({ ...leftRow, ...rightRow });
          });
        } else if (type === 'left') {
          result.push(leftRow);
        }
      });
    }

    if (type === 'right') {
      rightData.forEach(rightRow => {
        const matches = leftData.filter(leftRow =>
          leftRow[leftKey] === rightRow[rightKey]
        );

        if (matches.length > 0) {
          matches.forEach(leftRow => {
            result.push({ ...leftRow, ...rightRow });
          });
        } else {
          result.push(rightRow);
        }
      });
    }

    return result;
  }
}