'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Calendar, Users, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { allNgos, allEvents } from '@/lib/placeholder-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartData = [
  { month: 'Jan', volunteers: 45 },
  { month: 'Feb', volunteers: 52 },
  { month: 'Mar', volunteers: 85 },
  { month: 'Apr', volunteers: 120 },
  { month: 'May', volunteers: 110 },
  { month: 'Jun', volunteers: 160 },
];

const chartConfig = {
  volunteers: {
    label: 'New Volunteers',
    color: 'hsl(var(--primary))',
  },
};

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 animate-slide-in-from-bottom">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, Admin. Here is the platform overview for today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active NGOs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allNgos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">2 pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Live Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allEvents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across 4 causes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,520</div>
            <p className="text-xs text-muted-foreground mt-1">Total community impact</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold">Volunteer Growth</CardTitle>
            <CardDescription>Monthly registration trends for 2024.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={10}
                  />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="volunteers" 
                    fill="var(--color-volunteers)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={60}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold">Recent Approvals</CardTitle>
            <CardDescription>Organizations recently joined the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allNgos.slice(0, 4).map((ngo) => (
                <div key={ngo.id} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{ngo.name}</p>
                    <p className="text-xs text-muted-foreground">{ngo.location}</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}