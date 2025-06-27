import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  // Sample data for the dashboard
  const fiiData = {
    netActivity: {
      value: "₹16,785 Cr",
      type: "buy", // or "sell"
      date: "10 Jun 2024",
    },
    totalBuy: "₹24,560 Cr",
    totalSell: "₹7,775 Cr",
    dailyActivity: [
      { date: "10 Jun 2024", buy: "₹3,245 Cr", sell: "₹1,560 Cr" },
      { date: "09 Jun 2024", buy: "₹2,890 Cr", sell: "₹2,100 Cr" },
      { date: "08 Jun 2024", buy: "₹4,125 Cr", sell: "₹980 Cr" },
      { date: "07 Jun 2024", buy: "₹3,670 Cr", sell: "₹1,825 Cr" },
      { date: "06 Jun 2024", buy: "₹2,945 Cr", sell: "₹1,310 Cr" },
      { date: "05 Jun 2024", buy: "₹3,785 Cr", sell: "₹2,240 Cr" },
      { date: "04 Jun 2024", buy: "₹3,900 Cr", sell: "₹1,760 Cr" },
    ],
  };

  return (
    <div className="min-h-screen bg-fii-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center">
            <h1 className="text-2xl font-bold text-fii-text">FII Tracker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Net FII Activity Card */}
          <Card className="bg-fii-primary border-0 shadow-lg rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-lg font-medium mb-2">
                    FII Net Buy/Sell
                  </h2>
                  <div className="text-white text-4xl font-bold mb-2">
                    {fiiData.netActivity.value}
                  </div>
                  <p className="text-white/80 text-sm">
                    as on {fiiData.netActivity.date}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Select defaultValue="today">
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                      <ChevronDown className="h-4 w-4 text-white" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buy/Sell Mini Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Buy Card */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block w-3 h-3 bg-fii-buy rounded-full"></span>
                      <h3 className="text-sm font-medium text-gray-600">
                        Total Buy
                      </h3>
                    </div>
                    <div className="text-2xl font-bold text-fii-text">
                      {fiiData.totalBuy}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Sell Card */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block w-3 h-3 bg-fii-sell rounded-full"></span>
                      <h3 className="text-sm font-medium text-gray-600">
                        Total Sell
                      </h3>
                    </div>
                    <div className="text-2xl font-bold text-fii-text">
                      {fiiData.totalSell}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FII Daily Activity Table */}
          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-fii-text mb-4">
                FII Daily Activity
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-left font-medium text-gray-700">
                        Date
                      </TableHead>
                      <TableHead className="text-right font-medium text-gray-700">
                        Buy Value
                      </TableHead>
                      <TableHead className="text-right font-medium text-gray-700">
                        Sell Value
                      </TableHead>
                      <TableHead className="text-right font-medium text-gray-700">
                        Net
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fiiData.dailyActivity.map((day, index) => {
                      const buyAmount = parseFloat(
                        day.buy.replace(/[₹,\sCr]/g, ""),
                      );
                      const sellAmount = parseFloat(
                        day.sell.replace(/[₹,\sCr]/g, ""),
                      );
                      const net = buyAmount - sellAmount;
                      const netFormatted = `₹${Math.abs(net).toLocaleString()} Cr`;

                      return (
                        <TableRow
                          key={index}
                          className="border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <TableCell className="font-medium text-fii-text">
                            {day.date}
                          </TableCell>
                          <TableCell className="text-right text-fii-buy font-medium">
                            {day.buy}
                          </TableCell>
                          <TableCell className="text-right text-fii-sell font-medium">
                            {day.sell}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${net >= 0 ? "text-fii-buy" : "text-fii-sell"}`}
                          >
                            {net >= 0 ? "+" : "-"}
                            {netFormatted}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Buy/Sell Distribution Chart */}
          <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-fii-text mb-4">
                Buy/Sell Distribution
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                {/* Simple visual representation */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-fii-buy/20 flex items-center justify-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-fii-buy"></div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">Buy</div>
                    <div className="text-lg font-bold text-fii-buy">
                      {fiiData.totalBuy}
                    </div>
                  </div>
                  <div className="text-4xl text-gray-300 font-light">vs</div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-fii-sell/20 flex items-center justify-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-fii-sell"></div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      Sell
                    </div>
                    <div className="text-lg font-bold text-fii-sell">
                      {fiiData.totalSell}
                    </div>
                  </div>
                </div>
              </div>

              {/* Net result summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    Net FII Activity
                  </div>
                  <div className="text-xl font-bold text-fii-buy">
                    ₹
                    {(
                      parseFloat(fiiData.totalBuy.replace(/[₹,\sCr]/g, "")) -
                      parseFloat(fiiData.totalSell.replace(/[₹,\sCr]/g, ""))
                    ).toLocaleString()}{" "}
                    Cr
                  </div>
                  <div className="text-xs text-gray-500">Net Buying</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2025 FII Tracker
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
