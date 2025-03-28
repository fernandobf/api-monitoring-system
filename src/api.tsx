import { Endpoint, EndpointResult } from "./types";

const fetchEndpointsData = async (endpoints: Endpoint[]): Promise<EndpointResult[]> => {
  const requests = endpoints.map(async (endpoint) => {
    const start = Date.now(); // Marca o tempo de início da requisição
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method || "GET",
        // headers: endpoint.headers || {},
        // body: endpoint.method === "POST" ? JSON.stringify(endpoint.payload) : undefined,
      });

      const end = Date.now(); // Marca o tempo de término da requisição
      const totalTime = end - start; // Calcula o tempo total de resposta da requisição
      const data = await response.json(); // Obtém a resposta no formato JSON

      return {
        url: endpoint.url,
        status: Number(response.status), // Garante que o status seja um número
        statusText: response.statusText,
        responseTime: totalTime, // Usa o totalTime calculado
        data, // Dados da resposta
      };
    } catch (error) {
      const end = Date.now(); // Marca o tempo de término, mesmo no caso de erro
      const totalTime = end - start; // Calcula o tempo total, mesmo em erro
      return {
        url: endpoint.url,
        status: 500, // Código de erro para falha na requisição
        statusText: "Falha na requisição", // Mensagem de erro
        responseTime: totalTime, // Mesmo que falhe, ainda passa o totalTime calculado
        data: null, // Nenhum dado devido ao erro
      };
    }
  });

  return Promise.all(requests); // Espera todas as requisições serem concluídas
};

export default fetchEndpointsData;
