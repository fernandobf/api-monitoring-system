import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import Loader from "./Loader";
const EndpointsTable = ({ endpoints, results, testSingleEndpoint }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [loadingEndpoint, setLoadingEndpoint] = useState(null); // Adicionando estado para o endpoint em execução
    // Função para ordenar os resultados
    const sortedResults = React.useMemo(() => {
        let sortableResults = [...results];
        if (sortConfig !== null) {
            sortableResults.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableResults;
    }, [results, sortConfig]);
    // Função para alterar a ordem de classificação
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const handleTestSingleEndpoint = async (url) => {
        setLoadingEndpoint(url); // Define o endpoint como em execução
        await testSingleEndpoint(url);
        setLoadingEndpoint(null); // Quando a requisição terminar, remove o loader
    };
    return (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { onClick: () => requestSort('url'), children: "URL" }), _jsx("th", { onClick: () => requestSort('status'), children: "Status" }), _jsx("th", { className: "align-right", onClick: () => requestSort('responseTime'), children: "Time (ms)" }), _jsx("th", { children: "Unit Test" })] }) }), _jsx("tbody", { children: sortedResults.length > 0 ? (sortedResults.map((result, index) => (_jsxs("tr", { children: [_jsx("td", { children: result.url }), _jsx("td", { className: `status-${result.status !== 200 ? "0" : "200"}`, children: result.status }), _jsx("td", { className: "align-right", children: result.responseTime ? result.responseTime : "-" }), _jsx("td", { children: loadingEndpoint === result.url ? (_jsx(Loader, { size: "small" }) // Supondo que o Loader aceite um prop `size` para determinar o tamanho
                            ) : (_jsx("button", { className: "btn-refresh", onClick: () => handleTestSingleEndpoint(result.url), children: "\uD83D\uDD04" })) })] }, index)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 4, children: "Nenhum resultado encontrado. Execute o monitoramento." }) })) })] }));
};
export default EndpointsTable;
