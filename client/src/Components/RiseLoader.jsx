import React from "react";
import { RiseLoader } from "react-spinners";

const RiseLoaderWrapper = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#18181b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RiseLoader color="#60a5fa" />
    </div>
  );
};

export default RiseLoaderWrapper;
