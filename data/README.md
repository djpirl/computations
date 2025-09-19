# Dataset Documentation

This directory contains sample CSV datasets designed to test and develop various computation types in our TypeScript function generator.

## Directory Structure

```
/data/
├── single-table/           # Single table datasets for aggregations
│   ├── sales.csv          # Sales transaction data (20 records)
│   ├── products.csv       # Product catalog (12 records)
│   ├── customers.csv      # Customer information (15 records)
│   └── employees.csv      # Employee records (14 records)
├── multi-table/           # Multi-table datasets for joins and complex operations
│   ├── ecommerce/         # E-commerce order management system
│   │   ├── orders.csv     # Order records (15 records)
│   │   ├── order_items.csv # Order line items (24 records)
│   │   ├── products.csv   # Product details (12 records)
│   │   └── customers.csv  # Customer profiles (10 records)
│   └── hr/               # Human resources management system
│       ├── employees.csv  # Employee records (15 records)
│       ├── departments.csv # Department information (6 records)
│       └── salaries.csv   # Salary history (16 records)
└── schemas/              # Schema definitions and relationships
    ├── single-table.json # Single table column definitions
    └── multi-table.json  # Multi-table relationship definitions
```

## Single-Table Datasets

### sales.csv
- **Purpose**: Sales transaction analysis, aggregations by category/region/rep
- **Key Fields**: date, product_id, customer_id, quantity, price, category, region, sales_rep
- **Sample Computations**:
  - Total sales by category: Electronics, Books, Home
  - Average order value by region: North, South, East, West
  - Sales performance by representative
  - Monthly revenue trends

### products.csv
- **Purpose**: Product catalog analysis, inventory management
- **Key Fields**: product_id, name, category, price, supplier, in_stock, weight_kg
- **Sample Computations**:
  - Average price by category
  - Stock availability analysis
  - Supplier distribution
  - Weight-based shipping calculations

### customers.csv
- **Purpose**: Customer demographics and behavior analysis
- **Key Fields**: customer_id, name, email, age, city, state, total_orders, lifetime_value
- **Sample Computations**:
  - Customer segmentation by age groups
  - Geographic distribution analysis
  - Lifetime value statistics
  - Customer acquisition trends by state

### employees.csv
- **Purpose**: HR analytics and organizational analysis
- **Key Fields**: employee_id, name, department, position, salary, hire_date, manager_id, performance_rating
- **Sample Computations**:
  - Salary statistics by department
  - Employee tenure analysis
  - Performance rating distribution
  - Organizational hierarchy analysis

## Multi-Table Datasets

### E-commerce System (ecommerce/)
A complete order management system demonstrating customer orders with line items and product details.

**Relationships**:
- `customers` ← `orders` (customer_id)
- `orders` ← `order_items` (order_id)
- `products` ← `order_items` (product_id)

**Sample Multi-Table Computations**:
- Customer order history with product details
- Revenue analysis by product category and customer tier
- Average order value by customer segment
- Product performance with order frequency
- Customer lifetime value with purchase patterns

### HR System (hr/)
A human resources management system with employee hierarchy and salary tracking.

**Relationships**:
- `departments` ← `employees` (department_id)
- `employees` ← `salaries` (employee_id)
- `employees` ← `employees` (manager_id - self-referencing)

**Sample Multi-Table Computations**:
- Department budget utilization vs actual salaries
- Employee hierarchy with manager relationships
- Salary progression analysis over time
- Performance-based compensation analysis
- Department cost and headcount analysis

## Schema Definitions

### single-table.json
Contains column definitions, data types, and sample aggregation ideas for each single-table dataset.

### multi-table.json
Defines relationships between tables, foreign keys, and sample multi-table computation examples.

## Usage in Function Generation

These datasets are designed to be used with our Claude-powered function generator to:

1. **Provide Context**: Schema information helps Claude understand available data structures
2. **Generate Realistic Functions**: Functions are generated with proper types based on actual data
3. **Test with Real Data**: Functions can be executed against these datasets for validation
4. **Support Complex Operations**: Multi-table datasets enable testing of joins, aggregations, and complex business logic

## Data Quality Notes

- **Realistic Data**: All datasets contain realistic business data with proper relationships
- **Edge Cases**: Includes null values, empty strings, and boundary conditions for robust testing
- **Referential Integrity**: Foreign key relationships are maintained across multi-table datasets
- **Variety**: Datasets cover different business domains (sales, e-commerce, HR) for diverse testing scenarios

## Future Enhancements

- **Larger Datasets**: Add datasets with 1000+ records for performance testing
- **Time Series Data**: Add temporal datasets for trend analysis
- **JSON Columns**: Include complex nested data structures
- **Geographic Data**: Add location-based datasets for spatial analysis
- **Industry-Specific**: Add datasets for healthcare, finance, education, etc.