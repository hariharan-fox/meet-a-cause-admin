'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building, Mail, Phone, MapPin, Shield, ShieldCheck, XCircle, Calendar, Edit, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function NgoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const id = params.id as string;

  const [ngo, setNgo] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const ngoDoc = await getDoc(doc(db, 'ngo_profiles', id));
        if (!ngoDoc.exists()) { router.push('/ngos'); return; }
        const ngoData = { id: ngoDoc.id, ...ngoDoc.data() };
        setNgo(ngoData);
        setEditForm(ngoData);

        const eventsSnap = await getDocs(query(collection(db, 'events'), where('ngoId', '==', id)));
        setEvents(eventsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [id, db]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'ngo_profiles', id), {
        name: editForm.name,
        location: editForm.location,
        mission: editForm.mission,
        impact: editForm.impact,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        logoUrl: editForm.logoUrl,
        cause: typeof editForm.cause === 'string' ? editForm.cause.split(',').map((c: string) => c.trim()) : editForm.cause,
      });
      setNgo({ ...ngo, ...editForm });
      setIsEditing(false);
      toast({ title: 'NGO Updated', description: 'Changes saved successfully.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setIsSaving(false); }
  };

  const handleVerify = async (status: string) => {
    try {
      await updateDoc(doc(db, 'ngo_profiles', id), { verificationStatus: status });
      setNgo({ ...ngo, verificationStatus: status });
      toast({ title: status === 'verified' ? 'NGO Verified' : 'NGO Suspended' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="container mx-auto px-6 py-8"><div className="h-64 bg-muted animate-pulse rounded-xl" /></div>;
  if (!ngo) return null;

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'verified': return <Badge className="bg-green-100 text-green-700 border-none"><ShieldCheck className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 border-none"><XCircle className="h-3 w-3 mr-1" />Suspended</Badge>;
      default: return <Badge className="bg-amber-100 text-amber-700 border-none"><Shield className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/ngos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to NGOs
        </Link>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setEditForm(ngo); }}><X className="h-4 w-4 mr-1" />Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 mr-1" />{isSaving ? 'Saving...' : 'Save'}</Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-1" />Edit</Button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start gap-6 p-6 bg-card rounded-xl border">
        <div className="h-20 w-20 rounded-xl border bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {ngo.logoUrl ? <img src={ngo.logoUrl} alt={ngo.name} className="h-full w-full object-cover" /> : <Building className="h-8 w-8 text-muted-foreground" />}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <Input value={editForm.name} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} className="text-xl font-bold mb-2" />
          ) : (
            <h1 className="text-2xl font-bold">{ngo.name}</h1>
          )}
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {isEditing ? (
              <Input value={editForm.location} onChange={e => setEditForm((f: any) => ({ ...f, location: e.target.value }))} className="h-7 text-sm" />
            ) : (
              <span className="text-muted-foreground text-sm">{ngo.location}</span>
            )}
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <StatusBadge status={ngo.verificationStatus} />
            {ngo.cause?.map((c: string) => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          {ngo.verificationStatus !== 'verified' && (
            <Button size="sm" variant="outline" className="text-green-700 border-green-200" onClick={() => handleVerify('verified')}>
              <ShieldCheck className="h-4 w-4 mr-1" /> Verify
            </Button>
          )}
          {ngo.verificationStatus !== 'rejected' && (
            <Button size="sm" variant="outline" className="text-red-700 border-red-200" onClick={() => handleVerify('rejected')}>
              <XCircle className="h-4 w-4 mr-1" /> Suspend
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Mission</CardTitle></CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea value={editForm.mission} onChange={e => setEditForm((f: any) => ({ ...f, mission: e.target.value }))} className="min-h-[100px]" />
            ) : (
              <p className="text-sm text-muted-foreground">{ngo.mission || 'Not provided.'}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Impact</CardTitle></CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea value={editForm.impact} onChange={e => setEditForm((f: any) => ({ ...f, impact: e.target.value }))} className="min-h-[100px]" />
            ) : (
              <p className="text-sm text-muted-foreground">{ngo.impact || 'Not provided.'}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact */}
      <Card>
        <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Email</Label>
            {isEditing ? <Input value={editForm.email} onChange={e => setEditForm((f: any) => ({ ...f, email: e.target.value }))} /> : <p className="text-sm">{ngo.email || '—'}</p>}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Phone</Label>
            {isEditing ? <Input value={editForm.phone} onChange={e => setEditForm((f: any) => ({ ...f, phone: e.target.value }))} /> : <p className="text-sm">{ngo.phone || '—'}</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Address</Label>
            {isEditing ? <Input value={editForm.address} onChange={e => setEditForm((f: any) => ({ ...f, address: e.target.value }))} /> : <p className="text-sm">{ngo.address || '—'}</p>}
          </div>
          {isEditing && (
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Logo URL</Label>
              <Input value={editForm.logoUrl} onChange={e => setEditForm((f: any) => ({ ...f, logoUrl: e.target.value }))} placeholder="https://..." />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader><CardTitle className="text-base">Events ({events.length})</CardTitle></CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                  <Calendar className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date} — {event.location}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{event.cause}</Badge>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-6">No events created yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
