'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Clock, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function VolunteerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const id = params.id as string;

  const [volunteer, setVolunteer] = useState<any>(null);
  const [completedEvents, setCompletedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const volDoc = await getDoc(doc(db, 'users', id));
        if (!volDoc.exists()) { router.push('/volunteers'); return; }
        const volData = { id: volDoc.id, ...volDoc.data() };
        setVolunteer(volData);

        if (volData.completedEventIds?.length) {
          const eventsSnap = await getDocs(collection(db, 'events'));
          const allEvents = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setCompletedEvents(allEvents.filter(e => volData.completedEventIds.includes(e.id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, db]);

  if (loading) return <div className="container mx-auto px-6 py-8"><div className="h-64 bg-muted animate-pulse rounded-xl" /></div>;
  if (!volunteer) return null;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <Link href="/volunteers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Volunteers
      </Link>

      {/* Header */}
      <div className="flex items-start gap-6 p-6 bg-card rounded-xl border">
        <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
          <AvatarFallback className="text-3xl font-bold">{volunteer.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{volunteer.name}</h1>
          <p className="text-muted-foreground">{volunteer.email}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="outline">{volunteer.role || 'Volunteer'}</Badge>
            {volunteer.phoneNumber && <Badge variant="secondary">{volunteer.phoneNumber}</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Joined {volunteer.createdAt ? new Date(volunteer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${volunteer.email}`}><Mail className="h-4 w-4 mr-2" /> Contact</a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-bold">{volunteer.loggedHours || 0}</p>
            <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Hours Logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-3xl font-bold">{volunteer.completedEventIds?.length || 0}</p>
            <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Events Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-3xl font-bold">{volunteer.registeredEventIds?.length || 0}</p>
            <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Events Registered</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills */}
        <Card>
          <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
          <CardContent>
            {volunteer.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            ) : <p className="text-sm text-muted-foreground">No skills added yet.</p>}
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader><CardTitle className="text-base">Interests</CardTitle></CardHeader>
          <CardContent>
            {volunteer.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {volunteer.interests.map((i: string) => <Badge key={i} variant="outline">{i}</Badge>)}
              </div>
            ) : <p className="text-sm text-muted-foreground">No interests added yet.</p>}
          </CardContent>
        </Card>
      </div>

      {/* Event History */}
      <Card>
        <CardHeader><CardTitle className="text-base">Event History</CardTitle></CardHeader>
        <CardContent>
          {completedEvents.length > 0 ? (
            <div className="space-y-3">
              {completedEvents.map(event => (
                <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border bg-muted/20">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{event.title}</p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{event.date}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{event.cause}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No completed events yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
