// src/components/Loader.tsx
import React from "react";

interface LoaderProps {
  size?: string; // A prop size será opcional
}


const Loader: React.FC<LoaderProps> = ({ size = false }) => {
  return (
    <div className={`loader ${size ? "small" : ""}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;