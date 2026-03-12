'use client';

import { useState, useMemo } from 'react';
import { volunteer } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreVertical, 
  Mail, 
  Ban, 
  UserCheck, 
  ArrowUpDown, 
  Filter 
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Mocking multiple volunteers for the admin list
const mockVolunteers = [
  volunteer,
  { id: 'vol-2', name: 'Ananya Rao', email: 'ananya.rao@example.com', avatarUrl: 'avatar-ananya-rao', skills: ['Teaching'], interests: ['Education'] },
  { id: 'vol-3', name: 'Rohan Mehta', email: 'rohan.mehta@example.com', avatarUrl: 'avatar-rohan-mehta', skills: ['Logistics'], interests: ['Health'] },
  { id: 'vol-4', name: 'Siddharth Nair', email: 'sid.nair@example.com', avatarUrl: 'avatar-rohan-mehta', skills: ['Marketing'], interests: ['Environment'] },
  { id: 'vol-5', name: 'Neha Gupta', email: 'neha.g@example.com', avatarUrl: 'avatar-ananya-rao', skills: ['Coordination'], interests: ['Community Building'] },
];

export default function VolunteerManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInterest, setFilterInterest] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const allInterests = useMemo(() => {
    const interests = new Set<string>();
    mockVolunteers.forEach(vol => vol.interests.forEach(i => interests.add(i)));
    return Array.from(interests);
  }, []);

  const processedVolunteers = useMemo(() => {
    let filtered = mockVolunteers.filter(vol => {
      const matchesSearch = vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vol.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInterest = filterInterest === 'all' || vol.interests.includes(filterInterest);
      return matchesSearch && matchesInterest;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'email') return a.email.localeCompare(b.email);
      return 0;
    });
  }, [searchQuery, filterInterest, sortBy]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Volunteer Registry</h1>
        <p className="text-sm text-muted-foreground">Monitor user activity and manage volunteer profiles across the platform.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterInterest} onValueChange={setFilterInterest}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3 w-3" />
                <SelectValue placeholder="Filter Interest" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Interests</SelectItem>
              {allInterests.map(interest => (
                <SelectItem key={interest} value={interest}>{interest}</SelectItem>
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
              <SelectItem value="email">Sort by Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Volunteer</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Interests</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedVolunteers.map((vol) => {
               const avatar = PlaceHolderImages.find(p => p.id === vol.avatarUrl);
               return (
                <TableRow key={vol.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border shadow-sm">
                        <AvatarImage src={avatar?.imageUrl} alt={vol.name} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                          {vol.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm">{vol.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vol.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {vol.interests.map(i => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-secondary/50 border-none font-medium">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] font-bold">
                      Verified
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-accent">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Mail className="h-4 w-4" /> Contact Volunteer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <UserCheck className="h-4 w-4" /> View Impact History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                          <Ban className="h-4 w-4" /> Deactivate Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
               )
            })}
            {processedVolunteers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No volunteers found matching your selection.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
