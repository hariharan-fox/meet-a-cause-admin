'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  TrendingUp, 
  Users, 
  Building, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  Download,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const interestData = [
  { name: 'Environment', value: 400, color: 'hsl(var(--primary))' },
  { name: 'Education', value: 300, color: 'hsl(262, 80%, 70%)' },
  { name: 'Health', value: 300, color: 'hsl(262, 70%, 80%)' },
  { name: 'Community', value: 200, color: 'hsl(262, 60%, 90%)' },
];

const hoursTrendData = [
  { month: 'Jan', hours: 450 },
  { month: 'Feb', hours: 520 },
  { month: 'Mar', hours: 850 },
  { month: 'Apr', hours: 1200 },
  { month: 'May', hours: 1100 },
  { month: 'Jun', hours: 1600 },
];

const eventPerformanceData = [
  { cause: 'Env', reg: 120, att: 95 },
  { cause: 'Edu', reg: 80, att: 72 },
  { cause: 'Health', reg: 150, att: 110 },
  { cause: 'Comm', reg: 90, att: 85 },
];

const chartConfig = {
  hours: {
    label: 'Total Hours',
    color: 'hsl(var(--primary))',
  },
  reg: {
    label: 'Registered',
    color: 'hsl(var(--primary))',
  },
  att: {
    label: 'Attended',
    color: 'hsl(262, 70%, 75%)',
  }
};

export default function AnalyticsPage() {
  const { toast } = useToast();

  const handleFilterSelect = (filter: string) => {
    toast({
      title: "Filter Applied",
      description: `Analytics view updated for: ${filter}`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Report Exporting",
      description: "Your detailed CSV impact report is being generated and will download shortly.",
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 animate-slide-in-from-bottom">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detailed Analytics</h1>
          <p className="text-muted-foreground text-sm">Comprehensive performance metrics and community impact data.</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Time Period</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleFilterSelect("Last 30 Days")}>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("Last Quarter")}>Last Quarter</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("Last Year")}>Last Year</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleFilterSelect("All Causes")}>All Causes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("Environment")}>Environment</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("Education")}>Education</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground mt-1">+4% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Volunteer Retention</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground mt-1">Multi-event participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Partner NGO Growth</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground mt-1">New NGOs this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Impact Value</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12.4L</div>
            <p className="text-xs text-muted-foreground mt-1">Estimated economic value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hours Logged Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Total Impact Hours</CardTitle>
            <CardDescription>Monthly trend of community service hours logged.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={hoursTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="var(--color-hours)" 
                  strokeWidth={3} 
                  dot={{ fill: 'var(--color-hours)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Volunteer Interest Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Causes Distribution</CardTitle>
            <CardDescription>Volunteer engagement by primary cause interest.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interestData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {interestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Performance Comparison */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold">Event Success Comparison</CardTitle>
            <CardDescription>Registration vs. Attendance numbers by cause category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={eventPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="cause" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="reg" fill="var(--color-reg)" radius={[4, 4, 0, 0]} name="Registered" />
                <Bar dataKey="att" fill="var(--color-att)" radius={[4, 4, 0, 0]} name="Attended" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
