'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Trash2, CheckCircle, ArrowUpDown, Plus, Calendar as CalendarIcon, Image as ImageIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

const CAUSES = ['Education', 'Environment', 'Health', 'Community', 'Animals', 'Technology', 'Arts', 'Sports'];

export default function EventManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCause, setFilterCause] = useState('all');
  const [filterNgo, setFilterNgo] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    title: '', ngoId: '', cause: '', date: '', time: '',
    location: '', description: '', why: '', impact: '',
    skills: '', imageUrl: '',
  });

  const { toast } = useToast();
  const db = useFirestore();

  const eventsQuery = useMemoFirebase(() => collection(db, 'events'), [db]);
  const { data: events, loading: eventsLoading } = useCollection(eventsQuery);

  const ngosQuery = useMemoFirebase(() => collection(db, 'ngo_profiles'), [db]);
  const { data: ngos } = useCollection(ngosQuery);

  const processedEvents = useMemo(() => {
    if (!events) return [];
    return events
      .filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCause = filterCause === 'all' || event.cause === filterCause;
        const matchesNgo = filterNgo === 'all' || event.ngoId === filterNgo;
        return matchesSearch && matchesCause && matchesNgo;
      })
      .sort((a, b) => sortBy === 'title' ? a.title?.localeCompare(b.title) : new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchQuery, filterCause, filterNgo, sortBy]);

  const allCauses = useMemo(() => Array.from(new Set(events?.map(e => e.cause) || [])), [events]);

  const resetForm = () => setForm({ title: '', ngoId: '', cause: '', date: '', time: '', location: '', description: '', why: '', impact: '', skills: '', imageUrl: '' });

  // ✅ ACTUALLY saves to Firestore
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'events'), {
        title: form.title,
        ngoId: form.ngoId,
        cause: form.cause,
        date: form.date,
        time: form.time,
        location: form.location,
        description: form.description,
        why: form.why,
        impact: form.impact,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        imageUrl: form.imageUrl || 'https://placehold.co/1200x630?text=Meet+A+Cause',
        createdAt: new Date().toISOString(),
      });
      toast({ title: "✅ Event Created!", description: `${form.title} is now live on the platform.` });
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error saving event", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ ACTUALLY deletes from Firestore
  const handleDelete = async (event: any) => {
    try {
      await deleteDoc(doc(db, 'events', event.id));
      toast({ variant: "destructive", title: "Event Deleted", description: `"${event.title}" has been removed.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Management</h1>
          <p className="text-sm text-muted-foreground">
            {events ? `${events.length} events in Firestore` : 'Loading...'}
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <form onSubmit={handleCreateEvent}>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>This will be saved to Firestore and appear on the platform immediately.</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4 py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Event Title *</Label>
                    <Input placeholder="e.g. Annual Beach Cleanup Drive" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Banner Image URL</Label>
                    <Input placeholder="https://images.unsplash.com/..." value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                    <p className="text-[11px] text-muted-foreground">Paste an image URL from Unsplash or any website. Leave blank for a default placeholder.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Organizing NGO *</Label>
                      <Select required value={form.ngoId} onValueChange={v => setForm(f => ({ ...f, ngoId: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select NGO" /></SelectTrigger>
                        <SelectContent>
                          {ngos?.map(ngo => <SelectItem key={ngo.id} value={ngo.id}>{ngo.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Primary Cause *</Label>
                      <Select required value={form.cause} onValueChange={v => setForm(f => ({ ...f, cause: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select Cause" /></SelectTrigger>
                        <SelectContent>
                          {CAUSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Date *</Label>
                      <Input placeholder="e.g. December 15, 2026" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Time *</Label>
                      <Input placeholder="e.g. 8:00 AM - 12:00 PM" required value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Location *</Label>
                    <Input placeholder="e.g. Marina Beach, Chennai" required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Description *</Label>
                    <Textarea placeholder="Describe the event activities..." required className="min-h-[80px]" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Why It Matters</Label>
                    <Textarea placeholder="Why is this event important?" className="min-h-[60px]" value={form.why} onChange={e => setForm(f => ({ ...f, why: e.target.value }))} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Volunteer Impact</Label>
                    <Textarea placeholder="What will volunteers achieve?" className="min-h-[60px]" value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Required Skills (comma separated)</Label>
                    <Input placeholder="e.g. Teamwork, Communication" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Publishing...' : 'Publish Event'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={filterCause} onValueChange={setFilterCause}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Cause" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Causes</SelectItem>
            {allCauses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterNgo} onValueChange={setFilterNgo}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Organization" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All NGOs</SelectItem>
            {ngos?.map(ngo => <SelectItem key={ngo.id} value={ngo.id}>{ngo.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]">
            <div className="flex items-center gap-2"><ArrowUpDown className="h-3 w-3" /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="title">Sort by Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Event Title</TableHead>
              <TableHead className="font-bold">Organizing NGO</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Cause</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventsLoading ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center animate-pulse">Loading from Firestore...</TableCell></TableRow>
            ) : processedEvents.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No events yet. Click "Create Event" to add one!</TableCell></TableRow>
            ) : processedEvents.map(event => {
              const ngo = ngos?.find(n => n.id === event.ngoId);
              return (
                <TableRow key={event.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-semibold max-w-[200px] truncate">{event.title}</TableCell>
                  <TableCell className="text-sm">{ngo?.name || 'Unknown NGO'}</TableCell>
                  <TableCell className="text-sm">{event.date}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{event.cause}</Badge></TableCell>
                  <TableCell className="text-sm max-w-[150px] truncate">{event.location}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => handleDelete(event)}>
                          <Trash2 className="h-4 w-4" /> Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
