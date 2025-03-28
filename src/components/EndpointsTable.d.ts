import React from "react";
import { EndpointResult } from "../types";
interface Props {
    endpoints: {
        url: string;
    }[];
    results: EndpointResult[];
    testSingleEndpoint: (url: string) => void;
}
declare const EndpointsTable: React.FC<Props>;
export default EndpointsTable;
