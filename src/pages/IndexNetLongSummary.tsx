import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../App";
interface FaoParticipant {
  clientType: string;
  tradeDate: string;
  netLongPosition: number;
  netOI: number;
  futureIndexOIChg: number;
  outstandingCallsNet: number;
  outstandingPutsNet: number;
}

interface IndexNetLongSummaryProps {
  selectedParticipant: string;
  selectedDate: Date;
}

const IndexNetLongSummary = ({
  selectedParticipant,
  selectedDate,
}: IndexNetLongSummaryProps) => {
  const { isDark } = useTheme();
  const [dataList, setDataList] = useState<FaoParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);

  const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const loadData = async (participant: string, date: Date) => {
    const formattedDate = formatDateForApi(date);
    const apiUrl = `http://103.154.252.16:8080/futureBull/api/fetchPositionsByCategory?date=${formattedDate}`;

    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Fetched Data:", data);

      setIsApiConnected(true);

      if (Array.isArray(data?.faoParticipantsList)) {
        setDataList(
          data.faoParticipantsList.filter((p: any) =>
            ["FII", "DII", "Client", "Pro"].includes(p.clientType),
          ),
        );
      } else {
        setDataList([]);
        console.warn("No faoParticipantsList found in response");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setIsApiConnected(false);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedParticipant) {
      loadData(selectedParticipant, selectedDate);
    }
  }, [selectedDate, selectedParticipant]);

  const getValueColor = (value: number) => {
    if (value > 0) {
      return isDark ? "text-green-400" : "text-green-600";
    } else if (value < 0) {
      return isDark ? "text-red-400" : "text-red-600";
    }
    return isDark ? "text-gray-300" : "text-gray-700";
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // const getValueColor = (value: string) => {
  //   const numValue = parseFloat(value);
  //   if (numValue > 0) {
  //     return isDark ? "text-green-400" : "text-green-600";
  //   } else if (numValue < 0) {
  //     return isDark ? "text-red-400" : "text-red-600";
  //   }
  //   return isDark ? "text-gray-300" : "text-gray-700";
  // };

  if (loading) {
    return (
      <div
        className={`p-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} flex items-center justify-center`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-teal-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse w-6 h-6 bg-teal-600 rounded-full"></div>
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Loading Net Long Summary
            </div>
            <div
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Fetching position analysis...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-6 space-y-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header Section */}
      {/* Header Section - Simple title */}
      <div className="text-center">
        <h1
          className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-2`}
        >
          Net Long Summary
        </h1>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Index Futures position analysis across participant categories
        </p>
      </div>

      {/* Main Summary Table */}
      <Card
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
             
              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dataList.length > 0 ? (
                    dataList.map((participant, index) => (
                      <Card
                        key={index}
                        className={`${
                          isDark
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        } rounded-xl p-4`}
                      >
                        <CardContent className="space-y-2">
                          <h3 className="text-center text-lg font-bold text-teal-500">
                            {participant.clientType}
                          </h3>
                          <div>
                            <p className="text-sm text-gray-500">
                              Net Long Position
                            </p>
                            <p
                              className={`text-xl font-bold ${getValueColor(
                                participant.netLongPosition,
                              )}`}
                            >
                              {participant.netLongPosition}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Net OI</p>
                            <p
                              className={`text-xl font-bold ${getValueColor(participant.netOI)}`}
                            >
                              {participant.netOI}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Change in OI
                            </p>
                            <p
                              className={`text-xl font-bold ${getValueColor(
                                participant.futureIndexOIChg,
                              )}`}
                            >
                              {participant.futureIndexOIChg}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div
                      style={{ width: "1620px" }}
                      className="border border-white flex items-center justify-center"
                    >
                      <p className="text-gray-500 text-center text-lg">
                        No Data Available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
        >
          <CardContent className="p-6 text-center">
            <h3
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}
            >
              Net CLIENT Position
            </h3>
            <div
              className={`text-2xl font-bold text-blue-600 group-hover:text-blue-500 transition-colors duration-300`}
            >
              23,499
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
            >
              OI Value
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
              Net FII Position
            </h3>
            <div
              className={`text-2xl font-bold text-green-600 group-hover:text-green-500 transition-colors duration-300`}
            >
              31,205
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
            >
              OI Value
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
              Net DII Position
            </h3>
            <div
              className={`text-2xl font-bold text-red-600 group-hover:text-red-500 transition-colors duration-300`}
            >
              -16,763
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
            >
              OI Value
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
              Net PRO Position
            </h3>
            <div
              className={`text-2xl font-bold text-purple-600 group-hover:text-purple-500 transition-colors duration-300`}
            >
              9,056
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
            >
              OI Value
            </div>
          </CardContent>
        </Card>
      </div> */}

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

export default IndexNetLongSummary;
