'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, MapPin, Clock, Edit, Save, X, Trash2, Building } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const id = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [ngo, setNgo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const eventDoc = await getDoc(doc(db, 'events', id));
        if (!eventDoc.exists()) { router.push('/events'); return; }
        const eventData = { id: eventDoc.id, ...eventDoc.data() };
        setEvent(eventData);
        setEditForm({ ...eventData, skills: eventData.skills?.join(', ') || '' });

        if (eventData.ngoId) {
          const ngoDoc = await getDoc(doc(db, 'ngo_profiles', eventData.ngoId));
          if (ngoDoc.exists()) setNgo({ id: ngoDoc.id, ...ngoDoc.data() });
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [id, db]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        title: editForm.title,
        date: editForm.date,
        time: editForm.time,
        location: editForm.location,
        description: editForm.description,
        why: editForm.why,
        impact: editForm.impact,
        imageUrl: editForm.imageUrl,
        skills: editForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      };
      await updateDoc(doc(db, 'events', id), updateData);
      setEvent({ ...event, ...updateData });
      setIsEditing(false);
      toast({ title: 'Event Updated', description: 'Changes saved successfully.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'events', id));
      toast({ title: 'Event Deleted', variant: 'destructive' });
      router.push('/events');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="container mx-auto px-6 py-8"><div className="h-64 bg-muted animate-pulse rounded-xl" /></div>;
  if (!event) return null;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                <AlertDialogDescription>This cannot be undone. The event will be permanently removed.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setEditForm({ ...event, skills: event.skills?.join(', ') || '' }); }}><X className="h-4 w-4 mr-1" />Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 mr-1" />{isSaving ? 'Saving...' : 'Save'}</Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-1" />Edit</Button>
          )}
        </div>
      </div>

      {/* Banner */}
      {(event.imageUrl || isEditing) && (
        <div className="space-y-2">
          {event.imageUrl && !isEditing && (
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}
          {isEditing && (
            <div className="space-y-1">
              <Label className="text-xs">Banner Image URL</Label>
              <Input value={editForm.imageUrl} onChange={e => setEditForm((f: any) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{event.cause}</Badge>
        </div>
        {isEditing ? (
          <Input value={editForm.title} onChange={e => setEditForm((f: any) => ({ ...f, title: e.target.value }))} className="text-xl font-bold" />
        ) : (
          <h1 className="text-2xl font-bold">{event.title}</h1>
        )}
        <div className="flex gap-6 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{event.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{event.time}</span>
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{event.location}</span>
        </div>
      </div>

      {/* Organizing NGO */}
      {ngo && (
        <Card>
          <CardHeader><CardTitle className="text-base">Organizing NGO</CardTitle></CardHeader>
          <CardContent>
            <Link href={`/ngos/${ngo.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {ngo.logoUrl ? <img src={ngo.logoUrl} alt={ngo.name} className="h-10 w-10 rounded-full object-cover" /> : <Building className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <p className="font-semibold text-sm">{ngo.name}</p>
                <p className="text-xs text-muted-foreground">{ngo.location}</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Event Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent>
            {isEditing ? <Textarea value={editForm.description} onChange={e => setEditForm((f: any) => ({ ...f, description: e.target.value }))} className="min-h-[100px]" /> : <p className="text-sm text-muted-foreground">{event.description}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Why It Matters</CardTitle></CardHeader>
          <CardContent>
            {isEditing ? <Textarea value={editForm.why} onChange={e => setEditForm((f: any) => ({ ...f, why: e.target.value }))} className="min-h-[100px]" /> : <p className="text-sm text-muted-foreground">{event.why || '—'}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Volunteer Impact</CardTitle></CardHeader>
          <CardContent>
            {isEditing ? <Textarea value={editForm.impact} onChange={e => setEditForm((f: any) => ({ ...f, impact: e.target.value }))} className="min-h-[80px]" /> : <p className="text-sm text-muted-foreground">{event.impact || '—'}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Skills Needed</CardTitle></CardHeader>
          <CardContent>
            {isEditing ? (
              <Input value={editForm.skills} onChange={e => setEditForm((f: any) => ({ ...f, skills: e.target.value }))} placeholder="e.g. Teamwork, Communication" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {event.skills?.length > 0 ? event.skills.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>) : <p className="text-sm text-muted-foreground">No skills specified.</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <Card>
          <CardHeader><CardTitle className="text-base">Date & Time</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Date</Label>
              <Input value={editForm.date} onChange={e => setEditForm((f: any) => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Time</Label>
              <Input value={editForm.time} onChange={e => setEditForm((f: any) => ({ ...f, time: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">Location</Label>
              <Input value={editForm.location} onChange={e => setEditForm((f: any) => ({ ...f, location: e.target.value }))} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
