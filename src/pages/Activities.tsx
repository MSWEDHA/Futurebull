import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../App";

interface ActivitiesProps {
  selectedDate?: string;
  selectedParticipant?: string;
}

const Activities = ({
  selectedDate = "2025-05-19",
  selectedParticipant = "FII",
}: ActivitiesProps) => {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date();
        let dateObject = new Date(selectedDate);

        // If selected date is today, subtract one day
        if (
          dateObject.toISOString().split("T")[0] ===
          today.toISOString().split("T")[0]
        ) {
          dateObject.setDate(dateObject.getDate() - 1);
        }

        const formattedDate = dateObject.toISOString().split("T")[0];

        // ✅ Now it's safe to log
        console.log(
          `🔄 Fetching activities data for ${selectedParticipant} on ${formattedDate}`,
        );

        const res = await fetch(
          `http://103.154.252.16:8080/futureBull/api/findByClientTypeAndTradeDate?client=${selectedParticipant}&date=${formattedDate}`,
        );
        const response = await res.json();

        const fao = response?.faoParticipants;
        const fii = response?.fiiStatsCalculations;

        if (fao && fii) {
          const apiData = {
            netFlow: fii.indexFutures ?? 0,
            callsOI: fao.optionCallLong / 1000,
            putsOI: fao.optionPutLong / 1000,
            formattedDate,
          };
          
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, selectedParticipant]);

  // const Activities = ({
  //   selectedDate = "2025-05-19",
  //   selectedParticipant = "FII",
  // }: ActivitiesProps) => {
  //   const { isDark } = useTheme();
  //   const [data, setData] = useState(null);
  //   const [loading, setLoading] = useState(false);

  // const Activities = ({
  //   selectedDate = "2025-05-19",
  //   selectedParticipant = "FII",
  // }: ActivitiesProps) => {
  //   const { isDark } = useTheme();
  //   const [data, setData] = useState<any>(null);
  //   const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       let dateObject = new Date(selectedDate);

  //       const today = new Date();
  //       const isToday =
  //         dateObject.toISOString().split("T")[0] ===
  //         today.toISOString().split("T")[0];

  //       if (isToday) {
  //         dateObject.setDate(dateObject.getDate() - 1);
  //       }

  //       const formattedDate = dateObject.toISOString().split("T")[0];

  //       const res = await fetch(
  //         `http://103.154.252.16:8080/futureBull/api/findByClientTypeAndTradeDate?client=${selectedParticipant}&date=${formattedDate}`
  //       );
  //       const response = await res.json();

  //       if (response?.faoParticipants && response?.fiiStatsCalculations) {
  //         const apiData = {
  //           netFlow: response.fiiStatsCalculations.indexFutures,
  //           callsOI: response.faoParticipants.optionCallLong / 1000,
  //           putsOI: response.faoParticipants.optionPutLong / 1000,
  //         };
  //         setData(apiData);
  //       } else {
  //         setData(null);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching activities data:", error);
  //       setData(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [selectedDate, selectedParticipant]);

  // Data structure from API response
  const getDemoDataFromAPI = () => {
    return {
      netFlow: -86.75, // from fiiStatsCalculations.indexFutures
      callsOI: 2606.76, // from faoParticipants.optionCallLong / 1000
      putsOI: 2082.09, // from faoParticipants.optionPutLong / 1000
      outstandingOpenInterest: {
        callOptions: {
          qty: "26.07L Qty", // optionCallLong formatted
          long: 2606.76, // optionCallLong / 1000
          short: 2764.46, // optionCallShort / 1000
          net: -157.7, // outstandingCallsNet / 1000
        },
        putOptions: {
          qty: "20.82L Qty", // optionPutLong formatted
          long: 2082.09, // optionPutLong / 1000
          short: 2275.41, // optionPutShort / 1000
          net: -193.32, // outstandingPutsNet / 1000
        },
      },
      indexOptionsActivity: {
        callsChanges: {
          netChange: "57.97K Qty", // intradayCallsNet formatted
          longOI: 497.4, // callsLongChange / 1000
          shortOI: 439.4, // callsShortChange / 1000
        },
        putsChanges: {
          netChange: "0.69K Qty", // intradayPutsNet formatted
          longOI: 150.2, // putsLongChange / 1000
          shortOI: 149.5, // putsShortChange / 1000
        },
      },
      marketFlow: {
        indexFuture: -86.75, // fiiStatsCalculations.indexFutures
        niftyFuture: -352.26, // fiiStatsCalculations.niftyFutures
        bankNifty: 239.02, // fiiStatsCalculations.bankNiftyFutures
      },
    };
  };

  const demoData = getDemoDataFromAPI();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // console.log(
        //   `🔄 Fetching activities data for ${selectedParticipant} on ${formattedDate}`,
        // );
        // const response = await apiService.getFIIData(
        //   selectedParticipant.toLowerCase(),
        //   selectedDate,
        // );
        // if (
        //   response &&
        //   response.faoParticipants &&
        //   response.fiiStatsCalculations
        // ) {
        //   // Map real API data to component structure
        //   const apiData = {
        //     netFlow: response.fiiStatsCalculations.indexFutures,
        //     callsOI: response.faoParticipants.optionCallLong / 1000,
        // --- FETCH DATA FROM API ---
        let dateObject = new Date(selectedDate);

        const today = new Date();
        const isToday =
          dateObject.toISOString().split("T")[0] ===
          today.toISOString().split("T")[0];

        if (isToday) {
          dateObject.setDate(dateObject.getDate() - 1);
        }

        const formattedDate = dateObject.toISOString().split("T")[0];
        const apiUrl = `http://103.154.252.16:8080/futureBull/api/findByClientTypeAndTradeDate?client=${selectedParticipant}&date=${formattedDate}`; // TODO: Replace with your actual API endpoint
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch activities data");
        const response = await res.json();
        // Defensive null checks for API response
        if (
          !response ||
          !response.faoParticipants ||
          !response.fiiStatsCalculations
        ) {
          setData(null);
          return;
        }
        // Map response to your expected data shape if needed
