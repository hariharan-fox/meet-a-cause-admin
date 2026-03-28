
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Logo } from '@/components/shared/logo';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Info, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'volunteer' | 'ngo' | 'admin'>('volunteer');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (role === 'volunteer') {
        router.push('/waitlist');
        return;
      }
      await signup(name, email, password, role);
      toast({
        title: "Account Created",
        description: `Welcome! You are now registered as a ${role.toUpperCase()}.`,
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
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Logo className="justify-center mb-2" />
          <CardTitle className="text-lg">Create an Account</CardTitle>
          <CardDescription>Select your role to get started</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
                <RadioGroup
                    value={role}
                    onValueChange={(val) => setRole(val as any)}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="volunteer" id="volunteer" />
                      <Label htmlFor="volunteer">Volunteer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ngo" id="ngo" />
                      <Label htmlFor="ngo">NGO</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="mt-6">
                {role === 'volunteer' && (
                    <div className="text-center space-y-4 p-4 bg-accent/50 rounded-lg">
                        <Info className="mx-auto h-8 w-8 text-primary" />
                        <h3 className="font-semibold">Volunteer Waitlist</h3>
                        <p className="text-sm text-muted-foreground">
                            We are currently onboarding NGOs. Join the waitlist to be notified when volunteering opens.
                        </p>
                        <Button className="w-full" onClick={() => router.push('/waitlist')}>
                            Join the Waitlist
                        </Button>
                    </div>
                )}

                {(role === 'ngo' || role === 'admin') && (
                    <form onSubmit={handleSubmit} className="grid gap-4 animate-in fade-in-0">
                        {error && (
                        <div className="text-sm text-red-500 text-center font-medium bg-red-100 p-2 rounded-md">
                            {error}
                        </div>
                        )}
                        <p className="text-sm text-center text-muted-foreground">
                          {role === 'admin' ? 'Create a platform administrator account.' : 'Register your organization.'}
                        </p>
                        <div className="grid gap-2">
                        <Label htmlFor="full-name">{role === 'admin' ? 'Full Name' : 'Organization Name'}</Label>
                        <Input
                            id="full-name"
                            placeholder={role === 'admin' ? 'Priya Sharma' : 'Green Earth Foundation'}
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : `Register as ${role.toUpperCase()}`}
                        </Button>
                        <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignup}>
                            Sign up with Google
                        </Button>
                    </form>
                )}
            </div>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
