
'use client';

import { useState, useMemo } from 'react';
import { allEvents, allNgos } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Trash2, 
  CheckCircle, 
  ArrowUpDown, 
  Plus
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

export default function EventManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCause, setFilterCause] = useState('all');
  const [filterNgo, setFilterNgo] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const { toast } = useToast();
  const router = useRouter();

  const allCauses = useMemo(() => {
    return Array.from(new Set(allEvents.map(e => e.cause)));
  }, []);

  const processedEvents = useMemo(() => {
    let filtered = allEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCause = filterCause === 'all' || event.cause === filterCause;
      const matchesNgo = filterNgo === 'all' || event.ngoId === filterNgo;
      return matchesSearch && matchesCause && matchesNgo;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0;
    });
  }, [searchQuery, filterCause, filterNgo, sortBy]);

  const handleDelete = (title: string) => {
    toast({
      variant: "destructive",
      title: "Event Deleted",
      description: `"${title}" has been removed from the platform.`,
    });
  };

  const handleApprove = (title: string) => {
    toast({
      title: "Changes Approved",
      description: `Updates for "${title}" are now live.`,
    });
  };

  const handleViewDetails = (id: string) => {
    router.push(`/events/${id}/admin-detail`);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Moderation</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage volunteering opportunities across the platform.</p>
        </div>
        <Button className="gap-2 shadow-primary/20 shadow-lg">
          <Plus className="h-4 w-4" /> Create Platform Event
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterCause} onValueChange={setFilterCause}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Cause" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Causes</SelectItem>
              {allCauses.map(cause => (
                <SelectItem key={cause} value={cause}>{cause}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterNgo} onValueChange={setFilterNgo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {allNgos.map(ngo => (
                <SelectItem key={ngo.id} value={ngo.id}>{ngo.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3" />
                <SelectValue placeholder="Sort" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Soonest)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Event Title</TableHead>
              <TableHead className="font-bold">Organizing NGO</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Cause</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedEvents.map((event) => {
              const ngo = allNgos.find(n => n.id === event.ngoId);
              return (
                <TableRow key={event.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-semibold max-w-[200px] truncate">{event.title}</TableCell>
                  <TableCell className="text-sm font-medium">{ngo?.name || 'Unknown'}</TableCell>
                  <TableCell className="text-sm">{event.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] bg-secondary/50">{event.cause}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleViewDetails(event.id)}>
                          <Eye className="h-4 w-4" /> View Admin Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleApprove(event.title)}>
                          <CheckCircle className="h-4 w-4" /> Approve Edits
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => handleDelete(event.title)}>
                          <Trash2 className="h-4 w-4" /> Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
            {processedEvents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No events found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
