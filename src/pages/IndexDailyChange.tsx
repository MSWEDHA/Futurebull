import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../App";

function IndexDailyChange() {
  // ...existing hooks

  // Market Trend calculation
  const getMarketTrend = () => {
    if (!Array.isArray(dailyData) || dailyData.length === 0) return "Neutral";
    const fiiSum = dailyData.reduce(
      (acc, row) => acc + (typeof row.fii_longValue === "number" ? row.fii_longValue : parseFloat(row.fii_longValue ?? "0") || 0),
      0
    );
    const diiSum = dailyData.reduce(
      (acc, row) => acc + (typeof row.dii_longValue === "number" ? row.dii_longValue : parseFloat(row.dii_longValue ?? "0") || 0),
      0
    );
    const net = fiiSum + diiSum;
    if (net > 0) return "Bullish";
    if (net < 0) return "Bearish";
    return "Neutral";
  };

  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState("MAY 2025");
  const [dailyData, setDailyData] = useState([]);
  const fetchDailyData = async (option: string) => {
    try {
      const enableApiCalls = true;

      if (enableApiCalls) {
        const response = await fetch(`http://103.154.252.16:8080/futureBull/api/fetchPositionsDailyChange?monthYear=${encodeURIComponent(option)}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        const DailyChanges = data["dailyChangeResponse"];
        console.log(`DailyChanges ${JSON.stringify(DailyChanges)}`);
        setDailyData(DailyChanges);
      }

      console.log(`Processing data for: ${option}`);
    } catch (error) {
      console.error("Error fetching DailyChanges data:", error);
    }
  };

  React.useEffect(() => {
    // Fetch data when the component mounts or when selectedMonth changes
    fetchDailyData(selectedMonth);
  }, [selectedMonth]);

  const months = [
    "JAN 2025",
    "FEB 2025",
    "MAR 2025",
    "APR 2025",
    "MAY 2025",
  ];
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

  const totalPages = Math.ceil(dailyData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = dailyData.slice(startIndex, endIndex);

  return (
    <div
      className={`p-4 sm:p-6 space-y-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Summary Cards - Moved to Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <h3
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
              >
                Monthly FII Activity
              </h3>
              <div
                className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
              >
                {Array.isArray(dailyData) ? (() => {
                  const sum = dailyData.reduce((acc, row) => acc + (typeof row.fii_longValue === "number" ? row.fii_longValue : parseFloat(row.fii_longValue ?? "0") || 0), 0);
                  return (sum >= 0 ? "+" : "-") + "₹" + Math.abs(sum).toFixed(2) + " Cr";
                })() : "+₹0 Cr"}
              </div>
              <div
                className={`text-xs ${isDark ? "text-green-400" : "text-green-600"} mt-1`}
              >
                Net FII Long
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <h3
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
              >
                Monthly DII Activity
              </h3>
              <div
                className={`text-2xl font-bold ${isDark ? "text-red-400" : "text-red-600"}`}
              >
                {Array.isArray(dailyData) ? (() => {
                  const sum = dailyData.reduce((acc, row) => acc + (typeof row.dii_longValue === "number" ? row.dii_longValue : parseFloat(row.dii_longValue ?? "0") || 0), 0);
                  return (sum >= 0 ? "+" : "-") + "₹" + Math.abs(sum).toFixed(2) + " Cr";
                })() : "-₹0 Cr"}
              </div>
              <div
                className={`text-xs ${isDark ? "text-red-400" : "text-red-600"} mt-1`}
              >
                Net DII Long
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <h3
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
              >
                Total Volume
              </h3>
              <div
                className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
              >
                {Array.isArray(dailyData) ? (() => {
                  const sum = dailyData.reduce((acc, row) => acc + (typeof row.spotValue === "number" ? row.spotValue : parseFloat(row.spotValue ?? "0") || 0), 0);
                  return "₹" + sum.toFixed(2) + " Cr";
                })() : "₹0 Cr"}
              </div>
              <div
                className={`text-xs ${isDark ? "text-blue-400" : "text-blue-600"} mt-1`}
              >
                This Month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <h3
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
              >
                Market Trend
              </h3>
              <div
                className={`text-2xl font-bold ${
                  getMarketTrend() === "Bullish"
                    ? isDark ? "text-green-400" : "text-green-600"
                    : getMarketTrend() === "Bearish"
                    ? isDark ? "text-red-400" : "text-red-600"
                    : isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {getMarketTrend()}
              </div>
              <div
                className={`text-xs ${isDark ? "text-purple-400" : "text-purple-600"} mt-1`}
              >
                Overall Sentiment
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {/* Month Selector */}
          <div className="flex justify-end mb-2">
            <div className="text-right ">
              <h3
                className={`text-sm ${isDark ? "text-gray-500" : "text-white-700"} mb-2`}
              >
                Choose Month
              </h3>

              <select
                className={`px-3 py-1 rounded border text-sm ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <Card
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl overflow-hidden shadow-lg`}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1400px]">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white sticky top-0 z-10">
                <div className="grid grid-cols-11 gap-1 px-2 py-3 font-semibold text-xs">
                  <div className="text-center border-r border-teal-400">
                    Date
                  </div>
                  <div className="text-center border-r border-teal-400 col-span-2">
                    <div className="mb-1">FII</div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>LONG</div>
                      <div>SHORT</div>
                    </div>
                  </div>
                  <div className="text-center border-r border-teal-400 col-span-2">
                    <div className="mb-1">DII</div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>LONG</div>
                      <div>SHORT</div>
                    </div>
                  </div>
                  <div className="text-center border-r border-teal-400 col-span-2">
                    <div className="mb-1">CLIENT</div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>LONG</div>
                      <div>SHORT</div>
                    </div>
                  </div>
                  <div className="text-center border-r border-teal-400 col-span-2">
                    <div className="mb-1">PRO</div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>LONG</div>
                      <div>SHORT</div>
                    </div>
                  </div>
                  <div className="text-center col-span-2">
                    <div className="mb-1">SPOT CHANGE</div>
                    <div className="grid grid-cols-2 gap-1 px-3">
                      <div>SPOT CHANGE</div>
                      <div>SPOT CHANGE</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {currentData.map((row) => (
                  <div
                    key={row.sno}
                    className={`grid grid-cols-11 gap-1 px-2 py-2 text-xs hover:${isDark ? "bg-gray-700" : "bg-gray-50"} transition-all duration-200 cursor-pointer hover:shadow-md group border-b border-gray-200`}
                  >
                    <div
                      className={`text-center font-medium ${isDark ? "text-white" : "text-gray-900"} border-r border-gray-200 py-1`}
                    >
                      {row.tradeDate}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.fii_longValue)} border-r border-gray-100 py-1`}
                    >
                      {formatPercentage(row.fii_longValue)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.fii_shortValue)} border-r border-gray-200 py-1`}
                    >

                      {formatPercentage(row.fii_shortValue)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.dii_longValue)} border-r border-gray-100 py-1`}
                    >
                      {formatPercentage(row.dii_longValue)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.dii_shortValue)} border-r border-gray-200 py-1`}
                    >
                      {formatPercentage(row.dii_shortValue)}

                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.client_longValue)} border-r border-gray-100 py-1`}
                    >
                      {formatPercentage(row.client_longValue)}

                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.client_shortValue)} border-r border-gray-200 py-1`}
                    >
                      {formatPercentage(row.client_shortValue)}

                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.pro_longValue)} border-r border-gray-100 py-1`}
                    >
                      {formatPercentage(row.pro_longValue)}

                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.pro_shortValue)} border-r border-gray-200 py-1`}
                    >
                      {formatPercentage(row.pro_shortValue)}

                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.spotValue)} border-r border-gray-200  py-1`}
                    >
                      {(row.spotValue)}

                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.spotChange)}  py-1`}
                    >
                      {(row.spotChange)}

                    </div>
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
                {startIndex + 1} - {Math.min(endIndex, dailyData.length)} of{" "}
                {dailyData.length}
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
      </div>
    </div>
  );
}

export default IndexDailyChange;
