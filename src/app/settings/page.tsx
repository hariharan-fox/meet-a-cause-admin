'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { LogOut, ShieldCheck, Trash2, Users, UserPlus, Shield, MoreVertical, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const db = useFirestore();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('moderator');
  const [isSaving, setIsSaving] = useState(false);

  const adminsQuery = useMemoFirebase(() => collection(db, 'admins'), [db]);
  const { data: admins, loading: adminsLoading } = useCollection(adminsQuery);

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not configured';

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'admins'), {
        name: newAdminName,
        email: newAdminEmail,
        role: newAdminRole,
        createdAt: new Date().toISOString(),
        invitedBy: user?.email || 'admin',
      });
      toast({ title: 'Admin Added', description: `${newAdminName} has been added.` });
      setNewAdminName('');
      setNewAdminEmail('');
      setIsAddUserOpen(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeAccess = async (adminId: string, adminName: string) => {
    try {
      await deleteDoc(doc(db, 'admins', adminId));
      toast({ variant: 'destructive', title: 'Access Revoked', description: `${adminName} no longer has admin access.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Suite Settings</h1>
          <p className="text-sm text-muted-foreground">Manage team access and backend configuration.</p>
        </div>

        {/* Firebase Connection */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" /> Backend Configuration
            </CardTitle>
            <CardDescription>Your connected Firebase project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Connected Project ID</p>
                <p className="text-sm font-mono font-bold text-primary">{projectId}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Live</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">
              This admin panel shares the same Firebase project as the user app. All data is synchronized in real-time.
            </p>
          </CardContent>
        </Card>

        {/* Profile — display only, no editing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Your Profile
            </CardTitle>
            <CardDescription>Your identity within the admin portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">{user?.name || 'Admin'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold tracking-wider">
                  {user?.role === 'admin' ? 'Super Administrator' : 'Staff Member'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* People & Access */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> People & Access
              </CardTitle>
              <CardDescription>Manage who has access to this admin portal.</CardDescription>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><UserPlus className="h-4 w-4" /> Grant Access</Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAddAdmin}>
                  <DialogHeader>
                    <DialogTitle>Add Administrator</DialogTitle>
                    <DialogDescription>
                      The person must first create an account on meetacause.in with this email. Then add their UID to Firestore rules for full access.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Full Name</Label>
                      <Input placeholder="e.g. Arjun Reddy" required value={newAdminName} onChange={e => setNewAdminName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="arjun@example.com" required value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Access Level</Label>
                      <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                          <SelectItem value="moderator">Moderator (Event/NGO Management)</SelectItem>
                          <SelectItem value="viewer">Viewer (Read-only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSaving}>{isSaving ? 'Adding...' : 'Add Admin'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              {adminsLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Loading admins...</div>
              ) : admins && admins.length > 0 ? (
                admins.map(adm => (
                  <div key={adm.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{adm.name}</p>
                        <p className="text-xs text-muted-foreground">{adm.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {adm.role?.replace('_', ' ') || 'Admin'}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => handleRevokeAccess(adm.id, adm.name)}>
                            <Trash2 className="h-4 w-4" /> Revoke Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No additional admins. Click "Grant Access" to add one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <Button variant="ghost" onClick={logout} className="w-full justify-start px-0 text-muted-foreground hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign out of Admin Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
