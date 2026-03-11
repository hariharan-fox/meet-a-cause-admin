'use client';

import { useState } from 'react';
import { volunteer } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Mail, Ban, UserCheck } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Mocking multiple volunteers for the admin list
const mockVolunteers = [
  volunteer,
  { id: 'vol-2', name: 'Ananya Rao', email: 'ananya.rao@example.com', avatarUrl: 'avatar-ananya-rao', skills: ['Teaching'], interests: ['Education'] },
  { id: 'vol-3', name: 'Rohan Mehta', email: 'rohan.mehta@example.com', avatarUrl: 'avatar-rohan-mehta', skills: ['Logistics'], interests: ['Health'] },
];

export default function VolunteerManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVolunteers = mockVolunteers.filter(vol =>
    vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vol.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Volunteer Registry</h1>
        <p className="text-sm text-muted-foreground">Monitor user activity and manage volunteer profiles.</p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10 max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Volunteer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Interests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVolunteers.map((vol) => {
               const avatar = PlaceHolderImages.find(p => p.id === vol.avatarUrl);
               return (
                <TableRow key={vol.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatar?.imageUrl} alt={vol.name} />
                        <AvatarFallback>{vol.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm">{vol.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vol.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {vol.interests.map(i => (
                        <Badge key={i} variant="outline" className="text-[10px]">{i}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px]">Verified</Badge>
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
                          <Mail className="h-4 w-4" /> Contact Volunteer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <UserCheck className="h-4 w-4" /> View History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Ban className="h-4 w-4" /> Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
               )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
