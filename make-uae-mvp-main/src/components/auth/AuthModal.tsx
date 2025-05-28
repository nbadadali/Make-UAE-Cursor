import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'sign-in' | 'sign-up' | 'reset-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (mode) {
        case 'sign-in':
          await signIn(email, password);
          toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.',
          });
          onClose();
          break;

        case 'sign-up':
          await signUp(email, password, fullName);
          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account.',
          });
          onClose();
          break;

        case 'reset-password':
          await resetPassword(email);
          toast({
            title: 'Password reset email sent',
            description: 'Please check your email for password reset instructions.',
          });
          onClose();
          break;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'sign-in' ? 'Sign In' : mode === 'sign-up' ? 'Create Account' : 'Reset Password'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'sign-up' && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {mode !== 'reset-password' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : mode === 'sign-up' ? 'Create Account' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {mode === 'sign-in' ? (
            <>
              <Button
                variant="link"
                onClick={() => setMode('reset-password')}
                className="text-sm text-gray-600"
              >
                Forgot password?
              </Button>
              <div>
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Button
                  variant="link"
                  onClick={() => setMode('sign-up')}
                  className="text-sm"
                >
                  Sign up
                </Button>
              </div>
            </>
          ) : mode === 'sign-up' ? (
            <div>
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Button
                variant="link"
                onClick={() => setMode('sign-in')}
                className="text-sm"
              >
                Sign in
              </Button>
            </div>
          ) : (
            <Button
              variant="link"
              onClick={() => setMode('sign-in')}
              className="text-sm"
            >
              Back to sign in
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 