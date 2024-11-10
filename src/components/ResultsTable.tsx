// ResultsTable.tsx
import React from 'react';
import { SearchResult } from '../api/api';

interface ResultsTableProps {
  results: SearchResult[]; // Expect SearchResult[] type for the results prop
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (results.length === 0) {
    return <p>No results found</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          {/* Add other columns here */}
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr key={result.id}>
            <td>{result.name}</td>
            <td>{result.category}</td>
            {/* Render other fields here */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