const apiData = {
  netFlow: `${response.fiiStatsCalculations.indexFutures.toFixed(2)} Cr`,

  callsOI: (response.faoParticipants.outstandingCallsNet / 1000).toFixed(1), // in 'L'
  putsOI: (response.faoParticipants.outstandingPutsNet / 1000).toFixed(1),   // in 'L'

  outstandingOpenInterest: {
    callOptions: {
      qty: `${(response.faoParticipants.outstandingCallsNet / 100000).toFixed(2)}L Qty`,
      long: (response.faoParticipants.optionCallLong / 1000).toFixed(2),
      short: (response.faoParticipants.optionCallShort / 1000).toFixed(2),
      net: (response.faoParticipants.outstandingCallsNet / 1000).toFixed(2),
    },
    putOptions: {
      qty: `${(response.faoParticipants.optionPutLong / 100000).toFixed(2)}L Qty`,
      long: (response.faoParticipants.optionPutLong / 1000).toFixed(2),
      short: (response.faoParticipants.optionPutShort / 1000).toFixed(2),
      net: (response.faoParticipants.outstandingPutsNet / 1000).toFixed(2),
    },
  },

  indexOptionsActivity: {
    callsChanges: {
      netChange: `${(response.faoParticipants.intradayCallsNet / 1000).toFixed(2)}K Qty`,
      longOI: (response.faoParticipants.callsLongChange / 1000).toFixed(2),
      shortOI: (response.faoParticipants.callsShortChange / 1000).toFixed(2),
    },
    putsChanges: {
      netChange: `${(response.faoParticipants.intradayPutsNet / 1000).toFixed(2)}K Qty`,
      longOI: (response.faoParticipants.putsLongChange / 1000).toFixed(2),
      shortOI: (response.faoParticipants.putsShortChange / 1000).toFixed(2),
    },
  },

  marketFlow: {
    indexFuture: response.fiiStatsCalculations.indexFutures,
    niftyFuture: response.fiiStatsCalculations.niftyFutures,
    bankNifty: response.fiiStatsCalculations.bankNiftyFutures,
  },
};

        console.log(apiData);
        setData(apiData);
        console.log("✅ Activities data loaded successfully");
      } catch (error) {
        console.error("Error fetching activities data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, selectedParticipant]); // React to prop changes

  const activityData = data; // Only use fetched data

  const formatCurrency = (value) => {
    return `₹${value} Cr`;
  };

  const formatQuantity = (value) => {
    return `${value}L Qty`;
  };

  // Pie chart data for market flow distribution (using absolute values for chart)
  const pieChartData = activityData?.marketFlow
    ? [
        {
          name: "Index Future",
          value: Math.abs(activityData.marketFlow.indexFuture),
          originalValue: activityData.marketFlow.indexFuture,
          color: "#EF4444",
        },
        {
          name: "Nifty Future",
          value: Math.abs(activityData.marketFlow.niftyFuture),
          originalValue: activityData.marketFlow.niftyFuture,
          color: "#3B82F6",
        },
        {
          name: "Bank Nifty",
          value: Math.abs(activityData.marketFlow.bankNifty),
          originalValue: activityData.marketFlow.bankNifty,
          color: "#10B981",
        },
      ].filter((item) => item.value > 0)
    : [];
  // Only show items with positive values

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const originalValue = data.payload.originalValue;
      return (
        <div
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-lg p-3 shadow-xl`}
        >
          <p
            className={`${isDark ? "text-white" : "text-gray-900"} font-semibold`}
          >
            {data.payload.name}
          </p>
          <p
            className={`font-medium ${originalValue >= 0 ? "text-emerald-500" : "text-red-500"}`}
          >
            {originalValue >= 0 ? "+" : ""}₹{originalValue.toFixed(2)} Cr
          </p>
          <p className="text-xs text-gray-500">
            {(
              (data.value /
                pieChartData.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            % of total volume
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 min-h-screen">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading {selectedParticipant} data for {selectedDate}...
          </span>
        </div>
      </div>
    );
  }

  if (!activityData) {
    return (
      <div className="flex items-center justify-center py-4 min-h-screen">
        <span
          className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          No data available.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`space-y-2 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Summary Cards - Top Row with Enhanced Hover Effects */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span
              className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Loading {selectedParticipant} data for {selectedDate}...
            </span>
          </div>
        </div>
      )}

      <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer group`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-1 group-hover:text-red-400 transition-colors duration-300`}
                >
                  Net Flow
                </div>
                <div className="text-2xl font-bold text-red-500 group-hover:text-red-400 transition-colors duration-300">
                  {activityData.netFlow}
                </div>
              </div>
              <div className="flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="w-5 h-5 text-red-500 group-hover:animate-bounce" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer group`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-1 group-hover:text-blue-400 transition-colors duration-300`}
                >
                  Calls OI
                </div>
                <div className="text-2xl font-bold text-blue-500 group-hover:text-blue-400 transition-colors duration-300">
                  {activityData.callsOI}L
                </div>
              </div>
              <div className="flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 text-blue-500 group-hover:animate-bounce" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer group`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-1 group-hover:text-blue-400 transition-colors duration-300`}
                >
                  Puts OI
                </div>
                <div className="text-2xl font-bold text-blue-500 group-hover:text-blue-400 transition-colors duration-300">
                  {formatQuantity(activityData.putsOI)}
                </div>
              </div>
              <div className="flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 text-blue-500 group-hover:animate-bounce" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Open Interest */}
      <div className="px-5 grid grid-cols-1 md:grid-cols-1 gap-6 py-5">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl transition-all duration-300 px-6 hover:shadow-xl`}
        >
          <CardContent className="p-6">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-6`}
            >
              Outstanding Open Interest
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Call Options */}
              <div className="group">
                <h4
                  className={`text-md font-medium ${isDark ? "text-white" : "text-gray-900"} mb-4 group-hover:text-blue-500 transition-colors duration-300`}
                >
                  Call Options{" "}
                  <span className="text-sm font-normal text-blue-500">
                    {activityData?.outstandingOpenInterest?.callOptions?.qty ??
                      "N/A"}
                  </span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Long
                    </span>

                    <span className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors duration-200">
                      {activityData?.outstandingOpenInterest?.callOptions?.long ??
                        0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Short
                    </span>
                    <span className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors duration-200">
                      {activityData?.outstandingOpenInterest?.callOptions?.short ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      Net
                    </span>
                    <span className="text-sm font-bold text-green-500 hover:text-green-400 transition-colors duration-200">
                      {activityData?.outstandingOpenInterest?.callOptions
                        ?.net ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Put Options */}
              <div className="group">
                <h4
                  className={`text-md font-medium ${isDark ? "text-white" : "text-gray-900"} mb-4 group-hover:text-blue-500 transition-colors duration-300`}
                >
                  Put Options{" "}
                  <span className="text-sm font-normal text-blue-500">
                    {activityData?.outstandingOpenInterest?.putOptions?.qty ??
                      "N/A"}
                  </span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Long
                    </span>
                    <span className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors duration-200">
                      {activityData?.optionCallLong?.putOptions?.long ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Short
                    </span>
                    <span className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors duration-200">
                      {activityData?.outstandingOpenInterest?.putOptions
                        ?.short ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      Net
                    </span>
                    <span className="text-sm font-bold text-green-500 hover:text-green-400 transition-colors duration-200">
                      {activityData?.outstandingOpenInterest?.putOptions?.net ??
                        0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Index Options Activity */}
      <div className="px-5 py-5 grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl transition-all duration-300 hover:shadow-xl`}
        >
          <CardContent className="p-6">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-6`}
            >
              Index Options Activity
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calls Changes */}
              <div className="group">
                <h4
                  className={`text-md font-medium ${isDark ? "text-white" : "text-gray-900"} mb-4 group-hover:text-red-500 transition-colors duration-300`}
                >
                  Calls Changes{" "}
                  <span className="text-sm font-normal text-red-500">↘</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Net Change
                    </span>
                    <span className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors duration-200">
                      {activityData?.indexOptionsActivity?.callsChanges
                        ?.netChange ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Long OI
                    </span>
                    <span className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors duration-200">
                      {activityData?.indexOptionsActivity?.callsChanges
                        ?.longOI ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Short OI
                    </span>
                    <span className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors duration-200">
                      {activityData?.indexOptionsActivity?.callsChanges
                        ?.shortOI ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Puts Changes */}
              <div className="group">
                <h4
                  className={`text-md font-medium ${isDark ? "text-white" : "text-gray-900"} mb-4 group-hover:text-red-500 transition-colors duration-300`}
                >
                  Puts Changes{" "}
                  <span className="text-sm font-normal text-red-500">↘</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Net Change
                    </span>
                    <span className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors duration-200">
                      {activityData?.indexOptionsActivity?.putsChanges
                        ?.netChange ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Long OI
                    </span>
                    <span className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors duration-200">
                      {activityData?.indexOptionsActivity?.putsChanges
                        ?.longOI ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 transition-all duration-200 cursor-pointer">
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Short OI
                    </span>
                    <span className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors duration-200">
                      {activityData?.indexOptionsActivity?.putsChanges
                        ?.shortOI ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Flow Bar Chart */}
      <div className="px-5 py-5 grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl transition-all duration-300 hover:shadow-xl`}
        >
          <CardContent className="p-6">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-6`}
            >
              Market Flow Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pieChartData.map((item) => ({
                    ...item,
                    value: item.originalValue,
                  }))}
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                      border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      color: isDark ? "#FFFFFF" : "#1F2937",
                    }}
                    formatter={(value: number) => [
                      `${value >= 0 ? "+" : ""}₹${value.toFixed(2)} Cr`,
                      "Amount",
                    ]}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.originalValue >= 0 ? "#10B981" : "#EF4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Flow with Pie Chart */}
      <div className="px-5 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl transition-all duration-300 hover:shadow-xl`}
        >
          <CardContent className="p-6">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-6`}
            >
              Market Flow
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Card
                className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2 group-hover:text-red-400 transition-colors duration-300`}
                  >
                    Index Future
                  </div>
                  <div className="text-xl font-bold text-red-500 group-hover:text-red-400 transition-colors duration-300">
                    {formatCurrency(activityData?.marketFlow?.indexFuture ?? 0)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <TrendingDown className="w-4 h-4 text-red-500 group-hover:animate-pulse" />
                    <span className="text-sm text-red-500">↘</span>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2 group-hover:text-blue-400 transition-colors duration-300`}
                  >
                    Nifty Future
                  </div>
                  <div className="text-xl font-bold text-blue-500 group-hover:text-blue-400 transition-colors duration-300">
                    {activityData?.marketFlow?.niftyFuture != null
                      ? formatCurrency(activityData.marketFlow.niftyFuture)
                      : "N/A"}
                  </div>

                  <div className="flex items-center justify-center gap-1 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-4 h-4 text-green-500 group-hover:animate-pulse" />
                    <span className="text-sm text-green-500">↗</span>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2 group-hover:text-green-400 transition-colors duration-300`}
                  >
                    Bank Nifty
                  </div>
                  <div className="text-xl font-bold text-green-500 group-hover:text-green-400 transition-colors duration-300">
                    {activityData?.marketFlow?.bankNifty != null
                      ? formatCurrency(activityData.marketFlow.bankNifty)
                      : "N/A"}
                  </div>

                  <div className="flex items-center justify-center gap-1 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <TrendingDown className="w-4 h-4 text-red-500 group-hover:animate-pulse" />
                    <span className="text-sm text-red-500">↘</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart for Market Distribution */}
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl transition-all duration-300 hover:shadow-xl`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Market Flow Distribution
              </h3>
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Loading...
                  </span>
                </div>
              )}
            </div>

            {pieChartData.length === 0 ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
                  >
                    No Market Flow Data
                  </div>
                  <div
                    className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    All market flow values are zero
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={
                        <CustomPieTooltip
                          active={undefined}
                          payload={undefined}
                        />
                      }
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontSize: "14px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mt-4 text-center">
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Net Market Flow for {selectedParticipant}:{" "}
                <span
                  className={`font-medium ${
                    (activityData?.marketFlow?.indexFuture ?? 0) +
                      (activityData?.marketFlow?.niftyFuture ?? 0) +
                      (activityData?.marketFlow?.bankNifty ?? 0) >=
                    0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {(activityData?.marketFlow?.indexFuture ?? 0) +
                    (activityData?.marketFlow?.niftyFuture ?? 0) +
                    (activityData?.marketFlow?.bankNifty ?? 0) >=
                  0
                    ? "+"
                    : ""}
                  ₹
                  {(
                    (activityData?.marketFlow?.indexFuture ?? 0) +
                    (activityData?.marketFlow?.niftyFuture ?? 0) +
                    (activityData?.marketFlow?.bankNifty ?? 0)
                  ).toFixed(2)}{" "}
                  Cr
                </span>
              </p>
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

export default Activities;
