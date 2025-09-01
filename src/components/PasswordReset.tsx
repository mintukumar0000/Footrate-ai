import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface PasswordResetProps {
  onBack: () => void;
}

export const PasswordReset = ({ onBack }: PasswordResetProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSent(true);
      toast({
        title: "Reset link sent! 📧",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    await handlePasswordReset({ preventDefault: () => {} } as React.FormEvent);
  };

  if (sent) {
    return (
      <Card className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-blue-300/20 rounded-2xl shadow-neon p-6 sm:p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle className="w-8 h-8 text-black" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-thin text-white tracking-wide">
              Check Your Email
            </h2>
            <p className="text-gray-400 text-sm">
              We've sent a password reset link to:
            </p>
            <p className="text-blue-300 font-medium">{email}</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-300/20 rounded-xl p-4">
              <div className="flex items-start gap-3 text-sm">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  <p className="font-medium mb-1">Email not received?</p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Link expires in 1 hour</li>
                    <li>• Make sure the email address is correct</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleResendEmail}
                disabled={loading}
                variant="outline"
                className="flex-1 bg-black/40 border-gray-600/30 text-gray-300 hover:bg-black/60 hover:text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend Email
              </Button>
              
              <Button
                onClick={onBack}
                variant="ghost"
                className="flex-1 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-blue-300/20 rounded-2xl shadow-neon p-6 sm:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <Mail className="w-8 h-8 text-black" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-thin text-white tracking-wide">
              Reset Password
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-black/40 border-gray-600/30 text-white placeholder-gray-500 focus:border-blue-400/50 focus:ring-blue-400/20"
              disabled={loading}
              required
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={loading || !email}
              className="flex-1 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-black font-medium py-3 rounded-xl shadow-xl transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={onBack}
              variant="ghost"
              className="flex-1 text-gray-400 hover:text-white"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};


