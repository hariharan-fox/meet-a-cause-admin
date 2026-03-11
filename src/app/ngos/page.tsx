'use client';

import { useState, useMemo } from 'react';
import { allNgos } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Edit, ShieldCheck, XCircle, ArrowUpDown } from "lucide-react";
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

export default function NgoManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCause, setFilterCause] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const allCauses = useMemo(() => {
    const causes = new Set<string>();
    allNgos.forEach(ngo => ngo.cause.forEach(c => causes.add(c)));
    return Array.from(causes);
  }, []);

  const processedNgos = useMemo(() => {
    let filtered = allNgos.filter(ngo => {
      const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ngo.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCause = filterCause === 'all' || ngo.cause.includes(filterCause);
      return matchesSearch && matchesCause;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'location') return a.location.localeCompare(b.location);
      return 0;
    });
  }, [searchQuery, filterCause, sortBy]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">NGO Management</h1>
        <p className="text-sm text-muted-foreground">Monitor and moderate registered organizations within the platform.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterCause} onValueChange={setFilterCause}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Cause" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Causes</SelectItem>
              {allCauses.map(cause => (
                <SelectItem key={cause} value={cause}>{cause}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="location">Sort by Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Primary Causes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedNgos.map((ngo) => (
              <TableRow key={ngo.id}>
                <TableCell className="font-semibold">{ngo.name}</TableCell>
                <TableCell className="text-sm">{ngo.location}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {ngo.cause.slice(0, 2).map(c => (
                      <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                    ))}
                    {ngo.cause.length > 2 && <span className="text-[10px] text-muted-foreground">+{ngo.cause.length - 2}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" /> Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <ShieldCheck className="h-4 w-4" /> Verify NGO
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <XCircle className="h-4 w-4" /> Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {processedNgos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No organizations found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
