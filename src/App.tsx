import React, { useState, createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import Activities from "./pages/Activities";
import FIIData from "./pages/FIIData";
import NetLongSummary from "./pages/NetLongSummary";
import History from "./pages/History";
import DailyChange from "./pages/DailyChange";
import FAOParticipants from "./pages/FAOParticipants";
import TradingActivities from "./pages/TradingActivities";
import IndexNetLongSummary from "./pages/IndexNetLongSummary";
import IndexHistory from "./pages/IndexHistory";
import IndexDailyChange from "./pages/IndexDailyChange";

const queryClient = new QueryClient();

// Theme Context
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const App = () => {
  const [activeTab, setActiveTab] = useState("activities");
  const [activeSection, setActiveSection] = useState("fii-activities"); // "fii-activities" or "index-futures"
  const [isDark, setIsDark] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Jun 12, 2025");
  const [selectedParticipant, setSelectedParticipant] = useState("DII");
  const [selectedNiftyOption, setSelectedNiftyOption] =
    useState("NIFTY FUTURE");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === "index-futures") {
      setActiveTab("net-long-summary"); // Default tab for index futures
    } else {
      setActiveTab("activities"); // Default tab for FII activities
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const renderCurrentPage = () => {
    if (activeSection === "index-futures") {
      switch (activeTab) {
        case "net-long-summary":
          return (
            <IndexNetLongSummary
              selectedDate={new Date(selectedDate)}
              selectedParticipant={selectedParticipant}
            />
          );

        case "history":
          return <IndexHistory />;
        case "daily-change":
          return <IndexDailyChange />;
        default:
          return <IndexNetLongSummary />;
      }
    } else {
      switch (activeTab) {
        case "activities":
          return (
            <Activities
              selectedDate={selectedDate}
              selectedParticipant={selectedParticipant}
            />
          );
        case "fii-data":
          return <FIIData selectedNiftyOption={selectedNiftyOption} />;
        case "fao-participants":
          return (
            <FAOParticipants
              selectedParticipant={selectedParticipant}
              selectedCategory={selectedNiftyOption || "Futures"}
            />
          );
        case "trading-activities":
          return (
            <TradingActivities
              selectedParticipant={selectedParticipant}
              selectedDate={selectedDate}
            />
          );
        default:
          return <Activities selectedDate={selectedDate} />;
      }
    }
  };

  const themeValue = {
    isDark,
    toggleTheme,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeValue}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div
            className={`min-h-screen ${isDark ? "dark bg-gray-900" : "bg-gray-50"}`}
          >
            <Header
              activeTab={activeTab}
              onTabChange={handleTabChange}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedParticipant={selectedParticipant}
              onParticipantChange={setSelectedParticipant}
              selectedNiftyOption={selectedNiftyOption}
              onNiftyOptionChange={setSelectedNiftyOption}
            />
            {renderCurrentPage()}
          </div>
        </TooltipProvider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};
export default App;
