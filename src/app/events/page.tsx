'use client';

import { useState } from 'react';
import { allEvents, allNgos } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Eye, Trash2, CheckCircle } from "lucide-react";
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

export default function EventManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Moderation</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage volunteering opportunities across the platform.</p>
        </div>
        <Button>
          Create Platform Event
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by event title or location..."
          className="pl-10 max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Title</TableHead>
              <TableHead>Organizing NGO</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Cause</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => {
              const ngo = allNgos.find(n => n.id === event.ngoId);
              return (
                <TableRow key={event.id}>
                  <TableCell className="font-semibold max-w-[200px] truncate">{event.title}</TableCell>
                  <TableCell className="text-sm font-medium">{ngo?.name || 'Unknown'}</TableCell>
                  <TableCell className="text-sm">{event.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">{event.cause}</Badge>
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
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <CheckCircle className="h-4 w-4" /> Approve Edits
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" /> Delete Event
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
