'use client';

import { useState, useMemo } from 'react';
import { allNgos } from "@/lib/placeholder-data";
import { NGO } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  ShieldCheck, 
  XCircle, 
  ArrowUpDown, 
  Plus, 
  Building, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  MessageSquare
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NgoManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCause, setFilterCause] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { toast } = useToast();

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

  const handleAddNgo = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "NGO Registered Successfully",
      description: "The organization and its verification documents have been saved.",
    });
    setIsAddDialogOpen(false);
  };

  const handleUpdateNgo = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "NGO Profile Updated",
      description: `${selectedNgo?.name}'s details and documents have been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleVerificationDecision = (status: 'verified' | 'rejected') => {
    const ngoEmail = `contact@${selectedNgo?.name.toLowerCase().replace(/\s/g, '')}.org`;
    
    if (status === 'rejected' && !rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason or feedback for rejecting the verification.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: status === 'verified' ? "NGO Verified" : "Verification Rejected",
      description: status === 'verified' 
        ? `${selectedNgo?.name} has been marked as a verified organization. Notification sent to ${ngoEmail}.`
        : `Verification for ${selectedNgo?.name} was rejected. Feedback has been emailed to ${ngoEmail}.`,
      variant: status === 'rejected' ? 'destructive' : 'default'
    });
    
    setIsVerifyDialogOpen(false);
    setRejectionReason('');
  };

  const handleSuspend = (ngo: NGO) => {
    toast({
      variant: "destructive",
      title: "Account Suspended",
      description: `${ngo.name} has been temporarily deactivated.`,
    });
  };

  const StatusBadge = ({ status }: { status: NGO['verificationStatus'] }) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 border-none gap-1"><CheckCircle2 className="h-3 w-3" /> Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none gap-1"><Clock className="h-3 w-3" /> Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><AlertCircle className="h-3 w-3" /> Unverified</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">NGO Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and moderate registered organizations within the platform.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-primary/20 shadow-lg">
              <Plus className="h-4 w-4" /> Add New NGO
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <form onSubmit={handleAddNgo}>
              <DialogHeader>
                <DialogTitle>Register New NGO</DialogTitle>
                <DialogDescription>
                  Enter official details and upload compliance documents for manual onboarding.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4 py-4">
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <h3 className="text-sm font-bold border-b pb-1">Basic Information</h3>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Organization Name</Label>
                      <Input id="name" placeholder="e.g. Help for All Foundation" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Primary Location</Label>
                      <Input id="location" placeholder="e.g. Chennai, Tamil Nadu" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="causes">Primary Causes (Comma separated)</Label>
                      <Input id="causes" placeholder="e.g. Education, Health" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="mission">Mission Statement</Label>
                      <Textarea id="mission" placeholder="What is the primary goal?" required />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <h3 className="text-sm font-bold border-b pb-1">Verification Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="darpanId">NGO Darpan ID</Label>
                        <Input id="darpanId" placeholder="PY/2023/..." required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <Input id="panNumber" placeholder="ABCDE1234F" required />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label>Legal Documents (PDF)</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2">
                          <Input type="file" className="text-xs h-8" />
                          <span className="text-[10px] whitespace-nowrap">80G Cert</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input type="file" className="text-xs h-8" />
                          <span className="text-[10px] whitespace-nowrap">12A Cert</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input type="file" className="text-xs h-8" />
                          <span className="text-[10px] whitespace-nowrap">Reg Cert</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Complete Registration</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit NGO Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <form onSubmit={handleUpdateNgo}>
            <DialogHeader>
              <DialogTitle>Edit NGO Profile</DialogTitle>
              <DialogDescription>
                Update registration details and compliance documents for {selectedNgo?.name}.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4 py-4">
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <h3 className="text-sm font-bold border-b pb-1">Organization Details</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Organization Name</Label>
                    <Input id="edit-name" defaultValue={selectedNgo?.name} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-location">Primary Location</Label>
                    <Input id="edit-location" defaultValue={selectedNgo?.location} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-causes">Primary Causes</Label>
                    <Input id="edit-causes" defaultValue={selectedNgo?.cause.join(', ')} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-mission">Mission Statement</Label>
                    <Textarea id="edit-mission" defaultValue={selectedNgo?.mission} required />
                  </div>
                </div>

                <div className="grid gap-4">
                  <h3 className="text-sm font-bold border-b pb-1">Verification Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-darpanId">NGO Darpan ID</Label>
                      <Input id="edit-darpanId" defaultValue={selectedNgo?.darpanId} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-panNumber">PAN Number</Label>
                      <Input id="edit-panNumber" defaultValue={selectedNgo?.panNumber} />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label>Updated Compliance Documents</Label>
                    <div className="space-y-2">
                       <div className="p-2 border rounded text-xs flex items-center justify-between">
                          <span className="flex items-center gap-2"><FileText className="h-3 w-3 text-primary" /> Current 80G.pdf</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6"><Upload className="h-3 w-3" /></Button>
                       </div>
                       <div className="p-2 border rounded text-xs flex items-center justify-between">
                          <span className="flex items-center gap-2"><FileText className="h-3 w-3 text-primary" /> Current 12A.pdf</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6"><Upload className="h-3 w-3" /></Button>
                       </div>
                       <div className="p-2 border rounded text-xs flex items-center justify-between">
                          <span className="flex items-center gap-2"><FileText className="h-3 w-3 text-primary" /> Current Reg_Cert.pdf</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6"><Upload className="h-3 w-3" /></Button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save All Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Verification Review Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[95vh] h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Verification Review: {selectedNgo?.name}
            </DialogTitle>
            <DialogDescription>
              Audit the submitted government documents and registration IDs for platform verification.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4 py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">NGO Darpan ID</p>
                    <p className="text-sm font-mono bg-muted p-2 rounded">{selectedNgo?.darpanId || 'ID_PENDING_SUBMISSION'}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">PAN Number</p>
                    <p className="text-sm font-mono bg-muted p-2 rounded">{selectedNgo?.panNumber || 'PAN_PENDING_SUBMISSION'}</p>
                 </div>
              </div>

              <Separator />

              <div className="space-y-3">
                 <p className="text-sm font-bold">Submitted Documents</p>
                 <div className="grid gap-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors group">
                       <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                             <p className="text-sm font-medium">80G Certificate</p>
                             <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                          </div>
                       </div>
                       <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-4 w-4" />
                       </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors group">
                       <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                             <p className="text-sm font-medium">12A Certificate</p>
                             <p className="text-xs text-muted-foreground">PDF • 850 KB</p>
                          </div>
                       </div>
                       <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-4 w-4" />
                       </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors group">
                       <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                             <p className="text-sm font-medium">NGO Registration Certificate</p>
                             <p className="text-xs text-muted-foreground">PDF • 2.1 MB</p>
                          </div>
                       </div>
                       <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-4 w-4" />
                       </Button>
                    </div>
                 </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                 <div className="flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm">
                       <p className="font-semibold text-primary">Compliance Check</p>
                       <p className="text-muted-foreground text-xs">Verification involves cross-referencing Darpan ID with the NITI Aayog portal and validating PAN details.</p>
                    </div>
                 </div>
              </div>
            </div>
          </ScrollArea>

          <div className="pt-4 border-t space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="review-feedback" className="text-sm font-bold">Reviewer Feedback / Change Request</Label>
              </div>
              <Textarea 
                id="review-feedback" 
                placeholder="Tell the NGO why the verification was rejected or what documents are missing. (e.g., '12A certificate is blurred, please re-upload')"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="text-xs min-h-[80px]"
              />
              <p className="text-[10px] text-muted-foreground italic">This feedback will be emailed directly to the organization's administrator.</p>
            </div>

            <DialogFooter className="gap-2 flex sm:justify-between items-center w-full">
              <Button 
                variant="outline" 
                onClick={() => handleVerificationDecision('rejected')} 
                className="text-destructive hover:text-destructive flex-1 sm:flex-none"
              >
                 Reject & Send Feedback
              </Button>
              <Button onClick={() => handleVerificationDecision('verified')} className="flex-1 sm:flex-none">
                 Approve & Verify NGO
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

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

      <div className="rounded-md border bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
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
            {processedNgos.map((ngo) => (
              <TableRow key={ngo.id} className="hover:bg-accent/30 transition-colors">
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    {ngo.name}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{ngo.location}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {ngo.cause.slice(0, 2).map(c => (
                      <Badge key={c} variant="secondary" className="text-[10px] bg-secondary/50">{c}</Badge>
                    ))}
                    {ngo.cause.length > 2 && <span className="text-[10px] text-muted-foreground">+{ngo.cause.length - 2}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={ngo.verificationStatus} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer"
                        onClick={() => {
                          setSelectedNgo(ngo);
                          setIsVerifyDialogOpen(true);
                        }}
                      >
                        <ShieldCheck className="h-4 w-4" /> Review Verification
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer"
                        onClick={() => {
                          setSelectedNgo(ngo);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" /> Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 text-destructive cursor-pointer"
                        onClick={() => handleSuspend(ngo)}
                      >
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
