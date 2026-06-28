'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, CheckCircle2, XCircle, Clock, Eye, Mail, Phone, Globe, Calendar } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

export default function OrgApplicationsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const applicationsQuery = useMemoFirebase(() => collection(db, 'ngo_applications'), [db]);
  const { data: applications, loading } = useCollection(applicationsQuery);

  const processed = useMemo(() => {
    if (!applications) return [];
    return applications
      .filter(app => {
        const matchesSearch = !searchQuery ||
          app.orgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.orgEmail?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [applications, searchQuery, filterStatus]);

  const counts = useMemo(() => ({
    total: applications?.length || 0,
    pending: applications?.filter(a => a.status === 'pending').length || 0,
    approved: applications?.filter(a => a.status === 'approved').length || 0,
    rejected: applications?.filter(a => a.status === 'rejected').length || 0,
  }), [applications]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'ngo_applications', id), {
        status,
        reviewedAt: new Date().toISOString(),
      });
      if (selectedApp?.id === id) setSelectedApp((a: any) => ({ ...a, status }));
      toast({
        title: status === 'approved' ? 'Application Approved' : 'Application Rejected',
        description: status === 'approved'
          ? 'You can now add this organisation to the platform.'
          : 'The application has been marked as rejected.',
        variant: status === 'rejected' ? 'destructive' : 'default',
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organisation Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review organisations applying to list on Meet A Cause.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: counts.total, color: 'text-foreground' },
          { label: 'Pending', count: counts.pending, color: 'text-amber-700' },
          { label: 'Approved', count: counts.approved, color: 'text-green-700' },
          { label: 'Rejected', count: counts.rejected, color: 'text-red-700' },
        ].map(({ label, count, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
        </div>
      ) : processed.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-semibold">No applications yet</p>
          <p className="text-sm mt-1">Applications submitted via the registration form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {processed.map(app => (
            <div
              key={app.id}
              className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setSelectedApp(app)}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                {app.orgName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{app.orgName}</p>
                <p className="text-xs text-muted-foreground">{app.contactName} · {app.orgEmail}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant="outline" className="text-[10px]">{app.cause}</Badge>
                <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[app.status] || ''}`}>
                  {app.status}
                </Badge>
                <p className="text-xs text-muted-foreground hidden md:block">
                  {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </p>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={open => !open && setSelectedApp(null)}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedApp.orgName}</DialogTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">{selectedApp.cause}</Badge>
                  <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[selectedApp.status] || ''}`}>
                    {selectedApp.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${selectedApp.orgEmail}`} className="text-primary hover:underline truncate">
                      {selectedApp.orgEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>+91 {selectedApp.contactPhone}</span>
                  </div>
                  {selectedApp.website && (
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a href={selectedApp.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {selectedApp.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Details */}
                {[
                  { label: 'Contact Person', value: selectedApp.contactName },
                  { label: 'Location', value: selectedApp.location },
                  { label: 'PAN Number', value: selectedApp.panNumber },
                  { label: 'Mission', value: selectedApp.mission },
                  { label: 'Vision', value: selectedApp.vision },
                  { label: 'Impact', value: selectedApp.impact },
                ].map(({ label, value }) => value && (
                  <div key={label}>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}

                {/* First Event */}
                <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Event</p>
                  <p className="font-semibold text-sm">{selectedApp.eventName}</p>
                  <p className="text-sm text-muted-foreground">{selectedApp.eventDetails}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {selectedApp.eventDate}
                  </div>
                </div>

                {/* Actions */}
                {selectedApp.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateStatus(selectedApp.id, 'approved')}
                      disabled={isUpdating}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isUpdating ? 'Updating...' : 'Approve'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                      disabled={isUpdating}
                    >
                      <XCircle className="h-4 w-4" />
                      {isUpdating ? 'Updating...' : 'Reject'}
                    </Button>
                  </div>
                )}

                {selectedApp.status === 'approved' && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Approved — add this organisation via Manage NGOs.
                  </div>
                )}

                {selectedApp.status === 'rejected' && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'pending')}
                    disabled={isUpdating}
                  >
                    Move Back to Pending
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
