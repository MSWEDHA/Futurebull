import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../App";

interface FAOParticipantsProps {
  selectedParticipant: string;
  selectedCategory: string;
}

const FAOParticipants = ({
  selectedParticipant,
  selectedCategory,
}: FAOParticipantsProps) => {
  const { isDark } = useTheme();
  const [initialFaoData, setInitialFaoData] = useState([]);

  const [faoData, setFaoData] = useState(initialFaoData);

  const fetchFAOData = async (participant: string, category: string) => {
    try {
      const enableApiCalls = true;
      if (!enableApiCalls) return;

      const clientTypeMap: Record<string, string> = {
        FII: "fii",
        DII: "dii",
        Client: "client",
        Pro: "pro",
      };
      const clientType = clientTypeMap[participant] || "";
      const response = await fetch(
        `http://103.154.252.16:8080/futureBull/api/fetchParticipantsByClientType?client=${clientType}`,
      );

      const data = await response.json();
      setInitialFaoData(data);
      setFaoData(data);
    } catch (error) {
      console.error("Error fetching FAO data:", error);
    }
  };

  React.useEffect(() => {
    if (selectedParticipant && selectedCategory) {
      fetchFAOData(selectedParticipant, selectedCategory);
    }
  }, [selectedParticipant, selectedCategory]);

  const getPositionBadgeColor = (position: string) => {
    switch (position) {
      case "LONG BUILDUP":
        return isDark
           ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-700";
      case "SHORT BUILDUP":
        return isDark 
        ? "bg-red-900 text-red-300" 
        : "bg-red-100 text-red-700";
      case "LONG UNWINDING":
        return isDark
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-700";
      case "SHORT COVERING":
        return isDark
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-700";
      default:
        return isDark
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-700";
    }
  };

  const formatNumber = (value: number | string): string => {
    return value.toString().replace(/[,+]/g, "");
  };

  const getMappedValues = (row) => {
    switch (selectedCategory) {
      case "Index Calls":
        return {
          netPercentage: row.indexCallLongNetPercentage,
          longChange: row.callsLongChange,
          shortChange: row.callsShortChange,
          netOI: row.intradayCallsNet,
          position: row.indexCallLongPosition,
        };
      case "Index Puts":
        return {
          netPercentage: row.indexPutLongNetPercentage,
          longChange: row.putsLongChange,
          shortChange: row.putsShortChange,
          netOI: row.intradayPutsNet,
          position: row.indexPutLongPosition,
        };
      default:
        return {
          netPercentage: row.futureIndexNetPercentage,
          longChange: row.futureIndexLongChange,
          shortChange: row.futureIndexShortChange,
          netOI: row.futureIndexOIChg,
          position: row.futureIndexPosition,
        };
    }
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
              Total Long Positions
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
            >
              ₹{Array.isArray(faoData) ? faoData.reduce((sum, row) => {
                const { longChange } = getMappedValues(row);
                return sum + (typeof longChange === "number" ? longChange : parseFloat((longChange ?? "0").toString().replace(/[^\d.-]/g, "")) || 0);
              }, 0).toFixed(2) : 0} Cr
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
              Total Short Positions
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-red-400" : "text-red-600"}`}
            >
              ₹{Array.isArray(faoData) ? faoData.reduce((sum, row) => {
                const { shortChange } = getMappedValues(row);
                return sum + (typeof shortChange === "number" ? shortChange : parseFloat((shortChange ?? "0").toString().replace(/[^\d.-]/g, "")) || 0);
              }, 0).toFixed(2) : 0} Cr
            </div>
            <div
              className={`text-xs ${isDark ? "text-red-400" : "text-red-600"} mt-1`}
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
              Net Position
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
            >
              ₹{Array.isArray(faoData) ? faoData.reduce((sum, row) => {
                const { netOI } = getMappedValues(row);
                return sum + (typeof netOI === "number" ? netOI : parseFloat((netOI ?? "0").toString().replace(/[^\d.-]/g, "")) || 0);
              }, 0).toFixed(2) : 0} Cr
            </div>
            <div
              className={`text-xs ${isDark ? "text-green-400" : "text-green-600"} mt-1`}
            >
              Net Long
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
              Active Participants
            </h3>
            <div
              className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
            >
              {Array.isArray(faoData) ? faoData.length : 0}
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
            >
              Entities tracked
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
            <div className="min-w-[900px]">
              {/* Table Header */}
              <div
                className={`${isDark ? "bg-cyan-800" : "bg-cyan-600"} text-white sticky top-0 z-10`}
              >
                <div className="grid grid-cols-6 gap-5 px-6 py-4 font-semibold text-sm">
                  <div className="text-center">Date</div>
                  <div className="text-center">NET %</div>
                  <div className="text-center">DIFF IN LONG</div>
                  <div className="text-center">DIFF IN SHORT</div>
                  <div className="text-center">NET OI</div>
                  <div className="text-center">POSITION (LONG VS SHORT)</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {faoData.map((row) => {
                  const {
                    netPercentage,
                    longChange,
                    shortChange,
                    netOI,
                    position,
                  } = getMappedValues(row);

                  return (
                    <div
                      key={row.sno}
                      className={`grid grid-cols-6 py-4 gap-2 px-4 text-sm hover:${isDark ? "bg-gray-700" : "bg-gray-50"} transition-all duration-200 cursor-pointer hover:shadow-md`}
                    >
                      <div
                        className={`font-medium text-center ${isDark ? "text-gray-300" : "text-gray-900"}`}
                      >
                        {row.tradeDate}
                      </div>
                      <div
                        className={`text-center font-semibold ${getValueColor(netPercentage)}`}
                      >
                        {netPercentage} %
                      </div>
                      <div
                        className={`text-center font-semibold ${getValueColor(longChange)}`}
                      >
                        {formatNumber(longChange)}
                      </div>
                      <div
                        className={`text-center font-semibold ${getValueColor(shortChange)}`}
                      >
                        {formatNumber(shortChange)}
                      </div>
                      <div
                        className={`text-center font-bold ${getValueColor(netOI)}`}
                      >
                        {formatNumber(netOI)}
                      </div>
                      <div className="text-center">
                        <Badge
                          variant="secondary"
                          className={`${getPositionBadgeColor(position)} border-0 font-medium`}
                        >
                          {position}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
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

export default FAOParticipants;
