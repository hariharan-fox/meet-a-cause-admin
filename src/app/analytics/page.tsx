'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, Users, Building, Calendar, Clock, ArrowUpRight, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

// Illustrative chart data — will be replaced with real aggregation later
const hoursTrendData = [
  { month: 'Jan', hours: 0 }, { month: 'Feb', hours: 0 },
  { month: 'Mar', hours: 0 }, { month: 'Apr', hours: 0 },
  { month: 'May', hours: 0 }, { month: 'Jun', hours: 0 },
];

const causeData = [
  { name: 'Education', value: 0, color: 'hsl(var(--primary))' },
  { name: 'Environment', value: 0, color: 'hsl(260, 40%, 75%)' },
  { name: 'Health', value: 0, color: 'hsl(260, 40%, 85%)' },
  { name: 'Community', value: 0, color: 'hsl(260, 40%, 65%)' },
];

const chartConfig = {
  hours: { label: 'Hours', color: 'hsl(var(--primary))' },
};

export default function AnalyticsPage() {
  const { toast } = useToast();
  const db = useFirestore();

  // Real counts from Firestore
  const volunteersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: volunteers } = useCollection(volunteersQuery);

  const ngosQuery = useMemoFirebase(() => collection(db, 'ngo_profiles'), [db]);
  const { data: ngos } = useCollection(ngosQuery);

  const eventsQuery = useMemoFirebase(() => collection(db, 'events'), [db]);
  const { data: events } = useCollection(eventsQuery);

  // Calculate real total hours
  const totalHours = volunteers?.reduce((sum, v) => sum + (v.loggedHours || 0), 0) || 0;
  const totalCompletedEvents = volunteers?.reduce((sum, v) => sum + (v.completedEventIds?.length || 0), 0) || 0;

  // Real cause breakdown from events
  const realCauseData = (() => {
    if (!events?.length) return causeData;
    const counts: Record<string, number> = {};
    events.forEach(e => { counts[e.cause] = (counts[e.cause] || 0) + 1; });
    const colors = ['hsl(var(--primary))', 'hsl(260, 40%, 75%)', 'hsl(260, 40%, 85%)', 'hsl(260, 40%, 65%)'];
    return Object.entries(counts).map(([name, value], i) => ({
      name, value, color: colors[i % colors.length]
    }));
  })();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground text-sm">Live counts from Firestore. Charts show illustrative trends.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => toast({ title: 'Export coming soon', description: 'CSV export will be available in a future update.' })}>
          <Download className="h-4 w-4" /> Export Data
        </Button>
      </div>

      {/* Real KPI Counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Volunteers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers?.length ?? '...'}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-foreground/30 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active NGOs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ngos?.length ?? '...'}</div>
            <p className="text-xs text-muted-foreground mt-1">On the platform</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-primary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length ?? '...'}</div>
            <p className="text-xs text-muted-foreground mt-1">Created on platform</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-muted-foreground/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground mt-1">Logged by volunteers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cause Breakdown - Real Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Events by Cause</CardTitle>
            <CardDescription>Distribution of events across causes — live from Firestore.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {realCauseData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={realCauseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {realCauseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <Legend verticalAlign="bottom" align="center" layout="horizontal" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No events added yet. Add events to see cause distribution.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hours Trend - Illustrative */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Volunteer Hours Trend</CardTitle>
            <CardDescription>Illustrative trend — real aggregation coming soon.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={hoursTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-hours)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-hours)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="hours" stroke="var(--color-hours)" fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* NGO List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Registered NGOs</CardTitle>
            <CardDescription>All organizations on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {ngos && ngos.length > 0 ? (
              <div className="space-y-3">
                {ngos.slice(0, 5).map(ngo => (
                  <div key={ngo.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <div>
                      <p className="text-sm font-semibold">{ngo.name}</p>
                      <p className="text-xs text-muted-foreground">{ngo.location}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {ngo.cause?.slice(0, 1).map((c: string) => (
                        <span key={c} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No NGOs added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Volunteer Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Volunteer Summary</CardTitle>
            <CardDescription>Live data from registered volunteers.</CardDescription>
          </CardHeader>
          <CardContent>
            {volunteers && volunteers.length > 0 ? (
              <div className="space-y-3">
                {volunteers.slice(0, 5).map(vol => (
                  <div key={vol.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <div>
                      <p className="text-sm font-semibold">{vol.name}</p>
                      <p className="text-xs text-muted-foreground">{vol.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{vol.loggedHours || 0}h</p>
                      <p className="text-xs text-muted-foreground">{vol.completedEventIds?.length || 0} events</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No volunteers registered yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
