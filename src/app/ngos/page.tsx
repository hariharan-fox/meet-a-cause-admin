'use client';

import { useState } from 'react';
import { allNgos } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Edit, ShieldCheck, XCircle } from "lucide-react";
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

export default function NgoManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNgos = allNgos.filter(ngo =>
    ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ngo.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">NGO Management</h1>
          <p className="text-sm text-muted-foreground">Manage and moderate organizations on the platform.</p>
        </div>
        <Button>
          Add New NGO
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or location..."
          className="pl-10 max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
            {filteredNgos.map((ngo) => (
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
