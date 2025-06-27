import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../App";

interface TradingActivityData {
  tradeDate: string;
  nifty: number;
  fiiCall: number;
  fiiPut: number;
  fiiFuture: number;
  fiiIndexFutureOI: number;
  fiiIndexFutureOIChg: number;
  fiiCash: number;
  diiCash: number;
}

interface TradingActivitiesProps {
  selectedParticipant: string;
  selectedDate: string;
}

const TradingActivities = ({
  selectedParticipant,
  selectedDate,
}: TradingActivitiesProps) => {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [tradingData, setTradingData] = useState<TradingActivityData[]>([]);

  const fetchTradingData = async (participant: string, date: string) => {
    try {
      const enableApiCalls = true;
      if (enableApiCalls) {
        const response = await fetch(
          "http://103.154.252.16:8080/futureBull/api/fetchDailyData",
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (Array.isArray(data.tradeActivityList)) {
          const mappedData = data.tradeActivityList.map(
            (item: any, index: number) => ({
              tradeDate: item.tradeDate,
              nifty: item.nifty,
              fiiCall: item.intradayCallsNet,
              fiiPut: item.intradayPutsNet,
              fiiFuture: item.indexFutures,
              fiiIndexFutureOI: item.futureIndexOI,
              fiiIndexFutureOIChg: item.futureIndexOIChg,
              fiiCash: item.fiiCash,
              diiCash: item.diiCash,
            }),
          );
          setTradingData(mappedData.sort((a, b) => new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime()));
        } else {
          console.warn("Invalid API response format", data);
        }
      }
    } catch (error) {
      console.error("Error fetching trading data:", error);
    }
  };
  useEffect(() => {
    fetchTradingData(selectedParticipant, selectedDate);
  }, [selectedParticipant, selectedDate]);

  const getValueColor = (value: number) => {
    if (value > 0) return isDark ? "text-green-400" : "text-green-600";
    if (value < 0) return isDark ? "text-red-400" : "text-red-600";
    return isDark ? "text-gray-300" : "text-gray-700";
  };

  const formatValue = (value: number | string) => {
    const number = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(number)) return "-";
    return number < 0
      ? number.toLocaleString()
      : number.toLocaleString(undefined, { signDisplay: "never" });
  };

  const totalPages = Math.ceil(tradingData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tradingData.slice(startIndex, endIndex);

  return (
    <div
      className={`p-4 sm:p-6 space-y-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Summary Cards - Moved to Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              Total FII Cash Flow
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
            >
              ₹{Array.isArray(tradingData) ? tradingData.reduce((sum, row) => sum + (typeof row.fiiCash === "number" ? row.fiiCash : parseFloat(String(row.fiiCash ?? "0").replace(/[^\d.-]/g, "")) || 0), 0).toFixed(2) : 0} Cr
            </div>
            <div
              className={`text-xs ${isDark ? "text-green-400" : "text-green-600"} mt-1`}
            >
              {/* Example: % change from last week, replace if available */}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              Total DII Cash Flow
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
            >
              ₹19,656 Cr
            </div>
            <div
              className={`text-xs ${isDark ? "text-blue-400" : "text-blue-600"} mt-1`}
            >
              +8.7% from last week
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              Net Options Activity
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}
            >
              ₹-4,127 Cr
            </div>
            <div
              className={`text-xs ${isDark ? "text-purple-400" : "text-purple-600"} mt-1`}
            >
              Net Selling
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              Avg Daily Volume
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
            >
              ₹2,847 Cr
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
            >
              Per trading session
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Table */}
      <Card
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl overflow-hidden`}
      >
        <CardContent className="p-0">
          {/* Unified Scrollable Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Table Header */}
              <div
                className={`${isDark ? "bg-cyan-800" : "bg-cyan-600"} text-white sticky top-0 z-10`}
              >
                <div className="grid grid-cols-10 gap-4 px-6 py-4 font-semibold text-sm">
                  <div className="text-center">Date</div>
                  <div className="text-center">Nifty</div>
                  <div className="text-center">FII Call</div>
                  <div className="text-center">FII Put</div>
                  <div className="text-center">FII Future</div>
                  <div className="text-center">FII Index Future OI</div>
                  <div className="text-center">FII Index Future OI Chg</div>
                  <div className="text-center">FII Cash</div>
                  <div className="text-center">DII Cash</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {currentData?.map((row) => (
                  <div
                    className={`grid grid-cols-10 gap-4 px-6 py-4 text-sm ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"} transition-all duration-200`}
                  >
                    <div
                      className={`font-semibold text-center ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {row.tradeDate}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.nifty)}`}
                    >
                      {formatValue(row.nifty)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.fiiCall)}`}
                    >
                      {formatValue(row.fiiCall)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.fiiPut)}`}
                    >
                      {formatValue(row.fiiPut)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.fiiFuture)}`}
                    >
                      {formatValue(row.fiiFuture)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.fiiIndexFutureOI)}`}
                    >
                      {formatValue(row.fiiIndexFutureOI)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.fiiIndexFutureOIChg)}`}
                    >
                      {formatValue(row.fiiIndexFutureOIChg)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.fiiCash)}`}
                    >
                      {formatValue(row.fiiCash)}
                    </div>
                    <div
                      className={`text-center font-semibold ${getValueColor(row.diiCash)}`}
                    >
                      {formatValue(row.diiCash)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                {startIndex + 1} - {Math.min(endIndex, tradingData.length)} of{" "}
                {tradingData.length}
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

export default TradingActivities;
