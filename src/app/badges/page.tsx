'use client';

import { useState, useMemo } from 'react';
import { allCertificates } from "@/lib/placeholder-data";
import { Certificate } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Plus, 
  Award, 
  Filter,
  ArrowUpDown,
  Settings2,
  Trophy,
  CheckCircle2
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { BadgeVisual } from '@/components/shared/badge-visual';

export default function BadgeConfigPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Certificate | null>(null);

  const { toast } = useToast();

  const allCategories = useMemo(() => {
    return Array.from(new Set(allCertificates.map(b => b.category)));
  }, []);

  const processedBadges = useMemo(() => {
    let filtered = allCertificates.filter(badge => {
      const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          badge.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || badge.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  }, [searchQuery, filterCategory, sortBy]);

  const handleUpdateBadge = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Badge Configuration Updated",
      description: `"${selectedBadge?.name}" rules and visual styles have been saved.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleCreateBadge = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "New Badge Created",
      description: "A new achievement has been added to the platform's gamification system.",
    });
    setIsAddDialogOpen(false);
  };

  const LevelBadge = ({ level }: { level: Certificate['level'] }) => {
    const colors = {
      Bronze: "bg-amber-100 text-amber-700 border-amber-200",
      Silver: "bg-slate-100 text-slate-700 border-slate-200",
      Gold: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Platinum: "bg-sky-100 text-sky-700 border-sky-200",
    };
    return (
      <Badge variant="outline" className={colors[level || 'Bronze']}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Badge Configuration</h1>
          <p className="text-sm text-muted-foreground">Manage achievement rules, tiers, and visual styles for volunteers.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-primary/20 shadow-lg">
              <Plus className="h-4 w-4" /> Create New Badge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <form onSubmit={handleCreateBadge}>
              <DialogHeader>
                <DialogTitle>Create Achievement Badge</DialogTitle>
                <DialogDescription>
                  Define the criteria and visual representation for a new platform achievement.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4 py-4">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Badge Name</Label>
                    <Input id="name" placeholder="e.g., Ocean Guardian" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                        <SelectItem value="new">Add New Category...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="level">Tier / Level</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bronze">Bronze</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="shape">Badge Shape</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="pentagon">Pentagon</SelectItem>
                          <SelectItem value="hexagon">Hexagon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="rule">Unlock Rule (System Trigger)</Label>
                    <Input id="rule" placeholder="e.g., Complete 5 environmental events" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="What does this badge represent?" required className="min-h-[100px]" />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Publish Achievement</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search badges..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3 w-3" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedBadges.map((badge) => (
              <TableRow key={badge.id} className="hover:bg-accent/30 transition-colors">
                <TableCell>
                  <div className="scale-75 -ml-2">
                    <BadgeVisual badge={{ ...badge, isEarned: true }} size="medium" />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{badge.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] font-medium">{badge.category}</Badge>
                </TableCell>
                <TableCell>
                  <LevelBadge level={badge.level} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                  {badge.rule}
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
                          setSelectedBadge(badge);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" /> Edit Configuration
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Settings2 className="h-4 w-4" /> Logic Rules
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                        <Trophy className="h-4 w-4" /> Archive Achievement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Badge Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          {selectedBadge && (
            <form onSubmit={handleUpdateBadge}>
              <DialogHeader>
                <DialogTitle>Edit Badge: {selectedBadge.name}</DialogTitle>
                <DialogDescription>
                  Modify the visual identity and reward logic for this achievement.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4 py-4">
                <div className="grid gap-6">
                  <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
                     <div className="flex flex-col items-center gap-2">
                        <BadgeVisual badge={{ ...selectedBadge, isEarned: true }} size="large" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Visual Preview</p>
                     </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Badge Name</Label>
                    <Input id="edit-name" defaultValue={selectedBadge.name} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-level">Tier</Label>
                      <Select defaultValue={selectedBadge.level}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bronze">Bronze</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-shape">Shape</Label>
                      <Select defaultValue={selectedBadge.shape}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="pentagon">Pentagon</SelectItem>
                          <SelectItem value="hexagon">Hexagon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-rule">Unlock Logic</Label>
                    <Input id="edit-rule" defaultValue={selectedBadge.rule} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea id="edit-description" defaultValue={selectedBadge.description} required className="min-h-[100px]" />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Logic Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
