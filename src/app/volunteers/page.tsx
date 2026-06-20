'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, Mail, ArrowUpDown, Filter, ExternalLink, Ban, ShieldCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';

export default function VolunteerManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInterest, setFilterInterest] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { toast } = useToast();
  const router = useRouter();
  const db = useFirestore();

  const volunteersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: volunteers, loading } = useCollection(volunteersQuery);

  const allInterests = useMemo(() => {
    const interests = new Set<string>();
    volunteers?.forEach(vol => vol.interests?.forEach((i: string) => interests.add(i)));
    return Array.from(interests);
  }, [volunteers]);

  const processedVolunteers = useMemo(() => {
    if (!volunteers) return [];
    return volunteers
      .filter(vol => {
        const matchesSearch = vol.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vol.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesInterest = filterInterest === 'all' || vol.interests?.includes(filterInterest);
        const matchesStatus = filterStatus === 'all' ||
          (filterStatus === 'banned' && vol.status === 'banned') ||
          (filterStatus === 'active' && vol.status !== 'banned');
        return matchesSearch && matchesInterest && matchesStatus;
      })
      .sort((a, b) => sortBy === 'name' ? a.name?.localeCompare(b.name) : a.email?.localeCompare(b.email));
  }, [volunteers, searchQuery, filterInterest, filterStatus, sortBy]);

  const handleContact = (name: string, email: string) => {
    window.location.href = `mailto:${email}?subject=Meet A Cause - Message for ${name}`;
  };

  const handleBan = async (vol: any) => {
    try {
      await updateDoc(doc(db, 'users', vol.id), { status: 'banned' });
      toast({ title: 'Volunteer Suspended', description: `${vol.name} has been suspended.`, variant: 'destructive' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUnban = async (vol: any) => {
    try {
      await updateDoc(doc(db, 'users', vol.id), { status: 'active' });
      toast({ title: 'Volunteer Reinstated', description: `${vol.name} can now log in again.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const bannedCount = volunteers?.filter(v => v.status === 'banned').length || 0;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Volunteer Registry</h1>
          <p className="text-sm text-muted-foreground">
            {volunteers ? `${volunteers.length} volunteers registered` : 'Loading...'}
            {bannedCount > 0 && <span className="text-destructive ml-2">· {bannedCount} suspended</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterInterest} onValueChange={setFilterInterest}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2"><Filter className="h-3 w-3" /><SelectValue placeholder="Filter Interest" /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Interests</SelectItem>
            {allInterests.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-2"><ArrowUpDown className="h-3 w-3" /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="email">Sort by Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Volunteer</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Skills</TableHead>
              <TableHead className="font-bold">Interests</TableHead>
              <TableHead className="font-bold">Hours</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="h-24 text-center animate-pulse">Loading volunteers...</TableCell></TableRow>
            ) : processedVolunteers.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No volunteers found.</TableCell></TableRow>
            ) : processedVolunteers.map(vol => {
              const banned = vol.status === 'banned';
              return (
                <TableRow
                  key={vol.id}
                  className={`hover:bg-accent/30 transition-colors cursor-pointer ${banned ? 'opacity-60' : ''}`}
                  onClick={() => router.push(`/volunteers/${vol.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="text-xs font-bold">{vol.name?.charAt(0) || 'V'}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm">{vol.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vol.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {vol.skills?.slice(0, 2).map((s: string) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                      {vol.skills?.length > 2 && <span className="text-[10px] text-muted-foreground">+{vol.skills.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {vol.interests?.slice(0, 2).map((i: string) => <Badge key={i} variant="outline" className="text-[10px]">{i}</Badge>)}
                      {vol.interests?.length > 2 && <span className="text-[10px] text-muted-foreground">+{vol.interests.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold">{vol.loggedHours || 0}h</TableCell>
                  <TableCell>
                    {banned ? (
                      <Badge variant="destructive" className="text-[10px] gap-1"><Ban className="h-3 w-3" />Suspended</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-green-700 border-green-200">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push(`/volunteers/${vol.id}`)}>
                          <ExternalLink className="h-4 w-4" /> View Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleContact(vol.name, vol.email)}>
                          <Mail className="h-4 w-4" /> Contact Volunteer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {banned ? (
                          <DropdownMenuItem className="gap-2 cursor-pointer text-green-700" onClick={() => handleUnban(vol)}>
                            <ShieldCheck className="h-4 w-4" /> Reinstate Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => handleBan(vol)}>
                            <Ban className="h-4 w-4" /> Suspend Account
                          </DropdownMenuItem>
                        )}
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
