const fetchEndpointsData = async (endpoints) => {
    const requests = endpoints.map(async (endpoint) => {
        const start = Date.now();
        try {
            const response = await fetch(endpoint.url, {
                method: endpoint.method || "GET",
                headers: endpoint.headers || {},
                body: endpoint.method === "POST" ? JSON.stringify(endpoint.payload) : undefined,
            });
            const end = Date.now();
            const totalTime = end - start;
            const data = await response.json();
            return {
                url: endpoint.url,
                status: response.status,
                statusText: response.statusText,
                responseTime: totalTime,
                data,
            };
        }
        catch (error) {
            const end = Date.now();
            const totalTime = end - start;
            return {
                url: endpoint.url,
                status: "Erro",
                statusText: "Falha na requisição",
                responseTime: totalTime,
                data: null,
            };
        }
    });
    return Promise.all(requests);
};
export default fetchEndpointsData;
