import React, { useState } from "react";
import { EndpointResult } from "../types";
import Loader from "./Loader";

interface Props {
  endpoints: { url: string }[];
  results: EndpointResult[];
  testSingleEndpoint: (url: string) => void;
}

const EndpointsTable: React.FC<Props> = ({ results, testSingleEndpoint }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof EndpointResult, direction: 'asc' | 'desc' } | null>(null);
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null); // Estado para endpoint em execução

  // Função para ordenar os resultados
  const sortedResults = React.useMemo(() => {
    let sortableResults = [...results];

    if (sortConfig !== null) {
      const { key, direction } = sortConfig;

      sortableResults.sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableResults;
  }, [results, sortConfig]);

  // Função para alterar a ordem de classificação
  const requestSort = (key: keyof EndpointResult) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleTestSingleEndpoint = async (url: string) => {
    setLoadingEndpoint(url); // Define o endpoint como em execução
    await testSingleEndpoint(url);
    setLoadingEndpoint(null); // Remove o loader quando terminar
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => requestSort('url')}>URL</th>
          <th onClick={() => requestSort('status')}>Status</th>
          <th className="align-right" onClick={() => requestSort('responseTime')}>Time (ms)</th>
          <th>Unit Test</th>
        </tr>
      </thead>
      <tbody>
        {sortedResults.length > 0 ? (
          sortedResults.map((result, index) => (
            <tr key={index}>
              <td>{result.url}</td>
              <td className={`status-${result.status !== 200 ? "0" : "200"}`}>{result.status}</td>
              <td className="align-right">{result.responseTime ? result.responseTime : "-"}</td>
              <td>
                {/* Exibe o Loader se o endpoint estiver sendo testado */}
                {loadingEndpoint === result.url ? (
                  <Loader size="small" /> // Supondo que o Loader aceite um prop `size`
                ) : (
                  <button 
                    className="btn-refresh" 
                    onClick={() => handleTestSingleEndpoint(result.url)} // Passa a URL corretamente
                  >
                    🔄
                  </button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4}>Nenhum resultado encontrado. Execute o monitoramento.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default EndpointsTable;
