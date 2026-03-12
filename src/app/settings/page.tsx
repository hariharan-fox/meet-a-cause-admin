'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/lib/auth-context";
import { LogOut, ShieldCheck, Bell, Lock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // Using the admin avatar from placeholder data
  const adminAvatar = PlaceHolderImages.find(p => p.id === 'avatar-priya-sharma');
  const adminName = user?.name || "Platform Admin";
  const adminEmail = user?.email || "admin@meetacause.app";

  const showComingSoonToast = (feature: string) => {
    toast({
      title: 'Feature Coming Soon!',
      description: `${feature} is not yet available but will be in a future update.`,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 animate-slide-in-from-bottom">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your administrative profile and security preferences.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Admin Profile
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
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">System Administrator</p>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Security & Access
            </CardTitle>
            <CardDescription>
              Control how you access the administrative suite.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">Password Management</p>
                <p className="text-xs text-muted-foreground">Last changed 3 months ago.</p>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Moderation Notifications
            </CardTitle>
            <CardDescription>
              Decide which platform events trigger administrative alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between text-sm">
                <span>New NGO Registration Requests</span>
                <Button variant="ghost" className="text-primary h-auto p-0 hover:bg-transparent" onClick={() => showComingSoonToast('Notification settings')}>Configure</Button>
             </div>
             <Separator />
             <div className="flex items-center justify-between text-sm">
                <span>Flagged Content Alerts</span>
                <Button variant="ghost" className="text-primary h-auto p-0 hover:bg-transparent" onClick={() => showComingSoonToast('Notification settings')}>Configure</Button>
             </div>
             <Separator />
             <div className="flex items-center justify-between text-sm">
                <span>Critical System Updates</span>
                <Button variant="ghost" className="text-primary h-auto p-0 hover:bg-transparent" onClick={() => showComingSoonToast('Notification settings')}>Configure</Button>
             </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader className="bg-destructive/5">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-destructive/70">
              Irreversible actions related to your administrative access.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Revoke Admin Access</p>
                <p className="text-xs text-muted-foreground">This will remove your ability to manage the platform.</p>
              </div>
              <Button variant="destructive" onClick={() => showComingSoonToast('Deleting your account')}>Deactivate Admin</Button>
            </div>
            <Separator />
            <Button variant="ghost" onClick={logout} className="w-full justify-start px-0 -ml-2 text-muted-foreground hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out of Admin Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
