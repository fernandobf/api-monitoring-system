import { jsx as _jsx } from "react/jsx-runtime";
const Loader = ({ size = false }) => {
    return (_jsx("div", { className: `loader ${size ? "small" : ""}`, children: _jsx("div", { className: "spinner" }) }));
};
export default Loader;
