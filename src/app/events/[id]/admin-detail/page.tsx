'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { allEvents, allNgos, volunteer } from "@/lib/placeholder-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  FileText, 
  Video, 
  Mail, 
  Download, 
  TrendingUp, 
  MessageSquare,
  Clock,
  Calendar,
  MapPin,
  ExternalLink
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Mock expanded data for the admin view
const mockVolunteers = [
  { ...volunteer, status: 'Attended', signedUpAt: '2024-10-15' },
  { id: 'v2', name: 'Ananya Rao', email: 'ananya@ngo.org', avatarUrl: 'avatar-ananya-rao', status: 'Attended', signedUpAt: '2024-10-16' },
  { id: 'v3', name: 'Rohan Mehta', email: 'rohan@impact.org', avatarUrl: 'avatar-rohan-mehta', status: 'No Show', signedUpAt: '2024-10-17' },
];

const mockImpactGallery = [
  'event-beach-cleanup',
  'event-tree-planting',
  'event-food-drive'
];

export default function AdminEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const event = allEvents.find(e => e.id === params.id);
  const ngo = allNgos.find(n => n.id === event?.ngoId);

  if (!event) {
    return <div className="p-8 text-center">Event not found.</div>;
  }

  const eventImage = PlaceHolderImages.find(p => p.id === event.imageUrl);
  const totalSignedUp = mockVolunteers.length;
  const totalAttended = mockVolunteers.filter(v => v.status === 'Attended').length;

  const handleContactNgo = () => {
    toast({
      title: "NGO Contact Initiated",
      description: `A secure message thread has been opened with ${ngo?.name}.`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Report Generating",
      description: "The full event impact report is being prepared for download.",
    });
  };

  const handleBulkEmail = () => {
    toast({
      title: "Bulk Mailer Opened",
      description: `Preparing to email ${totalSignedUp} registered volunteers.`,
    });
  };

  const handleVerifyReport = () => {
    toast({
      title: "Report Verified",
      description: "The impact report has been audited and moved to the platform archives.",
    });
  };

  const handleSaveNote = () => {
    toast({
      title: "Note Saved",
      description: "Internal moderator notes have been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 animate-slide-in-from-bottom">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Back to Moderation
        </Button>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2" onClick={handleExportReport}>
              <Download className="h-4 w-4" /> Export Report
           </Button>
           <Button size="sm" className="gap-2" onClick={handleContactNgo}>
              <MessageSquare className="h-4 w-4" /> Contact NGO
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Event Summary & Volunteer List */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                   <Badge>{event.cause}</Badge>
                   <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{event.title}</h1>
                  <Link 
                    href={`/events/${event.id}`} 
                    target="_blank" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="View Public Page"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>
                <p className="text-muted-foreground text-sm flex items-center gap-4">
                   <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.date}</span>
                   <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                   <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                         <Users className="h-5 w-5 text-primary mb-2" />
                         <p className="text-2xl font-bold">{totalSignedUp}</p>
                         <p className="text-[10px] text-muted-foreground uppercase font-bold">Signed Up</p>
                      </div>
                   </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                   <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                         <CheckCircle2 className="h-5 w-5 text-green-600 mb-2" />
                         <p className="text-2xl font-bold text-green-700">{totalAttended}</p>
                         <p className="text-[10px] text-muted-foreground uppercase font-bold">Attended</p>
                      </div>
                   </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                   <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                         <TrendingUp className="h-5 w-5 text-blue-600 mb-2" />
                         <p className="text-2xl font-bold text-blue-700">88%</p>
                         <p className="text-[10px] text-muted-foreground uppercase font-bold">Success Rate</p>
                      </div>
                   </CardContent>
                </Card>
             </div>
          </section>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Volunteer Roster</CardTitle>
                <CardDescription>Full list of registered users for this event.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary h-8" onClick={handleBulkEmail}>
                 <Mail className="h-4 w-4 mr-2" /> Bulk Email
              </Button>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Volunteer</TableHead>
                     <TableHead>Email</TableHead>
                     <TableHead>Signup Date</TableHead>
                     <TableHead>Status</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {mockVolunteers.map((v) => {
                     const avatar = PlaceHolderImages.find(p => p.id === v.avatarUrl);
                     return (
                       <TableRow key={v.id}>
                         <TableCell>
                           <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={avatar?.imageUrl} alt={v.name} />
                                <AvatarFallback>{v.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-semibold">{v.name}</span>
                           </div>
                         </TableCell>
                         <TableCell className="text-xs text-muted-foreground">{v.email}</TableCell>
                         <TableCell className="text-xs">{v.signedUpAt}</TableCell>
                         <TableCell>
                           <Badge variant={v.status === 'Attended' ? 'default' : 'secondary'} className="text-[10px]">
                              {v.status}
                           </Badge>
                         </TableCell>
                       </TableRow>
                     )
                   })}
                 </TableBody>
               </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: NGO Impact Report */}
        <div className="space-y-6">
           <Card className="border-primary/20 shadow-xl">
              <CardHeader className="bg-primary/5">
                 <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-bold">NGO Impact Report</CardTitle>
                 </div>
                 <CardDescription>Submitted by {ngo?.name} on Dec 10, 2024</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Executive Summary</p>
                    <p className="text-sm leading-relaxed">
                       The event was a massive success. We collected over 450kg of plastic waste along the 2km stretch of the coastline. The volunteers were exceptional, and the community engagement was at an all-time high.
                    </p>
                 </div>

                 <Separator />

                 <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                       <Video className="h-3 w-3" /> Event Recap Video
                    </p>
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-inner">
                       <div className="z-10 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 group-hover:scale-110 transition-transform">
                          <Video className="h-8 w-8 text-white" />
                       </div>
                       <p className="absolute bottom-3 left-3 text-[10px] text-white/50 font-mono">RECAP_REEL_v1.mp4</p>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                 </div>

                 <Separator />

                 <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Impact Gallery</p>
                    <div className="grid grid-cols-2 gap-2">
                       {mockImpactGallery.map((imgId, idx) => {
                          const img = PlaceHolderImages.find(p => p.id === imgId);
                          return (
                             <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                                <Image 
                                   src={img?.imageUrl || ''} 
                                   alt="Impact photo" 
                                   fill 
                                   className="object-cover hover:scale-105 transition-transform" 
                                />
                             </div>
                          )
                       })}
                       <div className="aspect-square bg-muted rounded-md flex items-center justify-center border border-dashed text-muted-foreground text-[10px]">
                          +5 more
                       </div>
                    </div>
                 </div>

                 <Button className="w-full h-11" variant="outline" onClick={handleVerifyReport}>
                    Verify & Archive Report
                 </Button>
              </CardContent>
           </Card>

           <Card>
              <CardHeader>
                 <CardTitle className="text-sm font-bold">Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                 <textarea 
                    className="w-full min-h-[100px] p-3 text-xs bg-muted/50 rounded-md border-none focus:ring-1 focus:ring-primary"
                    placeholder="Add private internal notes about this event's performance..."
                 />
                 <Button className="w-full mt-3 h-8 text-xs" variant="secondary" onClick={handleSaveNote}>Save Note</Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}