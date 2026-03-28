'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/shared/logo';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signup(name, email, password, 'admin');
      toast({
        title: "Admin Account Created",
        description: "Welcome! You are now registered as a platform administrator.",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast({
      title: 'Feature Coming Soon!',
      description: 'Google sign-up is not yet available but will be in a future update.',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="mx-auto max-w-sm w-full shadow-2xl border-primary/10">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <Logo className="justify-center" />
          <CardTitle className="text-xl">Admin Registration</CardTitle>
          <CardDescription>Create a new administrator account for the portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <div className="text-sm text-red-500 text-center font-medium bg-red-100 p-2 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder="Priya Sharma"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@meetacause.app"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register as ADMIN'}
            </Button>
            
            <Button variant="outline" className="w-full h-11" type="button" onClick={handleGoogleSignup}>
              Sign up with Google
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline font-semibold">
              Login
            </Link>
          </div>
          
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Authorized administrator access only. All activity is logged.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
