'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, Edit, Plus, Filter, ArrowUpDown, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, setDoc, writeBatch } from 'firebase/firestore';
import { allCertificates } from '@/lib/placeholder-data';
import { BadgeVisual } from '@/components/shared/badge-visual';

const LEVEL_COLORS: Record<string, string> = {
  Bronze: 'bg-amber-100 text-amber-700 border-amber-200',
  Silver: 'bg-slate-100 text-slate-700 border-slate-200',
  Gold: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Platinum: 'bg-sky-100 text-sky-700 border-sky-200',
};

export default function BadgeConfigPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', rule: '', threshold: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const { toast } = useToast();
  const db = useFirestore();

  // Read badge configs from Firestore
  const badgesQuery = useMemoFirebase(() => collection(db, 'badge_config'), [db]);
  const { data: firestoreBadges, loading } = useCollection(badgesQuery);

  // Use Firestore badges if seeded, otherwise show placeholder with seed prompt
  const displayBadges = useMemo(() => {
    if (firestoreBadges && firestoreBadges.length > 0) return firestoreBadges;
    return allCertificates.map(b => ({ ...b, synced: false }));
  }, [firestoreBadges]);

  const isSeeded = firestoreBadges && firestoreBadges.length > 0;

  const allCategories = useMemo(() => {
    return Array.from(new Set(displayBadges.map((b: any) => b.category)));
  }, [displayBadges]);

  const processedBadges = useMemo(() => {
    return displayBadges
      .filter((badge: any) => {
        const matchesSearch = badge.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          badge.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || badge.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'name') return a.name?.localeCompare(b.name);
        if (sortBy === 'category') return a.category?.localeCompare(b.category);
        return 0;
      });
  }, [displayBadges, searchQuery, filterCategory, sortBy]);

  // Seed all badge definitions from placeholder-data into Firestore
  const handleSeedBadges = async () => {
    setIsSeeding(true);
    try {
      const batch = writeBatch(db);
      allCertificates.forEach(badge => {
        const ref = doc(db, 'badge_config', badge.id);
        batch.set(ref, {
          id: badge.id,
          name: badge.name,
          description: badge.description,
          rule: badge.rule,
          category: badge.category,
          level: badge.level || null,
          shape: badge.shape || 'circle',
          threshold: extractThreshold(badge.rule),
          isActive: true,
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      toast({ title: 'Badges Synced', description: `${allCertificates.length} badge definitions saved to Firestore.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSeeding(false);
    }
  };

  // Extract numeric threshold from rule string for display
  function extractThreshold(rule: string): number {
    const match = rule?.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  }

  const handleEditBadge = (badge: any) => {
    setSelectedBadge(badge);
    setEditForm({
      name: badge.name || '',
      description: badge.description || '',
      rule: badge.rule || '',
      threshold: String(badge.threshold || extractThreshold(badge.rule || '')),
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBadge || !isSeeded) {
      toast({ title: 'Sync first', description: 'Please sync badges to Firestore before editing.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'badge_config', selectedBadge.id), {
        name: editForm.name,
        description: editForm.description,
        rule: editForm.rule,
        threshold: parseInt(editForm.threshold) || 1,
        updatedAt: new Date().toISOString(),
      });
      toast({ title: 'Badge Updated', description: `"${editForm.name}" has been updated.` });
      setIsEditDialogOpen(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Badge Configuration</h1>
          <p className="text-sm text-muted-foreground">
            {isSeeded
              ? `${firestoreBadges!.length} badges synced to Firestore — editable below.`
              : 'Badges not yet synced. Click "Sync to Firestore" to enable editing.'}
          </p>
        </div>
        <Button
          onClick={handleSeedBadges}
          disabled={isSeeding}
          variant={isSeeded ? 'outline' : 'default'}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isSeeding ? 'Syncing...' : isSeeded ? 'Re-sync Badges' : 'Sync Badges to Firestore'}
        </Button>
      </div>

      {!isSeeded && (
        <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
          Badge definitions are currently hardcoded. Click "Sync Badges to Firestore" above to save them to your database so you can edit unlock rules from this panel.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search badges..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <div className="flex items-center gap-2"><Filter className="h-3 w-3" /><SelectValue placeholder="All Categories" /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((cat: any) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-2"><ArrowUpDown className="h-3 w-3" /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px] font-bold">Preview</TableHead>
              <TableHead className="font-bold">Badge Name</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Level</TableHead>
              <TableHead className="font-bold">Unlock Rule</TableHead>
              <TableHead className="font-bold">Threshold</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="h-24 text-center animate-pulse">Loading badges...</TableCell></TableRow>
            ) : processedBadges.map((badge: any) => (
              <TableRow key={badge.id} className="hover:bg-accent/30 transition-colors">
                <TableCell>
                  <div className="scale-75 -ml-2">
                    <BadgeVisual badge={{ ...badge, isEarned: true }} size="medium" />
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-sm">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{badge.description}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px]">{badge.category}</Badge>
                </TableCell>
                <TableCell>
                  {badge.level && (
                    <Badge variant="outline" className={`text-[10px] ${LEVEL_COLORS[badge.level] || ''}`}>
                      {badge.level}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                  {badge.rule}
                </TableCell>
                <TableCell className="text-sm font-semibold">
                  {badge.threshold || extractThreshold(badge.rule || '')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleEditBadge(badge)}>
                        <Edit className="h-4 w-4" /> Edit Badge
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSaveBadge}>
            <DialogHeader>
              <DialogTitle>Edit Badge: {selectedBadge?.name}</DialogTitle>
              <DialogDescription>
                Changes save to Firestore and take effect on next badge check.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="grid gap-4 py-4">
                {selectedBadge && (
                  <div className="flex justify-center p-4 bg-muted/30 rounded-lg border border-dashed">
                    <div className="flex flex-col items-center gap-2">
                      <BadgeVisual badge={{ ...selectedBadge, isEarned: true }} size="large" />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Preview</p>
                    </div>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>Badge Name</Label>
                  <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="min-h-[80px]" required />
                </div>
                <div className="grid gap-2">
                  <Label>Unlock Rule (displayed to users)</Label>
                  <Input value={editForm.rule} onChange={e => setEditForm(f => ({ ...f, rule: e.target.value }))} placeholder="e.g. Complete 5 events" required />
                </div>
                <div className="grid gap-2">
                  <Label>Threshold (the number that triggers unlock)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={editForm.threshold}
                    onChange={e => setEditForm(f => ({ ...f, threshold: e.target.value }))}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This is the number used in the unlock logic. For example, if the rule is "Complete 5 events", the threshold is 5.
                  </p>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving || !isSeeded}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
