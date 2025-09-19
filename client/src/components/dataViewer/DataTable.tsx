import React, { useState, useMemo } from 'react';

interface DataTableProps {
  data: any[];
  title?: string;
  pageSize?: number;
}

type SortDirection = 'asc' | 'desc' | null;

export const DataTable: React.FC<DataTableProps> = ({
  data,
  title,
  pageSize = 50
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Get column names from first data row
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row => {
      return Object.values(row).some(value => {
        const strValue = String(value).toLowerCase();
        return strValue.includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return '↕️';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '↕️';
  };

  if (data.length === 0) {
    return (
      <div className="data-table-empty">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      {title && <h3 className="data-table-title">{title}</h3>}

      <div className="data-table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="pagination-size">
          <label>Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="page-size-select"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
          <span className="record-count">
            {filteredData.length} records
            {searchTerm && ` (filtered from ${data.length})`}
          </span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="sortable-header"
                >
                  <div className="header-content">
                    <span className="column-name">{column}</span>
                    <span className="sort-icon">{getSortIcon(column)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={startIndex + index}>
                {columns.map(column => (
                  <td key={column} className="table-cell">
                    {row[column] !== null && row[column] !== undefined
                      ? typeof row[column] === 'object'
                        ? JSON.stringify(row[column])
                        : String(row[column])
                      : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          First
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Last
        </button>
      </div>
    </div>
  );
};