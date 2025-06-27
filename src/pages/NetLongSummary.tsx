import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "../App";

const NetLongSummary = () => {
  const { isDark } = useTheme();

  const summaryData = [
    {
      label: "Net Long Position",
      client: 2847,
      fii: 1543,
      dii: -432,
      pro: 789,
    },
    {
      label: "Net OI",
      client: 3200,
      fii: 1200,
      dii: -600,
      pro: 950,
    },
    {
      label: "Change in OI",
      client: 450,
      fii: 280,
      dii: -150,
      pro: 320,
    },
  ];

  const chartData = [
    { name: "FII", value: 1543, color: "#3B82F6" },
    { name: "DII", value: -432, color: "#EF4444" },
    { name: "Client", value: 2847, color: "#10B981" },
    { name: "Pro", value: 789, color: "#8B5CF6" },
  ];

  const participantSummary = [
    {
      label: "FII Summary",
      netLong: "₹1,543 Cr",
      netOI: "₹1,200 Cr",
      changeOI: "₹280 Cr",
      trend: "up",
      percentage: "+1.8%",
    },
    {
      label: "DII Summary",
      netLong: "₹-432 Cr",
      netOI: "₹-600 Cr",
      changeOI: "₹-150 Cr",
      trend: "down",
      percentage: "-0.9%",
    },
    {
      label: "Client Summary",
      netLong: "₹2,847 Cr",
      netOI: "₹3,200 Cr",
      changeOI: "₹450 Cr",
      trend: "up",
      percentage: "+2.4%",
    },
    {
      label: "Pro Summary",
      netLong: "₹789 Cr",
      netOI: "₹950 Cr",
      changeOI: "₹320 Cr",
      trend: "up",
      percentage: "+1.2%",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-lg p-3 shadow-lg`}
        >
          <p
            className={`${isDark ? "text-white" : "text-gray-900"} font-semibold`}
          >
            {label}
          </p>
          <p
            className={`${data.value >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {data.value >= 0 ? "+" : ""}₹{data.value} Cr
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Summary Cards - Moved to Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {participantSummary.map((item, index) => (
          <Card
            key={index}
            className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <CardContent className="p-6">
              <div className="text-center">
                <h3
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
                >
                  {item.label}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span
                    className={`text-xl font-bold ${
                      item.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.netLong}
                  </span>
                  {item.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    item.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.percentage}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart Section */}
      <Card
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl`}
      >
        <CardContent className="p-6">
          <h3
            className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-6`}
          >
            Net Long Position by Participant
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize={12}
                />
                <YAxis
                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Charts for Each Activity */}
      <div className="space-y-6">
        {summaryData.map((row, index) => (
          <Card
            key={index}
            className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl`}
          >
            <CardContent className="p-6">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-6`}
              >
                {row.label}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "CLIENT", value: row.client, color: "#10B981" },
                      { name: "FII", value: row.fii, color: "#3B82F6" },
                      { name: "DII", value: row.dii, color: "#EF4444" },
                      { name: "PRO", value: row.pro, color: "#8B5CF6" },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "#374151" : "#E5E7EB"}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={isDark ? "#9CA3AF" : "#6B7280"}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={isDark ? "#9CA3AF" : "#6B7280"}
                      fontSize={12}
                      tickFormatter={(value) => `₹${value} Cr`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {[
                        { name: "CLIENT", value: row.client, color: "#10B981" },
                        { name: "FII", value: row.fii, color: "#3B82F6" },
                        { name: "DII", value: row.dii, color: "#EF4444" },
                        { name: "PRO", value: row.pro, color: "#8B5CF6" },
                      ].map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Value labels below chart */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[
                  { name: "CLIENT", value: row.client, color: "#10B981" },
                  { name: "FII", value: row.fii, color: "#3B82F6" },
                  { name: "DII", value: row.dii, color: "#EF4444" },
                  { name: "PRO", value: row.pro, color: "#8B5CF6" },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className="w-4 h-4 mx-auto mb-1 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {item.name}
                    </div>
                    <div
                      className={`text-lg font-bold ${item.value >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.value >= 0 ? "+" : ""}₹{item.value} Cr
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
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

export default NetLongSummary;
