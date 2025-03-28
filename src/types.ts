export interface AuthConfig {
  type: "Basic" | "Bearer";
  token?: string;
  username?: string;
  password?: string;
}

export interface Endpoint {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  auth: AuthConfig | null;
  body: any | null;
}

export interface ConfigData {
  refreshTime: number;
  endpoints: Endpoint[];
}

export interface EndpointResult {
  url: string;
  status: number;
  data: any;
  responseTime: number;
}

export type Config = {
  refreshTime: number;
  endpoints: Endpoint[];
};
