import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "../App";

interface HistoryDataProps {
  fii: number;
  dii: number;
  client: number;
  pro: number;
}

const IndexHistory = ({}: HistoryDataProps) => {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeFilter, setActiveFilter] = useState("FII");
  const [historyData, setHistoryData] = useState([]);
  const fetchHistoryData = async (option: string) => {
    try {
      const enableApiCalls = true;

      if (enableApiCalls) {
        const url = `http://103.154.252.16:8080/futureBull/api/fetchPositionsHistory?clientType=${option.toLowerCase()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", JSON.stringify(data, null, 2));

        const History = data.historyResponse || data.response || data;
        setHistoryData(History);
      }

      console.log(`Processing data for: ${option}`);
    } catch (error) {
      console.error("Error fetching History data:", error);
    }
  };

  React.useEffect(() => {
    fetchHistoryData(activeFilter);
  }, [activeFilter]);

  const participantTypes = ["FII", "DII", "Client", "Pro"];
  const formatPercentage = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `${Math.round(num * 100)}.0%`;
  };


  const getValueColor = (value: string) => {
    const num = parseFloat(value);
    if (num >= 0) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (num < 0) {
      return isDark ? "text-red-400" : "text-red-600";
    }
    return isDark ? "text-gray-300" : "text-gray-700";
  };

  const totalPages = Math.ceil(historyData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = historyData.slice(startIndex, endIndex);


  return (
    <div
      className={`p-4 sm:p-6 space-y-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Summary Cards - Moved to Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              {activeFilter} Historical Performance
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"} group-hover:text-green-500 transition-colors duration-300`}
            >
              {Array.isArray(historyData) && historyData.length > 0
                ? (() => {
                    const sum = historyData.reduce((acc, row) => acc + (typeof row.netLongPosition === "number" ? row.netLongPosition : parseFloat(row.netLongPosition ?? "0") || 0), 0);
                    return (sum >= 0 ? "+" : "-") + "₹" + Math.abs(sum).toFixed(2) + " Cr";
                  })()
                : "+₹0 Cr"}
            </div>
            <div
              className={`text-xs ${isDark ? "text-green-400" : "text-green-600"} mt-1`}
            >
              Last 30 Days
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              Average Daily Volume
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"} group-hover:text-blue-500 transition-colors duration-300`}
            >
              {Array.isArray(historyData) && historyData.length > 0
                ? (() => {
                    const avg = historyData.reduce((acc, row) => acc + (typeof row.netOI === "number" ? row.netOI : parseFloat(row.netOI ?? "0") || 0), 0) / historyData.length;
                    return "₹" + avg.toFixed(2) + " Cr";
                  })()
                : "₹0 Cr"}
            </div>
            <div
              className={`text-xs ${isDark ? "text-blue-400" : "text-blue-600"} mt-1`}
            >
              Per Session
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              Net OI Change
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"} group-hover:text-purple-500 transition-colors duration-300`}
            >
              {Array.isArray(historyData) && historyData.length > 0
                ? (() => {
                    const sum = historyData.reduce((acc, row) => acc + (typeof row.changeInOI === "number" ? row.changeInOI : parseFloat(row.changeInOI ?? "0") || 0), 0);
                    return (sum >= 0 ? "+" : "-") + "₹" + Math.abs(sum).toFixed(2) + " Cr";
                  })()
                : "+₹0 Cr"}
            </div>
            <div
              className={`text-xs ${isDark ? "text-purple-400" : "text-purple-600"} mt-1`}
            >
              This Month
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              Trading Days
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"} group-hover:text-cyan-500 transition-colors duration-300`}
            >
              {Array.isArray(historyData) ? historyData.length : 0}
            </div>
            <div
              className={`text-xs ${isDark ? "text-cyan-400" : "text-cyan-600"} mt-1`}
            >
              Active Sessions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Section with Filters */}
      <div className="text-center mb-6">
        {/* Participant Filter Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {participantTypes.map((type) => (
            <Button
              key={type}
              variant={activeFilter === type ? "default" : "outline"}
              size="sm"
              className={`${activeFilter === type
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : isDark
                  ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
                } rounded-md px-4 py-2 transition-all duration-200`}
              onClick={() => setActiveFilter(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Data Table */}
      <Card
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl overflow-hidden shadow-lg`}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white sticky top-0 z-10">
                <div className="grid grid-cols-6 gap-4 px-6 py-4 font-semibold text-sm">
                  <div className="text-center">Date</div>
                  <div className="text-center">Net Long Position</div>
                  <div className="text-center">Net OI</div>
                  <div className="text-center">Change in OI</div>
                  <div className="text-center">Spot</div>
                  <div className="text-center">Spot Change</div>

                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {currentData?.map((row) => (
                  <div
                    key={row.sno}
                    className={`grid grid-cols-6 gap-3 px-6 py-4 text-sm hover:${isDark ? "bg-gray-700" : "bg-gray-50"} transition-all duration-200 cursor-pointer hover:shadow-md group`}
                  >
                    {/* <div
                      className={`text-center font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {row.sno}
                    </div> */}
                    <div
                      className={`font-semibold text-center ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {row.tradeDate}
                    </div>
                    {/* <div
                      className={`text-center font-semibold ${isDark ? "text-blue-400" : "text-blue-600"} group-hover:text-blue-500`}
                    >
                      {row.netLongPosition}
                    </div> */}
                    <div
                      className={`text-center font-semibold ${getValueColor(row.netLongPosition)}`}
                    >
                      {formatPercentage(row.netLongPosition)}
                    </div>

                    <div
                      className={`text-center font-semibold ${getValueColor(row.netOI)}`}
                    >
                      {(row.netOI)}

                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.changeInOI)}`}
                    >
                      {row.changeInOI}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.closeValue)}`}
                    >
                      {row.closeValue}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.changeValue)}`}
                    >
                      {row.changeValue}
                    </div>

                    {/* <div
                      className={`text-center font-semibold ${getValueColor(row.netChange)}`}
                    >
                      {row.closeValue > 0 ? "+" : ""}
                      {row.closeValue}
                    </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div
            className={`${isDark ? "bg-gray-700" : "bg-gray-50"} px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Items per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className={`px-3 py-1 rounded border ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300"} text-sm`}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {startIndex + 1} - {Math.min(endIndex, historyData.length)} of{" "}
                {historyData.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : isDark
                        ? "bg-gray-600 text-white hover:bg-gray-500"
                        : "bg-white text-gray-700 hover:bg-gray-100 border"
                  } text-sm transition-colors`}
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : isDark
                        ? "bg-gray-600 text-white hover:bg-gray-500"
                        : "bg-white text-gray-700 hover:bg-gray-100 border"
                  } text-sm transition-colors`}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-4">
        <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          © 2025 Vipras Corporation. All rights reserved. Built with ❤️ in
          India
        </p>
      </div>
    </div>
  );
};

export default IndexHistory;
