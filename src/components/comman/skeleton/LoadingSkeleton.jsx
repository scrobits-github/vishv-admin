import { Skeleton } from "antd";
import React from "react";

const LoadingSkeleton = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection:"column",
        gap:50,
        width: "100%",
        // height: "100vh",
        marginTop: 150,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Skeleton active />
      <Skeleton active />
    </div>
  );
};

export default LoadingSkeleton;
