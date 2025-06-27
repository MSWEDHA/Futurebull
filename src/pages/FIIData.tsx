import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "../App";

interface FIIDataProps {
  selectedNiftyOption: string;
}

const FIIData = ({ selectedNiftyOption }: FIIDataProps) => {
  console.log("selectedNiftyOption", selectedNiftyOption);
  const { isDark } = useTheme();
  const [activityData, SetActivityData] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedNiftyOptions, setSelectedNiftyOptions] = useState([]);
  const [selectedBankNiftyOptions, setSelectedBankNiftyOptions] = useState([]);

  const fetchFIIData = async (option: string) => {
    try {
      const enableApiCalls = true;

      if (enableApiCalls) {
        const response = await fetch(
          "http://103.154.252.16:8080/futureBull/api/fetchFIIDataCalculations",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        const nifty_future = data[0]["NIFTY FUTURES"];
        const nifty_options = data[1]["NIFTY OPTIONS"];
        const banknifty_future = data[2]["BANKNIFTY FUTURES"];
        const banknifty_options = data[3]["BANKNIFTY OPTIONS"];
        if (selectedNiftyOption === "NIFTY OPTIONS") {
          SetActivityData(nifty_options);
          setSelectedOption(nifty_options);
        } else if (selectedNiftyOption === "BANKNIFTY FUTURES") {
          console.log("BANKNIFTY FUTURES matched");
          SetActivityData(banknifty_future);
          setSelectedOption(banknifty_future);
        } else if (selectedNiftyOption === "BANKNIFTY OPTIONS") {
          SetActivityData(banknifty_options);
          setSelectedOption(banknifty_options);
        } else {
          SetActivityData(nifty_future);
          setSelectedOption(nifty_future);
        }

        setSelectedBankNiftyOptions(banknifty_options);
        console.log(`Processing data for: ${option}`);
      }
    } catch (error) {
      console.error("Error fetching FII data:", error);
    }
  };

  React.useEffect(() => {
    fetchFIIData(selectedNiftyOption);
  }, [selectedNiftyOption]);

  const getProgressWidth = (level: number) => {
    const maxLevel = Math.max(...activityData.map((d) => d.activityLevel));
    return (level / maxLevel) * 100;
  };

  const getBuildupColor = (type: string) => {
    switch (type) {
      case "Long Unwinding" :
        return isDark
            ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-700";
      case "Short Buildup":
        return isDark 
         ? "bg-red-900 text-red-300" 
        : "bg-red-100 text-red-700";
      case "Long Buildup":
        return isDark
            ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-700";
      default:
        return isDark
          ? "bg-red-700 text-red-300"
          : "bg-red-100 text-red-700";
    }
  };

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
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
              Total FII Activity
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
            >
              ₹{Array.isArray(selectedOption) ? selectedOption.reduce((sum, row) => sum + (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0), 0).toFixed(2) : 0} Cr
            </div>
            <div
              className={`text-xs ${isDark ? "text-green-400" : "text-green-600"} mt-1`}
            >
              {/* Example: Percentage change from previous week. Replace with actual calculation if available in API */}
              {/* +{percentChange}% from last week */}
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
              Net Position
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
            >
              {Array.isArray(selectedOption) ? (() => {
                const netLong = selectedOption.reduce((sum, row) => sum + (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0), 0);
                return (netLong >= 0 ? "+" : "-") + "₹" + Math.abs(netLong).toFixed(2) + " Cr";
              })() : "+₹0 Cr"}
            </div>
            <div
              className={`text-xs ${isDark ? "text-blue-400" : "text-blue-600"} mt-1`}
            >
              Net Long Position
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
              Impact Score
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-orange-400" : "text-orange-600"}`}
            >
              {/* Impact Score logic: you can replace this with a calculation based on volatility or other API data */}
              {Array.isArray(selectedOption) ? (() => {
                // Example: Use standard deviation of netAmount as a proxy for impact
                const values = selectedOption.map(row => typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0);
                const avg = values.reduce((sum, v) => sum + v, 0) / (values.length || 1);
                const stdev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / (values.length || 1));
                if (stdev > 1000) return "High";
                if (stdev > 500) return "Medium";
                return "Low";
              })() : "-"}
            </div>
            <div
              className={`text-xs ${isDark ? "text-orange-400" : "text-orange-600"} mt-1`}
            >
              Market Impact Level
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
              Active Days
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}
            >
              {Array.isArray(selectedOption) ? `${selectedOption.length}/5` : "0/5"}
            </div>
            <div
              className={`text-xs ${isDark ? "text-purple-400" : "text-purple-600"} mt-1`}
            >
              This Week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Activity Table */}
      <Card
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl overflow-hidden`}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`${isDark ? "bg-cyan-800" : "bg-cyan-600"} text-white`}
                >
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Net Contracts
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Net Amount
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    COI
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Position Buildup
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {activityData?.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:${isDark ? "bg-gray-700" : "bg-gray-50"} transition-colors duration-200`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div
                          className={`font-medium text-center ${isDark ? "text-gray-300" : "text-gray-900"}`}
                        >
                          {row.tradeDate}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        row.netContracts?.startsWith("-")
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {row.netContract}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        row.netAmount ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {row.netAmount}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        row?.netChange ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {row?.netChange}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant="secondary"
                        className={`${getBuildupColor
                          (row.positionBuildUp) }border-0 font-medium`}
                      >
                        {row.positionBuildUp}
                      </Badge>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div
                            className={`h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}
                          >
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1500 ease-out animate-pulse"
                              style={{
                                width: `${getProgressWidth(row.activityLevel)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} min-w-max`}
                        >
                          ₹{row.activityLevel} Cr
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant="secondary"
                        className={`${getBuildupColor(row.buildupType)} border-0 font-medium`}
                      >
                        {row.buildup}
                      </Badge>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl`}
        >
          <CardContent className="p-6">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4`}
            >
              Weekly Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Total Volume
                </span>
                <span
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  ₹{Array.isArray(selectedOption) ? selectedOption.reduce((sum, row) => sum + (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0), 0).toFixed(2) : 0} Cr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Net Long
                </span>
                <span className="font-semibold text-green-600">
                  {Array.isArray(selectedOption) ? (() => {
                    const netLong = selectedOption.reduce((sum, row) => sum + (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0), 0);
                    return (netLong >= 0 ? "+" : "-") + "₹" + Math.abs(netLong).toFixed(2) + " Cr";
                  })() : "+₹0 Cr"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Net Short
                </span>
                <span className="font-semibold text-red-600">
                  {Array.isArray(selectedOption) ? (() => {
                    const netShort = selectedOption.filter(row => (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0) < 0).reduce((sum, row) => sum + (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0), 0);
                    return "-₹" + Math.abs(netShort).toFixed(2) + " Cr";
                  })() : "-₹0 Cr"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Avg Daily Volume
                </span>
                <span
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  ₹{Array.isArray(selectedOption) && selectedOption.length > 0 ? (selectedOption.reduce((sum, row) => sum + (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0), 0) / selectedOption.length).toFixed(2) : 0} Cr
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl`}
        >
          <CardContent className="p-6">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4`}
            >
              Market Sentiment
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Bullish Days
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">{Array.isArray(selectedOption) ? selectedOption.filter(row => (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0) > 0).length : 0}/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Bearish Days
                </span>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-red-600">{Array.isArray(selectedOption) ? selectedOption.filter(row => (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0) < 0).length : 0}/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Neutral Days
                </span>
                <span
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {Array.isArray(selectedOption) ? selectedOption.filter(row => (typeof row.netAmount === "number" ? row.netAmount : parseFloat((row.netAmount ?? "0").toString().replace(/[^\d.-]/g, "")) || 0) === 0).length : 0}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Overall Trend
                </span>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 border-0"
                >
                  Neutral
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

export default FIIData;
