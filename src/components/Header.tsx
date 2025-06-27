import React, { useState, useEffect } from "react";
import {
  Calendar,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Filter,
  User,
  Settings,
  Bell,
  BarChart3,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useTheme } from "../App";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedParticipant: string;
  onParticipantChange: (participant: string) => void;
  selectedNiftyOption: string;
  onNiftyOptionChange: (option: string) => void;
  isDarks: boolean;
}

const Header = ({
  activeTab,
  onTabChange,
  activeSection,
  onSectionChange,
  selectedDate,
  onDateChange,
  selectedParticipant,
  onParticipantChange,
  selectedNiftyOption,
  isDarks,
  onNiftyOptionChange,
}: HeaderProps) => {
  const { isDark, toggleTheme } = useTheme();
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Trade dates state for activities calendar
  const [tradeDates, setTradeDates] = useState<string[]>([]);
  const [tradeDatesLoading, setTradeDatesLoading] = useState(false);

  useEffect(() => {
    const fetchTradeDates = async () => {
      setTradeDatesLoading(true);
      try {
        const res = await fetch(
          "http://103.154.252.16:8080/futureBull/api/fetchTradeDates",
        );
        const data = await res.json();
        setTradeDates(
          Array.isArray(data.tradeDatesList) ? data.tradeDatesList : [],
        );
      } catch (e) {
        setTradeDates([]);
      } finally {
        setTradeDatesLoading(false);
      }
    };
    fetchTradeDates();
  }, []);

  useEffect(() => {
    if (tradeDates.length > 0) {
      if (!selectedDate || !tradeDates.includes(selectedDate)) {
        onDateChange(tradeDates[tradeDates.length - 1]);
      }
    }
    // Only run when tradeDates changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeDates]);

  const fiiActivitiesTabs = [
    { id: "activities", label: "Activities", icon: TrendingUp },
    { id: "fii-data", label: "FII Data", icon: BarChart3 },
    { id: "fao-participants", label: "FAO Participants", icon: Users },
    { id: "trading-activities", label: "Trading Activities", icon: Activity },
  ];

  const indexFuturesTabs = [
    { id: "net-long-summary", label: "Net Long Summary" },
    { id: "history", label: "History" },
    { id: "daily-change", label: "Daily Change" },
  ];

  const currentTabs =
    activeSection === "index-futures" ? indexFuturesTabs : fiiActivitiesTabs;
  const participants = ["FII", "DII", "Client", "Pro"];

  const tradeDateSet = new Set(Array.isArray(tradeDates) ? tradeDates : []);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const getLocalIso = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const iso = getLocalIso(date);
      if (tradeDateSet.has(iso)) {
        onDateChange(iso);
        setIsDateOpen(false);
      }
    }
  };

  const isDateDisabled = (date: Date) => {
    const iso = getLocalIso(date);
    return !tradeDateSet.has(iso);
  };

  return (
    <div
      className={`sticky top-0 z-50 ${isDark ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"} backdrop-blur-md border-b shadow-sm`}
    >
      {/* Main Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Brand + Mobile Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-lg">FII</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                FII Tracker
              </h1>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Live Market Intelligence
              </p>
            </div>

            {/* Mobile Quick Navigation */}
            <div className="flex items-center gap-1 sm:hidden ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg dark:text-white dark:hover:bg-gray-800"
                onClick={() => onTabChange("activities")}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg dark:text-white dark:hover:bg-gray-800"
                onClick={() => onTabChange("fii-data")}
              >
                <TrendingUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg dark:text-white dark:hover:bg-gray-800"
                onClick={() => onTabChange("fao-participants")}
              >
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Center: Navigation (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Section Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg  ${isDark ? "text-white hover:bg-gray-800" : "text-gray-900"}`}
                >
                  <span className="font-semibold">
                    {activeSection === "index-futures"
                      ? "Index Futures"
                      : "FII Activities"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem
                  onClick={() => onSectionChange("fii-activities")}
                  className={
                    activeSection === "fii-activities" ? "bg-blue-50" : ""
                  }
                >
                  FII Activities
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSectionChange("index-futures")}
                  className={
                    activeSection === "index-futures" ? "bg-blue-50" : ""
                  }
                >
                  Index Futures
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tab Navigation */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 ml-2">
              {currentTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  className={`${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300  dark:hover:text-white"
                  } rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right: Profile & Controls */}
          <div className={`flex items-center gap-2 sm:gap-3`}>
            {/* Notifications (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-gray-700 dark:text-white  dark:hover:bg-gray-800 transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
            </Button>

            {/* Settings (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-gray-700 dark:text-white  dark:hover:bg-gray-800 transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Profile (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-gray-700 dark:text-white  dark:hover:bg-gray-800 transition-all duration-200"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-gray-700 dark:text-white  dark:hover:bg-gray-800 transition-all duration-200"
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-lg dark:text-white dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`lg:hidden dark:text-white border-t ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Section Selector Mobile */}
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2"
                  >
                    <span className="font-semibold">
                      {activeSection === "index-futures"
                        ? "Index Futures"
                        : "FII Activities"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      onSectionChange("fii-activities");
                      setIsMobileMenuOpen(false);
                    }}
                    className={
                      activeSection === "fii-activities" ? "bg-blue-50" : ""
                    }
                  >
                    FII Activities
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onSectionChange("index-futures");
                      setIsMobileMenuOpen(false);
                    }}
                    className={
                      activeSection === "index-futures" ? "bg-blue-50" : ""
                    }
                  >
                    Index Futures
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tab Navigation Mobile */}
            <div className="grid grid-cols-2 dark:text-white gap-2">
              {currentTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  className={`${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300"
                  } rounded-lg text-sm font-medium`}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters & Options
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </Button>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="space-y-4 pt-2 border-t dark:text-white border-gray-200 dark:border-gray-700">
                {/* NIFTY Options */}
                {activeTab === "fii-data" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Market Options
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "NIFTY FUTURE",
                        "NIFTY OPTIONS",
                        "BANK NIFTY FUTURE",
                        "BANK NIFTY OPTIONS",
                      ].map((option) => (
                        <Button
                          key={option}
                          variant={
                            option === selectedNiftyOption
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => onNiftyOptionChange(option)}
                        >
                          {option.split(" ")[0]} {option.split(" ")[1]}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAO Categories */}
                {activeTab === "fao-participants" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categories
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {["Futures", "Index Calls", "Index Puts"].map(
                        (category) => (
                          <Button
                            key={category}
                            variant={
                              category === selectedNiftyOption
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => onNiftyOptionChange(category)}
                          >
                            {category}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Participants */}
                {((activeSection === "fii-activities" &&
                  activeTab === "activities") ||
                  activeTab === "fao-participants") && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium  text-gray-700 dark:text-gray-300">
                      Participants
                    </p>
                    <div className="grid grid-cols-4  gap-2">
                      {participants.map((participant) => (
                        <Button
                          key={participant}
                          variant={
                            participant === selectedParticipant
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => onParticipantChange(participant)}
                        >
                          {participant}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Picker */}
                {activeTab === "activities" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </p>
                    <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{selectedDate}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <CalendarComponent
                          mode="single"
                          selected={new Date()}
                          onSelect={handleDateSelect}
                          disabled={isDateDisabled}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Filters Bar */}
      <div
        className={`${activeTab === "net-long-summary" ? null : `hidden lg:block  px-4 sm:px-6 lg:px-8 py-2 border-t ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50/50"}`} `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between px-4 py-1">
            {/* NIFTY Options */}
            {activeTab === "fii-data" && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Market:
                </span>
                <div className="flex gap-1">
                  {[
                    "NIFTY FUTURE",
                    "NIFTY OPTIONS",
                    "BANKNIFTY FUTURES",
                    "BANKNIFTY OPTIONS",
                  ].map((option) => (
                    <Button
                      key={option}
                      variant={
                        option === selectedNiftyOption ? "default" : "ghost"
                      }
                      size="sm"
                      className={`${
                        option === selectedNiftyOption
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } rounded-md px-3 py-1 text-xs transition-all duration-200`}
                      onClick={() => onNiftyOptionChange(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {/* FAO Categories */}
            {activeTab === "fao-participants" && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Category:
                </span>
                <div className="flex gap-1">
                  {["Futures", "Index Calls", "Index Puts"].map((category) => (
                    <Button
                      key={category}
                      variant={
                        category === selectedNiftyOption ? "default" : "ghost"
                      }
                      size="sm"
                      className={`${
                        category === selectedNiftyOption
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } rounded-md px-3 py-1 text-sm transition-all duration-200`}
                      onClick={() => onNiftyOptionChange(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {/* Participants */}
            {((activeSection === "fii-activities" &&
              activeTab === "activities") ||
              activeTab === "fao-participants") && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Participant:
                </span>
                <div className="flex gap-1">
                  {participants.map((participant) => (
                    <Button
                      key={participant}
                      variant={
                        participant === selectedParticipant
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      className={`${
                        participant === selectedParticipant
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } rounded-md px-3 py-1 text-sm transition-all duration-200`}
                      onClick={() => onParticipantChange(participant)}
                    >
                      {participant}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Picker */}
          {/* {activeTab === "activities" && (
            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200"
                  } hover:shadow-md transition-all duration-200`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{selectedDate}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={new Date()}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  initialFocus
                />  

              </PopoverContent>
            </Popover>
          )} */}
          {(activeTab === "activities" || activeTab === "net-long-summary") && (
            <div className="space-y-2 py-2 px-5 mr-10">
              {/* <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </p> */}
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Calendar
                      className={`w-0 h-4 ${isDark ? "text-gray-300" : "text-gray-500"}`}
                    />
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}
                    >
                      {selectedDate}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={new Date()}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
