'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Calendar, Users, Clock, CheckCircle2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const chartConfig = {
  volunteers: {
    label: 'Volunteers',
    color: 'hsl(var(--primary))',
  },
};

export default function AdminDashboard() {
  const db = useFirestore();

  // All reading from correct collections
  const ngosQuery = useMemoFirebase(() => collection(db, 'ngo_profiles'), [db]);
  const { data: ngos, loading: ngosLoading } = useCollection(ngosQuery);

  const eventsQuery = useMemoFirebase(() => collection(db, 'events'), [db]);
  const { data: events, loading: eventsLoading } = useCollection(eventsQuery);

  // Read from 'users' — where volunteers actually register
  const volunteersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: volunteers, loading: volunteersLoading } = useCollection(volunteersQuery);

  const isLoading = ngosLoading || eventsLoading || volunteersLoading;

  // Calculate real total hours from all volunteer profiles
  const totalHours = useMemo(() => {
    return volunteers?.reduce((sum, v) => sum + (v.loggedHours || 0), 0) || 0;
  }, [volunteers]);

  // Build real monthly volunteer registration data from createdAt field
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts: Record<string, number> = {};
    months.forEach(m => counts[m] = 0);

    volunteers?.forEach(vol => {
      if (vol.createdAt) {
        try {
          const date = new Date(vol.createdAt);
          const month = months[date.getMonth()];
          if (month) counts[month] = (counts[month] || 0) + 1;
        } catch {}
      }
    });

    // Only show months that have data or up to current month
    const currentMonth = new Date().getMonth();
    return months.slice(0, currentMonth + 1).map(month => ({
      month,
      volunteers: counts[month] || 0,
    }));
  }, [volunteers]);

  const StatCard = ({ title, value, subtitle, icon: Icon, loading }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <span className="animate-pulse text-muted-foreground">...</span> : value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 animate-slide-in-from-bottom">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Live platform overview from Firestore.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-bold">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live Backend Active
        </div>
      </div>

      {/* Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Volunteers"
          value={volunteers?.length ?? 0}
          subtitle="Registered accounts"
          icon={Users}
          loading={volunteersLoading}
        />
        <StatCard
          title="Active NGOs"
          value={ngos?.length ?? 0}
          subtitle={ngos && ngos.length > 0 ? 'Synced with Firestore' : 'None added yet'}
          icon={Building}
          loading={ngosLoading}
        />
        <StatCard
          title="Live Events"
          value={events?.length ?? 0}
          subtitle="Across all causes"
          icon={Calendar}
          loading={eventsLoading}
        />
        <StatCard
          title="Platform Hours"
          value={totalHours}
          subtitle="Logged by volunteers"
          icon={Clock}
          loading={volunteersLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Real Volunteer Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold">Volunteer Registrations</CardTitle>
            <CardDescription>
              {volunteers?.length
                ? `${volunteers.length} volunteers registered — grouped by signup month.`
                : 'No volunteers registered yet.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {volunteersLoading ? (
                <div className="h-full bg-muted/30 rounded-lg animate-pulse" />
              ) : chartData.some(d => d.volunteers > 0) ? (
                <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="volunteers" fill="var(--color-volunteers)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No volunteer registrations yet. Chart will populate as users sign up.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Real NGO Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold">Recent NGO Activity</CardTitle>
            <CardDescription>Organizations on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {ngosLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : ngos && ngos.length > 0 ? (
              <div className="space-y-4">
                {ngos.slice(0, 4).map(ngo => (
                  <div key={ngo.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {ngo.logoUrl ? (
                        <img src={ngo.logoUrl} alt={ngo.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <Building className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{ngo.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{ngo.location}</p>
                    </div>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${ngo.verificationStatus === 'verified' ? 'text-green-500' : 'text-muted-foreground'}`} />
                  </div>
                ))}
                {ngos.length > 4 && (
                  <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                    <Link href="/ngos">View all {ngos.length} NGOs</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                <p>No NGOs added yet.</p>
                <Button variant="link" size="sm" asChild className="mt-2">
                  <Link href="/ngos">Add your first NGO</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Volunteers */}
      {volunteers && volunteers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Recently Registered Volunteers</CardTitle>
            <CardDescription>Latest signups on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...volunteers]
                .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                .slice(0, 6)
                .map(vol => (
                  <div key={vol.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {vol.name?.charAt(0).toUpperCase() || 'V'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{vol.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{vol.email}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
