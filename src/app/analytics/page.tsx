'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Building, Calendar, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

const CAUSE_COLORS = [
  'hsl(var(--primary))',
  'hsl(260, 40%, 70%)',
  'hsl(200, 60%, 60%)',
  'hsl(150, 50%, 55%)',
  'hsl(30, 70%, 60%)',
  'hsl(0, 60%, 65%)',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const chartConfig = {
  volunteers: { label: 'Volunteers', color: 'hsl(var(--primary))' },
  hours: { label: 'Hours', color: 'hsl(var(--primary))' },
};

type DateRange = 'all' | 'this_year' | 'last_6_months' | 'last_3_months' | 'this_month';

export default function AnalyticsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [dateRange, setDateRange] = useState<DateRange>('all');

  const volunteersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: volunteers, loading: volLoading } = useCollection(volunteersQuery);

  const ngosQuery = useMemoFirebase(() => collection(db, 'ngo_profiles'), [db]);
  const { data: ngos } = useCollection(ngosQuery);

  const eventsQuery = useMemoFirebase(() => collection(db, 'events'), [db]);
  const { data: events } = useCollection(eventsQuery);

  // Date range filter logic
  const getDateCutoff = (range: DateRange): Date | null => {
    const now = new Date();
    switch (range) {
      case 'this_month': return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'last_3_months': return new Date(now.setMonth(now.getMonth() - 3));
      case 'last_6_months': return new Date(now.setMonth(now.getMonth() - 6));
      case 'this_year': return new Date(new Date().getFullYear(), 0, 1);
      default: return null;
    }
  };

  const filteredVolunteers = useMemo(() => {
    if (!volunteers) return [];
    const cutoff = getDateCutoff(dateRange);
    if (!cutoff) return volunteers;
    return volunteers.filter(v => {
      try { return new Date(v.createdAt) >= cutoff; } catch { return true; }
    });
  }, [volunteers, dateRange]);

  // KPI calculations
  const totalHours = useMemo(() =>
    filteredVolunteers.reduce((sum, v) => sum + (v.loggedHours || 0), 0),
    [filteredVolunteers]
  );

  const totalCompletedEvents = useMemo(() =>
    filteredVolunteers.reduce((sum, v) => sum + (v.completedEventIds?.length || 0), 0),
    [filteredVolunteers]
  );

  const avgHoursPerVolunteer = filteredVolunteers.length > 0
    ? (totalHours / filteredVolunteers.length).toFixed(1)
    : '0';

  // Monthly registration chart — real data
  const monthlyRegistrations = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const counts: Record<string, number> = {};
    MONTHS.forEach(m => counts[m] = 0);

    (volunteers || []).forEach(vol => {
      if (!vol.createdAt) return;
      try {
        const date = new Date(vol.createdAt);
        if (date.getFullYear() === currentYear) {
          const month = MONTHS[date.getMonth()];
          counts[month] = (counts[month] || 0) + 1;
        }
      } catch {}
    });

    const currentMonth = new Date().getMonth();
    return MONTHS.slice(0, currentMonth + 1).map(month => ({
      month,
      volunteers: counts[month] || 0,
    }));
  }, [volunteers]);

  // Cause breakdown — real data from events
  const causeBreakdown = useMemo(() => {
    if (!events?.length) return [];
    const counts: Record<string, number> = {};
    events.forEach(e => {
      if (e.cause) counts[e.cause] = (counts[e.cause] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: CAUSE_COLORS[i % CAUSE_COLORS.length] }));
  }, [events]);

  // Top volunteers by hours
  const topVolunteers = useMemo(() => {
    return [...(filteredVolunteers || [])]
      .sort((a, b) => (b.loggedHours || 0) - (a.loggedHours || 0))
      .slice(0, 5);
  }, [filteredVolunteers]);

  const isLoading = volLoading;

  const dateRangeLabel: Record<DateRange, string> = {
    all: 'All Time',
    this_year: 'This Year',
    last_6_months: 'Last 6 Months',
    last_3_months: 'Last 3 Months',
    this_month: 'This Month',
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground text-sm">Real data from Firestore — updated live.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={v => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => toast({ title: 'Export coming soon' })}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {dateRange !== 'all' && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Filtered: {dateRangeLabel[dateRange]}</Badge>
          <span className="text-xs text-muted-foreground">
            Showing {filteredVolunteers.length} of {volunteers?.length || 0} volunteers
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Volunteers', value: filteredVolunteers.length, sub: `${volunteers?.length || 0} total`, icon: Users },
          { label: 'NGOs', value: ngos?.length || 0, sub: 'On platform', icon: Building },
          { label: 'Events', value: events?.length || 0, sub: 'Created', icon: Calendar },
          { label: 'Hours Logged', value: totalHours, sub: `Avg ${avgHoursPerVolunteer}h/volunteer`, icon: Clock },
        ].map(({ label, value, sub, icon: Icon }) => (
          <Card key={label} className="border-l-4 border-l-primary/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-primary/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <span className="animate-pulse text-muted-foreground">...</span> : value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Volunteer Registrations — Real */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Monthly Registrations ({new Date().getFullYear()})</CardTitle>
            <CardDescription>Volunteer signups by month — live from Firestore.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {monthlyRegistrations.some(d => d.volunteers > 0) ? (
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={monthlyRegistrations} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="volunteers" fill="var(--color-volunteers)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No registrations yet this year.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events by Cause — Real */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Events by Cause</CardTitle>
            <CardDescription>Distribution across causes — live from Firestore.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {causeBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={causeBreakdown}
                    cx="50%" cy="45%"
                    innerRadius={55} outerRadius={80}
                    paddingAngle={3} dataKey="value"
                  >
                    {causeBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(value, name) => [value, name]} />
                  <Legend verticalAlign="bottom" align="center" layout="horizontal" iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No events added yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Volunteers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Top Volunteers by Hours</CardTitle>
            <CardDescription>Most active volunteers in the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            {topVolunteers.length > 0 ? (
              <div className="space-y-3">
                {topVolunteers.map((vol, i) => (
                  <div key={vol.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                      {vol.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{vol.name}</p>
                      <p className="text-xs text-muted-foreground">{vol.completedEventIds?.length || 0} events</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">{vol.loggedHours || 0}h</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No volunteers yet.</p>
            )}
          </CardContent>
        </Card>

        {/* NGO Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">NGO Overview</CardTitle>
            <CardDescription>Verification status of registered organizations.</CardDescription>
          </CardHeader>
          <CardContent>
            {ngos && ngos.length > 0 ? (
              <div className="space-y-3">
                {/* Status summary */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Verified', status: 'verified', color: 'text-green-700 bg-green-50 border-green-200' },
                    { label: 'Pending', status: 'pending', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                    { label: 'Suspended', status: 'rejected', color: 'text-red-700 bg-red-50 border-red-200' },
                  ].map(({ label, status, color }) => (
                    <div key={status} className={`p-3 rounded-lg border text-center ${color}`}>
                      <p className="text-lg font-bold">{ngos.filter(n => n.verificationStatus === status).length}</p>
                      <p className="text-[10px] font-bold uppercase">{label}</p>
                    </div>
                  ))}
                </div>
                {ngos.slice(0, 4).map(ngo => (
                  <div key={ngo.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                      {ngo.logoUrl ? <img src={ngo.logoUrl} alt={ngo.name} className="h-full w-full object-cover" /> : ngo.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{ngo.name}</p>
                      <p className="text-xs text-muted-foreground">{ngo.location}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${ngo.verificationStatus === 'verified' ? 'border-green-200 text-green-700' : 'border-amber-200 text-amber-700'}`}>
                      {ngo.verificationStatus || 'pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No NGOs added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
