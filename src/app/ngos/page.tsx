'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Edit, ShieldCheck, XCircle, ArrowUpDown, Plus, Building, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function NgoManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCause, setFilterCause] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '', location: '', causes: '', mission: '',
    email: '', phone: '', address: '', impact: '',
    darpanId: '', panNumber: '',
  });

  const { toast } = useToast();
  const db = useFirestore();

  const ngosQuery = useMemoFirebase(() => collection(db, 'ngo_profiles'), [db]);
  const { data: ngos, loading } = useCollection(ngosQuery);

  const allCauses = useMemo(() => {
    const causes = new Set<string>();
    ngos?.forEach(ngo => ngo.cause?.forEach((c: string) => causes.add(c)));
    return Array.from(causes);
  }, [ngos]);

  const processedNgos = useMemo(() => {
    if (!ngos) return [];
    return ngos
      .filter(ngo => {
        const matchesSearch = ngo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ngo.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCause = filterCause === 'all' || ngo.cause?.includes(filterCause);
        return matchesSearch && matchesCause;
      })
      .sort((a, b) => sortBy === 'name' ? a.name?.localeCompare(b.name) : a.location?.localeCompare(b.location));
  }, [ngos, searchQuery, filterCause, sortBy]);

  const resetForm = () => setForm({ name: '', location: '', causes: '', mission: '', email: '', phone: '', address: '', impact: '', darpanId: '', panNumber: '' });

  // ✅ ACTUALLY saves to Firestore
  const handleAddNgo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'ngo_profiles'), {
        name: form.name,
        location: form.location,
        cause: form.causes.split(',').map(c => c.trim()).filter(Boolean),
        mission: form.mission,
        email: form.email,
        phone: form.phone,
        address: form.address,
        impact: form.impact,
        logoUrl: '',
        verificationStatus: 'pending',
        darpanId: form.darpanId,
        panNumber: form.panNumber,
        createdAt: new Date().toISOString(),
      });
      toast({ title: "✅ NGO Added!", description: `${form.name} has been saved to Firestore and will appear on the platform.` });
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ ACTUALLY updates in Firestore
  const handleUpdateNgo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNgo) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'ngo_profiles', selectedNgo.id), {
        name: form.name || selectedNgo.name,
        location: form.location || selectedNgo.location,
        cause: form.causes ? form.causes.split(',').map(c => c.trim()) : selectedNgo.cause,
        mission: form.mission || selectedNgo.mission,
        email: form.email || selectedNgo.email,
        phone: form.phone || selectedNgo.phone,
      });
      toast({ title: "✅ NGO Updated!", description: `${selectedNgo.name} has been updated.` });
      setIsEditDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ ACTUALLY verifies in Firestore
  const handleVerify = async (ngo: any) => {
    try {
      await updateDoc(doc(db, 'ngo_profiles', ngo.id), { verificationStatus: 'verified' });
      toast({ title: "✅ NGO Verified!", description: `${ngo.name} is now verified on the platform.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // ✅ ACTUALLY deletes from Firestore
  const handleSuspend = async (ngo: any) => {
    try {
      await updateDoc(doc(db, 'ngo_profiles', ngo.id), { verificationStatus: 'rejected' });
      toast({ variant: "destructive", title: "NGO Suspended", description: `${ngo.name} has been suspended.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'verified': return <Badge className="bg-green-100 text-green-700 border-none gap-1"><CheckCircle2 className="h-3 w-3" /> Verified</Badge>;
      case 'pending': return <Badge className="bg-amber-100 text-amber-700 border-none gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 border-none gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default: return <Badge variant="outline" className="gap-1"><AlertCircle className="h-3 w-3" /> Unverified</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">NGO Management</h1>
          <p className="text-sm text-muted-foreground">
            {ngos ? `${ngos.length} organizations in Firestore` : 'Loading...'}
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add New NGO</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <form onSubmit={handleAddNgo}>
              <DialogHeader>
                <DialogTitle>Register New NGO</DialogTitle>
                <DialogDescription>This will be saved to Firestore and appear on the platform immediately.</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4 py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Organization Name *</Label>
                    <Input placeholder="e.g. Hope Foundation Chennai" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Location *</Label>
                    <Input placeholder="e.g. Chennai, Tamil Nadu" required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Primary Causes * (comma separated)</Label>
                    <Input placeholder="e.g. Education, Health, Environment" required value={form.causes} onChange={e => setForm(f => ({ ...f, causes: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Mission Statement *</Label>
                    <Textarea placeholder="What is this NGO's primary mission?" required value={form.mission} onChange={e => setForm(f => ({ ...f, mission: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Impact</Label>
                    <Textarea placeholder="What impact has this NGO made?" value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="contact@ngo.org" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Phone</Label>
                      <Input placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Address</Label>
                    <Input placeholder="Full address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>NGO Darpan ID</Label>
                      <Input placeholder="PY/2023/..." value={form.darpanId} onChange={e => setForm(f => ({ ...f, darpanId: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>PAN Number</Label>
                      <Input placeholder="ABCDE1234F" value={form.panNumber} onChange={e => setForm(f => ({ ...f, panNumber: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving to Firestore...' : 'Save to Platform'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or location..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={filterCause} onValueChange={setFilterCause}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Cause" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Causes</SelectItem>
            {allCauses.map(cause => <SelectItem key={cause} value={cause}>{cause}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-2"><ArrowUpDown className="h-3 w-3" /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="location">Sort by Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Organization Name</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Primary Causes</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center animate-pulse">Loading from Firestore...</TableCell></TableRow>
            ) : processedNgos.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No NGOs yet. Click "Add New NGO" to get started!</TableCell></TableRow>
            ) : processedNgos.map(ngo => (
              <TableRow key={ngo.id} className="hover:bg-accent/30 transition-colors">
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-2"><Building className="h-4 w-4 text-primary" />{ngo.name}</div>
                </TableCell>
                <TableCell className="text-sm">{ngo.location}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {ngo.cause?.slice(0, 2).map((c: string) => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}
                    {ngo.cause?.length > 2 && <span className="text-[10px] text-muted-foreground">+{ngo.cause.length - 2}</span>}
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={ngo.verificationStatus} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleVerify(ngo)}>
                        <ShieldCheck className="h-4 w-4" /> Verify NGO
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedNgo(ngo); setForm({ name: ngo.name, location: ngo.location, causes: ngo.cause?.join(', '), mission: ngo.mission, email: ngo.email, phone: ngo.phone, address: ngo.address, impact: ngo.impact, darpanId: ngo.darpanId, panNumber: ngo.panNumber }); setIsEditDialogOpen(true); }}>
                        <Edit className="h-4 w-4" /> Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => handleSuspend(ngo)}>
                        <XCircle className="h-4 w-4" /> Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdateNgo}>
            <DialogHeader>
              <DialogTitle>Edit NGO: {selectedNgo?.name}</DialogTitle>
              <DialogDescription>Changes will be saved to Firestore immediately.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Causes (comma separated)</Label><Input value={form.causes} onChange={e => setForm(f => ({ ...f, causes: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Mission</Label><Textarea value={form.mission} onChange={e => setForm(f => ({ ...f, mission: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="grid gap-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
