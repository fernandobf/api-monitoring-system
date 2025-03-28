import { Endpoint, EndpointResult } from "./types";
declare const fetchEndpointsData: (endpoints: Endpoint[]) => Promise<EndpointResult[]>;
export default fetchEndpointsData;
