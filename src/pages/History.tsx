import React from "react";
import { useTheme } from "../App";

const History = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <h1
        className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
      >
        History - Coming Soon
      </h1>
      <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
        Historical data and trends will be displayed here.
      </p>
    </div>
  );
};

export default History;
