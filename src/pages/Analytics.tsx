
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { BarChart2, LineChart, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-12 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Monitor your migration performance and insights.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Migration Success Rate</CardTitle>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87%</div>
              <p className="text-sm text-muted-foreground">+2.5% from last month</p>
              <div className="mt-4 h-36 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for chart */}
                <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  Chart placeholder
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Objects Migrated</CardTitle>
              <BarChart2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">14,532</div>
              <p className="text-sm text-muted-foreground">+1,240 this month</p>
              <div className="mt-4 h-36 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for chart */}
                <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  Chart placeholder
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Error Rate Trend</CardTitle>
              <LineChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2.3%</div>
              <p className="text-sm text-muted-foreground text-green-600">-0.8% from last week</p>
              <div className="mt-4 h-36 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for chart */}
                <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  Chart placeholder
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Migration Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for larger chart */}
                <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  Chart placeholder
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Migration by Object Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for larger chart */}
                <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  Chart placeholder
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
