import React, { useState, useEffect } from "react";
import "./App.css";
import EndpointsTable from "./components/EndpointsTable";
import Loader from "./components/Loader";
import fetchEndpointsData from "./api";
import { ConfigData, EndpointResult } from "./types";

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [results, setResults] = useState<EndpointResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  // Carregar configuração inicial do arquivo JSON
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/endpoints.json");
        if (!response.ok) throw new Error("Erro ao carregar endpoints");
        const data = await response.json();
        setConfig((prev) => (JSON.stringify(prev) !== JSON.stringify(data) ? data : prev));
      } catch (error) {
        console.error("Erro ao carregar endpoints.json", error);
      }
    };

    loadConfig();
  }, []);

  // Buscar dados dos endpoints e resetar contador
  const fetchData = async () => {
    if (!config) return;
    setLoading(true);

    try {
      const startTime = Date.now();
      const results = await fetchEndpointsData(config.endpoints);
      const totalTime = Date.now() - startTime;

      // Atualizar resultados, garantindo que 'responseTime' seja sempre número
      setResults(
        results.map((result) => ({
          ...result,
          responseTime: result.responseTime ?? 0, // Garantir que responseTime seja sempre um número
          totalTime,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar dados dos endpoints", error);
    } finally {
      setLoading(false);
      setSecondsLeft(config.refreshTime / 1000); // Reinicia o contador após a atualização
    }
  };

  // Testar um único endpoint e atualizar resultados
  const testSingleEndpoint = async (url: string) => {
    if (!url) {
      console.error("URL inválida ao testar endpoint");
      return;
    }

    try {
      const startTime = Date.now();
      const response = await fetch(url);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let data = null;
      if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
      }

      setResults((prevResults) =>
        prevResults.map((result) =>
          result.url === url
            ? { ...result, responseTime, status: response.status, data }
            : result
        )
      );
    } catch (error) {
      console.error("Erro ao testar endpoint:", error);
      setResults((prevResults) =>
        prevResults.map((result) =>
          result.url === url
            ? { ...result, status: 500, responseTime: 0, data: null } // Garantir que responseTime seja 0
            : result
        )
      );
    }
  };

  // Controlar o contador regressivo
  useEffect(() => {
    if (!config) return;

    fetchData(); // 🔥 Chamada imediata assim que o componente monta!

    setSecondsLeft(config.refreshTime / 1000); // Define tempo inicial

    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchData();
          return config.refreshTime / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [config]); // Dispara sempre que a config for carregada

  if (!config) return <Loader />;

  return (
    <div>
      <img src="https://www.edenred.pt/wp-content/themes/edenred/img/logo-edenred.png" alt="" />
      <h1>API Monitoring System | PROD</h1>

      {!loading && (
        <p>
          <small>
            Next update in <span>{secondsLeft.toString().padStart(2, "0")}</span> seconds
          </small>
        </p>
      )}

      <button className={loading ? "disabled" : ""} disabled={loading} onClick={fetchData}>
        🚀 RUN ENDPOINTS TEST
      </button>

      {loading ? <Loader /> : <EndpointsTable endpoints={config.endpoints} results={results} testSingleEndpoint={testSingleEndpoint} />}
    </div>
  );
};

export default App;
