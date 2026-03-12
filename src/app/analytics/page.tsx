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
  Legend,
  AreaChart,
  Area
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
  MapPin,
  CheckCircle2,
  Trophy,
  Activity,
  Star,
  Award,
  Medal
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
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const interestData = [
  { name: 'Environment', value: 450, color: 'hsl(197, 71%, 73%)' },
  { name: 'Education', value: 380, color: 'hsl(182, 100%, 75%)' },
  { name: 'Health', value: 250, color: 'hsl(208, 60%, 80%)' },
  { name: 'Community', value: 320, color: 'hsl(197, 40%, 60%)' },
];

const hoursTrendData = [
  { month: 'Jan', hours: 450, volunteers: 45 },
  { month: 'Feb', hours: 520, volunteers: 52 },
  { month: 'Mar', hours: 850, volunteers: 85 },
  { month: 'Apr', hours: 1200, volunteers: 120 },
  { month: 'May', hours: 1100, volunteers: 110 },
  { month: 'Jun', hours: 1600, volunteers: 160 },
];

const geographicData = [
  { region: 'Puducherry', impact: 1240 },
  { region: 'Chennai', impact: 850 },
  { region: 'Bangalore', impact: 920 },
  { region: 'Madurai', impact: 340 },
  { region: 'Trichy', impact: 210 },
];

const eventPerformanceData = [
  { cause: 'Env', reg: 120, att: 95 },
  { cause: 'Edu', reg: 80, att: 72 },
  { cause: 'Health', reg: 150, att: 110 },
  { cause: 'Comm', reg: 90, att: 85 },
];

const topNgos = [
  { name: 'Green Earth Foundation', hours: 1240, events: 12, rating: 4.9 },
  { name: 'Hope Helpers', hours: 980, events: 8, rating: 4.8 },
  { name: 'Tech Forward', hours: 750, events: 5, rating: 4.7 },
  { name: 'Animal Allies', hours: 620, events: 9, rating: 4.9 },
];

const topVolunteers = [
  { name: 'Priya Sharma', hours: 145, events: 12, badges: 18, avatarUrl: 'avatar-priya-sharma' },
  { name: 'Ananya Rao', hours: 132, events: 10, badges: 15, avatarUrl: 'avatar-ananya-rao' },
  { name: 'Rohan Mehta', hours: 118, events: 9, badges: 14, avatarUrl: 'avatar-rohan-mehta' },
  { name: 'Sanya Iyer', hours: 95, events: 7, badges: 11, avatarUrl: 'avatar-ananya-rao' },
];

const chartConfig = {
  hours: {
    label: 'Total Hours',
    color: 'hsl(197, 71%, 73%)',
  },
  volunteers: {
    label: 'Volunteers',
    color: 'hsl(182, 100%, 75%)',
  },
  reg: {
    label: 'Registered',
    color: 'hsl(197, 71%, 73%)',
  },
  att: {
    label: 'Attended',
    color: 'hsl(182, 100%, 75%)',
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
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 animate-slide-in-from-bottom pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ConnectSphere Analytics</h1>
          <p className="text-muted-foreground text-sm">Real-time performance metrics and deep-dive impact analysis.</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Time Period
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Range</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleFilterSelect("Last 30 Days")}>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("Last Quarter")}>Last Quarter</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterSelect("Last Year")}>Last Year</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilterSelect("All Time")}>All Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> Download Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Volunteers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% vs last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Impact Value</CardTitle>
            <Trophy className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12.4L</div>
            <p className="text-xs text-muted-foreground mt-1">Estimated community value</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-400 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg. Attendance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all 124 projects</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-400 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">NGO Retention</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Active within 90 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Impact vs. Engagement Trend</CardTitle>
            <CardDescription>Correlating total hours with volunteer registration numbers.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={hoursTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-hours)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-hours)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="var(--color-hours)" 
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="volunteers" 
                  stroke="var(--color-volunteers)" 
                  fillOpacity={0} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Legend verticalAlign="top" height={36}/>
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cause Interest Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Cause Engagement Breakdown</CardTitle>
            <CardDescription>Distribution of volunteer interest across key causes.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
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
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" align="center" layout="horizontal" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Regional Impact Distribution
            </CardTitle>
            <CardDescription>Activity density by major service regions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={geographicData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="region" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="impact" fill="var(--color-hours)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top NGOs Performance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold">Top Performing NGOs</CardTitle>
            <CardDescription>Organizations with the highest platform contribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Organization</TableHead>
                    <TableHead className="text-xs text-right">Hours</TableHead>
                    <TableHead className="text-xs text-right">Events</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topNgos.map((ngo) => (
                    <TableRow key={ngo.name}>
                      <TableCell>
                        <p className="text-sm font-semibold">{ngo.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Trophy className="h-2 w-2 text-yellow-500" /> {ngo.rating} Platform Rating
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-bold">{ngo.hours}</TableCell>
                      <TableCell className="text-right text-sm">{ngo.events}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Volunteers */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" /> Top Performing Volunteers
            </CardTitle>
            <CardDescription>Individual members with the highest impact scores.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Volunteer</TableHead>
                    <TableHead className="text-xs text-right">Hours</TableHead>
                    <TableHead className="text-xs text-right">Badges</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topVolunteers.map((vol) => {
                    const avatar = PlaceHolderImages.find(p => p.id === vol.avatarUrl);
                    return (
                      <TableRow key={vol.name}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={avatar?.imageUrl} alt={vol.name} />
                              <AvatarFallback>{vol.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold leading-none">{vol.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{vol.events} Events Done</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm font-bold">{vol.hours}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="text-[10px] font-bold">
                            {vol.badges}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Event Performance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold">Event Success Rate</CardTitle>
            <CardDescription>Auditing registration vs. actual attendance.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={eventPerformanceData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
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
