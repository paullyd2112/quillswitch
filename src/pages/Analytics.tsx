
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { BarChart2, LineChart, PieChart, TrendingUp, Users, Database, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-8 pb-16">
        <Container>
          <PageHeader 
            heading="Analytics Dashboard" 
            subheading="Monitor your migration performance and insights"
            className="mb-8"
          />
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-green-500 dark:border-l-green-600">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Migration Success Rate</CardTitle>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">94.7%</div>
                    <p className="text-sm text-muted-foreground">+4.3% from last month</p>
                    <div className="mt-4 h-36 flex items-center justify-center text-muted-foreground">
                      <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        Chart placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-600">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Records Migrated</CardTitle>
                    <Database className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2.8M</div>
                    <p className="text-sm text-muted-foreground">+320K this month</p>
                    <div className="mt-4 h-36 flex items-center justify-center text-muted-foreground">
                      <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        Chart placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-600">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Active Users</CardTitle>
                    <Users className="h-5 w-5 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1,249</div>
                    <p className="text-sm text-muted-foreground">+18.2% from last week</p>
                    <div className="mt-4 h-36 flex items-center justify-center text-muted-foreground">
                      <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        Chart placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-600">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Avg. Migration Speed</CardTitle>
                    <Zap className="h-5 w-5 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">4.2k/s</div>
                    <p className="text-sm text-muted-foreground">+12% improvement</p>
                    <div className="mt-4 h-36 flex items-center justify-center text-muted-foreground">
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
                    <CardTitle>Migration Trend (Last 30 Days)</CardTitle>
                    <CardDescription>Total records moved per day across all projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        Trend chart placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Migration by Object Type</CardTitle>
                    <CardDescription>Distribution of migrated data by object category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        Distribution chart placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Performance</CardTitle>
                    <CardDescription>Resource utilization during migration processes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        Performance metrics chart placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Login frequency and feature usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        User activity chart placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="data">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Migration Quality</CardTitle>
                    <CardDescription>Error rates and validation metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      <div className="w-full h-full rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        Data quality chart placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
    </div>
  );
};

export default Analytics;
