'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/lib/auth-context";
import { 
  LogOut, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Trash2, 
  Users, 
  UserPlus, 
  Shield, 
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Fetch real admins from Firestore
  const adminsQuery = useMemoFirebase(() => collection(db, 'admins'), [db]);
  const { data: admins, isLoading: isAdminsLoading } = useCollection(adminsQuery);

  const adminAvatar = PlaceHolderImages.find(p => p.id === 'avatar-priya-sharma');
  const adminName = user?.name || "Platform Admin";
  const adminEmail = user?.email || "admin@meetacause.app";

  const showComingSoonToast = (feature: string) => {
    toast({
      title: 'Action Logged',
      description: `${feature} request has been sent for authorization.`,
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Invitation Sent",
      description: "A secure access link has been emailed to the new administrator.",
    });
    setIsAddUserOpen(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Suite Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your administrative profile, security, and team access levels.</p>
        </div>
        
        <div className="grid gap-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Your Profile
              </CardTitle>
              <CardDescription>
                Your identity within the management portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {adminAvatar && (
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage src={adminAvatar.imageUrl} alt={adminName} />
                      <AvatarFallback>{adminName.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="space-y-1">
                  <Button variant="outline" size="sm" onClick={() => showComingSoonToast('Changing your photo')}>Change Photo</Button>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{user?.role === 'admin' ? 'Super Administrator' : 'Staff Member'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={adminName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input id="email" type="email" defaultValue={adminEmail} disabled />
                </div>
              </div>
              <Button onClick={() => showComingSoonToast('Updating your profile')}>Save Profile Changes</Button>
            </CardContent>
          </Card>

          {/* People & Access Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  People & Access
                </CardTitle>
                <CardDescription>
                  Manage administrative users and their specific permission levels.
                </CardDescription>
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" /> Grant Access
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddUser}>
                    <DialogHeader>
                      <DialogTitle>Invite Administrator</DialogTitle>
                      <DialogDescription>
                        Grant portal access to a new team member and define their role.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-name">Full Name</Label>
                        <Input id="new-name" placeholder="Arjun Reddy" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-email">Work Email</Label>
                        <Input id="new-email" type="email" placeholder="arjun@meetacause.app" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-role">Access Level</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                            <SelectItem value="moderator">Moderator (Event/NGO Management)</SelectItem>
                            <SelectItem value="viewer">Viewer (Read-only Reports)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                      <Button type="submit">Send Secure Invite</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid gap-0">
                  {isAdminsLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                      Loading team members...
                    </div>
                  ) : admins && admins.length > 0 ? (
                    admins.map((adm) => (
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
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                            {adm.role?.replace('_', ' ') || 'Admin'}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2" onClick={() => showComingSoonToast('Editing role')}>
                                <Shield className="h-4 w-4" /> Edit Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive" onClick={() => showComingSoonToast('Revoking access')}>
                                <Trash2 className="h-4 w-4" /> Revoke Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No additional administrators found.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Access Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Your Security
              </CardTitle>
              <CardDescription>
                Control how you access the administrative suite.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Password Management</p>
                  <p className="text-xs text-muted-foreground">Manage your secure access credentials.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => showComingSoonToast('Resetting password')}>
                  Update Password
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => showComingSoonToast('Enabling 2FA')}>
                  Setup 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader className="bg-destructive/5">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Account Termination
              </CardTitle>
              <CardDescription className="text-destructive/70">
                Irreversible actions related to your administrative access.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Revoke Access</p>
                  <p className="text-xs text-muted-foreground">Permanently deactivate your administrative account.</p>
                </div>
                <Button variant="destructive" onClick={() => showComingSoonToast('Deleting account')}>Deactivate Access</Button>
              </div>
              <Separator />
              <Button variant="ghost" onClick={logout} className="w-full justify-start px-0 text-muted-foreground hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out of Admin Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}