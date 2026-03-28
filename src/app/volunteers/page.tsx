'use client';

import { useState, useMemo } from 'react';
import { volunteer as mockVolunteer, allCertificates, completedEvents } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreVertical, 
  Mail, 
  Ban, 
  UserCheck, 
  ArrowUpDown, 
  Filter,
  Clock,
  CheckCircle2,
  Award,
  History,
  TrendingUp,
  MapPin,
  Database
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BadgeVisual } from '@/components/shared/badge-visual';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function VolunteerManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInterest, setFilterInterest] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  // Fetch real volunteers from Firestore
  const volunteersQuery = useMemoFirebase(() => collection(db, 'volunteer_profiles'), [db]);
  const { data: realVolunteers, isLoading: isVolunteersLoading } = useCollection(volunteersQuery);

  // Combine real data with a few mocks for demonstration if collection is empty
  const displayVolunteers = useMemo(() => {
    return realVolunteers && realVolunteers.length > 0 ? realVolunteers : [mockVolunteer];
  }, [realVolunteers]);

  const allInterests = useMemo(() => {
    const interests = new Set<string>();
    displayVolunteers.forEach(vol => vol.interests?.forEach((i: string) => interests.add(i)));
    return Array.from(interests);
  }, [displayVolunteers]);

  const processedVolunteers = useMemo(() => {
    let filtered = displayVolunteers.filter(vol => {
      const matchesSearch = vol.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vol.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInterest = filterInterest === 'all' || vol.interests?.includes(filterInterest);
      return matchesSearch && matchesInterest;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'email') return (a.email || '').localeCompare(b.email || '');
      return 0;
    });
  }, [searchQuery, filterInterest, sortBy, displayVolunteers]);

  const handleContact = (name: string, email: string) => {
    toast({
      title: "Contact Initiated",
      description: `Drafting email to ${name} (${email})...`,
    });
  };

  const handleViewHistory = (vol: any) => {
    setSelectedVolunteer(vol);
    setIsHistoryDialogOpen(true);
  };

  const handleDeactivate = (name: string) => {
    toast({
      variant: "destructive",
      title: "Account Deactivated",
      description: `${name}'s volunteer account has been suspended.`,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Volunteer Registry</h1>
          <p className="text-sm text-muted-foreground">Monitor activity and manage shared volunteer profiles from your Firebase backend.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border rounded-lg">
           <Database className="h-4 w-4 text-primary" />
           <span className="text-xs font-semibold text-primary">Live Database Active</span>
        </div>
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
            {isVolunteersLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground animate-pulse">
                  Querying live registry from Firestore...
                </TableCell>
              </TableRow>
            ) : processedVolunteers.map((vol) => {
               const avatar = PlaceHolderImages.find(p => p.id === vol.avatarUrl);
               return (
                <TableRow key={vol.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border shadow-sm">
                        <AvatarImage src={avatar?.imageUrl} alt={vol.name} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                          {vol.name?.charAt(0) || 'V'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm">{vol.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vol.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {vol.interests?.map((i: string) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-secondary/50 border-none font-medium">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] font-bold">
                      {vol.verificationStatus || 'Verified'}
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
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleContact(vol.name, vol.email)}>
                          <Mail className="h-4 w-4" /> Contact Volunteer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleViewHistory(vol)}>
                          <UserCheck className="h-4 w-4" /> View Impact History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => handleDeactivate(vol.name)}>
                          <Ban className="h-4 w-4" /> Deactivate Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
               )
            })}
            {!isVolunteersLoading && processedVolunteers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No volunteers found in the live Firestore collection.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Volunteer Impact & History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl">
          {selectedVolunteer && (
            <div className="flex flex-col h-[85vh]">
              <DialogHeader className="p-6 bg-primary/5">
                 <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage src={PlaceHolderImages.find(p => p.id === selectedVolunteer.avatarUrl)?.imageUrl} />
                      <AvatarFallback>{selectedVolunteer.name?.charAt(0) || 'V'}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                       <DialogTitle className="text-2xl font-bold">{selectedVolunteer.name}</DialogTitle>
                       <DialogDescription className="text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" /> {selectedVolunteer.email}
                       </DialogDescription>
                       <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">Member</Badge>
                          <Badge variant="outline">Verified Registry</Badge>
                       </div>
                    </div>
                 </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <div className="px-6 border-b">
                   <TabsList className="bg-transparent h-12 gap-6 p-0">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none px-0 gap-2"><TrendingUp className="h-4 w-4" /> Impact Overview</TabsTrigger>
                      <TabsTrigger value="badges" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none px-0 gap-2"><Award className="h-4 w-4" /> Earned Badges</TabsTrigger>
                      <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none px-0 gap-2"><History className="h-4 w-4" /> Activity Timeline</TabsTrigger>
                   </TabsList>
                </div>

                <ScrollArea className="flex-1 p-6">
                   <TabsContent value="overview" className="mt-0 space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                         <div className="p-4 rounded-xl border bg-muted/30 text-center">
                            <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <p className="text-2xl font-bold">42</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Hours</p>
                         </div>
                         <div className="p-4 rounded-xl border bg-muted/30 text-center">
                            <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-green-600" />
                            <p className="text-2xl font-bold">8</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Events Finished</p>
                         </div>
                         <div className="p-4 rounded-xl border bg-muted/30 text-center">
                            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                            <p className="text-2xl font-bold">12</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Skills Verified</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-sm font-bold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Skills & Expertise</h3>
                         <div className="flex flex-wrap gap-2">
                            {selectedVolunteer.skills?.map((skill: string) => (
                               <Badge key={skill} variant="secondary" className="px-3 py-1">{skill}</Badge>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-sm font-bold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Primary Interests</h3>
                         <div className="flex flex-wrap gap-2">
                            {selectedVolunteer.interests?.map((interest: string) => (
                               <Badge key={interest} variant="outline" className="px-3 py-1">{interest}</Badge>
                            ))}
                         </div>
                      </div>
                   </TabsContent>

                   <TabsContent value="badges" className="mt-0">
                      <div className="grid grid-cols-4 gap-x-2 gap-y-6">
                         {allCertificates.filter(b => b.isEarned).slice(0, 8).map((badge) => (
                            <div key={badge.id} className="flex flex-col items-center gap-2 text-center group">
                               <BadgeVisual badge={badge} size="medium" />
                               <p className="text-[10px] font-bold leading-tight group-hover:text-primary transition-colors">{badge.name}</p>
                            </div>
                         ))}
                      </div>
                   </TabsContent>

                   <TabsContent value="history" className="mt-0 space-y-4">
                      {completedEvents.map((event) => (
                         <div key={event.id} className="relative pl-6 pb-6 border-l last:border-0 last:pb-0">
                            <div className="absolute left-[-5px] top-0 h-2 w-2 rounded-full bg-primary" />
                            <div className="space-y-1">
                               <div className="flex items-center justify-between">
                                  <p className="text-sm font-bold">{event.title}</p>
                                  <p className="text-[10px] text-muted-foreground">{event.date}</p>
                               </div>
                               <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 4 Hours Logged</span>
                               </div>
                               <div className="mt-2 flex gap-1">
                                  <Badge variant="secondary" className="text-[9px] h-4 py-0">Verified Attendance</Badge>
                                  <Badge variant="outline" className="text-[9px] h-4 py-0">{event.cause}</Badge>
                               </div>
                            </div>
                         </div>
                      ))}
                   </TabsContent>
                </ScrollArea>

                <div className="p-6 border-t bg-muted/10 flex justify-between items-center">
                   <Button variant="outline" size="sm" className="gap-2" onClick={() => handleContact(selectedVolunteer.name, selectedVolunteer.email)}>
                      <Mail className="h-4 w-4" /> Send Official Message
                   </Button>
                   <Button size="sm" variant="secondary" onClick={() => setIsHistoryDialogOpen(false)}>Close Report</Button>
                </div>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}