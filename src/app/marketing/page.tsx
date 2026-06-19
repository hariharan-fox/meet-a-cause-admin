'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Image, Bell, Users, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDocs, updateDoc } from 'firebase/firestore';

export default function MarketingPage() {
  const db = useFirestore();
  const { toast } = useToast();

  // Banners
  const bannersQuery = useMemoFirebase(() => collection(db, 'banners'), [db]);
  const { data: banners, loading: bannersLoading } = useCollection(bannersQuery);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', imageUrl: '', linkUrl: '', isActive: true });
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);

  // Global Notifications
  const [notifForm, setNotifForm] = useState({ title: '', description: '', target: 'all' });
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const volunteersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: volunteers } = useCollection(volunteersQuery);

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBanner(true);
    try {
      await addDoc(collection(db, 'banners'), {
        ...bannerForm,
        createdAt: new Date().toISOString(),
      });
      toast({ title: 'Banner Added', description: 'Banner is now live on the platform.' });
      setBannerForm({ title: '', subtitle: '', imageUrl: '', linkUrl: '', isActive: true });
      setIsBannerDialogOpen(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setIsSavingBanner(false); }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'banners', id));
      toast({ title: 'Banner Removed', variant: 'destructive' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifForm.title || !notifForm.description) return;
    setIsSendingNotif(true);

    try {
      const notification = {
        id: `notif-admin-${Date.now()}`,
        title: notifForm.title,
        description: notifForm.description,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      // Fetch all users and update their notifications array
      const usersSnap = await getDocs(collection(db, 'users'));
      const updatePromises = usersSnap.docs.map(userDoc => {
        const userData = userDoc.data();
        const existingNotifs = userData.notifications || [];
        return updateDoc(doc(db, 'users', userDoc.id), {
          notifications: [{ ...notification, id: `notif-admin-${Date.now()}-${userDoc.id}` }, ...existingNotifs],
        });
      });

      await Promise.all(updatePromises);

      toast({
        title: 'Notification Sent',
        description: `Sent to ${usersSnap.docs.length} volunteer${usersSnap.docs.length !== 1 ? 's' : ''}.`,
      });
      setNotifForm({ title: '', description: '', target: 'all' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setIsSendingNotif(false); }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
        <p className="text-sm text-muted-foreground">Manage banners and send notifications to volunteers.</p>
      </div>

      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners" className="gap-2"><Image className="h-4 w-4" />Banner Management</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Global Notifications</TabsTrigger>
        </TabsList>

        {/* Banner Management */}
        <TabsContent value="banners" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Banners</h2>
              <p className="text-sm text-muted-foreground">{banners?.length || 0} banners configured</p>
            </div>
            <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" />Add Banner</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleAddBanner}>
                  <DialogHeader><DialogTitle>Add New Banner</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Banner Title *</Label>
                      <Input placeholder="e.g. Beach Cleanup Drive 2026" required value={bannerForm.title} onChange={e => setBannerForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Subtitle</Label>
                      <Input placeholder="e.g. Join us this weekend!" value={bannerForm.subtitle} onChange={e => setBannerForm(f => ({ ...f, subtitle: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Image URL *</Label>
                      <Input placeholder="https://images.unsplash.com/..." required value={bannerForm.imageUrl} onChange={e => setBannerForm(f => ({ ...f, imageUrl: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Link URL (optional)</Label>
                      <Input placeholder="https://meetacause.vercel.app/events/..." value={bannerForm.linkUrl} onChange={e => setBannerForm(f => ({ ...f, linkUrl: e.target.value }))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsBannerDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSavingBanner}>{isSavingBanner ? 'Saving...' : 'Add Banner'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {bannersLoading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>
          ) : banners && banners.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {banners.map(banner => (
                <Card key={banner.id}>
                  <CardContent className="p-4">
                    {banner.imageUrl && (
                      <div className="aspect-[16/7] rounded-lg overflow-hidden bg-muted mb-3">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">{banner.title}</p>
                        {banner.subtitle && <p className="text-xs text-muted-foreground">{banner.subtitle}</p>}
                        {banner.linkUrl && <p className="text-xs text-primary truncate mt-1">{banner.linkUrl}</p>}
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDeleteBanner(banner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 border rounded-xl bg-muted/20">
              <Image className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No banners yet</p>
              <p className="text-xs mt-1">Add a banner to display on the user dashboard.</p>
            </div>
          )}
        </TabsContent>

        {/* Global Notifications */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />Send to All Volunteers
                </CardTitle>
                <CardDescription>This notification will appear in every volunteer's notification inbox.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Notification Title *</Label>
                    <Input placeholder="e.g. New Event Available!" required value={notifForm.title} onChange={e => setNotifForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Message *</Label>
                    <Textarea placeholder="e.g. A new beach cleanup event has been posted. Check it out!" required className="min-h-[100px]" value={notifForm.description} onChange={e => setNotifForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Will be sent to <span className="font-bold text-foreground">{volunteers?.length || 0}</span> volunteers
                    </p>
                    <Button type="submit" disabled={isSendingNotif} className="gap-2">
                      <Bell className="h-4 w-4" />
                      {isSendingNotif ? 'Sending...' : 'Send Notification'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />Platform Stats
                </CardTitle>
                <CardDescription>Current reach of your notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border text-center">
                  <p className="text-3xl font-bold">{volunteers?.length || 0}</p>
                  <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Total Volunteers</p>
                </div>
                <p className="text-xs text-muted-foreground">Notifications are delivered instantly to all active volunteer accounts. They appear in the Notifications section of the user app.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
