'use client';

import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function formatTime(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return createdAt;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch { return createdAt; }
}

export default function AdminNotificationsPage() {
  const { user } = useAuth();

  // Admin notifications are not stored the same way as volunteer notifications
  // This shows a clean empty state for now
  const notifications: any[] = [];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">System alerts and admin activity log.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-3 opacity-30" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs mt-1">Admin activity alerts will appear here.</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification: any) => (
                <div key={notification.id} className={cn('grid grid-cols-[12px_1fr] items-start gap-3 p-4 border-b last:border-b-0', !notification.isRead && 'bg-primary/5')}>
                  <span className={cn('flex h-2 w-2 rounded-full mt-1.5 shrink-0', !notification.isRead ? 'bg-primary' : 'bg-transparent')} />
                  <div className="grid gap-1">
                    <p className={cn('text-sm leading-none', !notification.isRead ? 'font-semibold' : 'font-medium')}>{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
