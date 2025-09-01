import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, ArrowRight, Sparkles, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionService } from '@/lib/subscriptionService';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  
  const sessionId = searchParams.get('session');
  const plan = searchParams.get('plan') || 'pro';
  const mode = searchParams.get('mode');
  const userId = searchParams.get('userId');
  const upgrade = searchParams.get('upgrade') === 'true';

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!sessionId) return;
      
      setLoading(true);
      try {
        // Handle test mode
        if (mode === 'test') {
          console.log('Processing test mode upgrade');
          
          // Get current user from Supabase
          const { data: { user } } = await import('@supabase/supabase-js').then(({ createClient }) => {
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            return supabase.auth.getUser();
          });
          
          if (user) {
            // Upgrade the user to Pro immediately (test mode)
            await SubscriptionService.handlePaymentSuccess(user.id, sessionId, plan as 'pro');
            
            toast({
              title: "🎉 Test Upgrade Successful!",
              description: "You now have Pro access (test mode - no payment charged)!",
            });
          } else {
            toast({
              title: "🎉 Test Mode Complete!",
              description: "Test upgrade completed - no payment was charged!",
            });
          }
          
          setUpgraded(true);
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
          
          return;
        }

        // Handle real Dodo Payment success
        if (mode === 'production') {
          console.log('Processing real Dodo Payment success');
          
          // Get current user from Supabase
          const { data: { user } } = await import('@supabase/supabase-js').then(({ createClient }) => {
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            return supabase.auth.getUser();
          });
          
          if (user) {
            // Upgrade the user to Pro
            await SubscriptionService.handlePaymentSuccess(user.id, sessionId, plan as 'pro');
            
            toast({
              title: "🎉 Payment Successful!",
              description: "Your Pro subscription is now active!",
            });
          } else {
            toast({
              title: "🎉 Payment Received!",
              description: "Please sign in to activate your Pro features!",
            });
          }
          
          setUpgraded(true);
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
          
          return;
        }

        // Handle immediate upgrade simulation
        if (mode === 'simulation' && upgrade) {
          console.log('Processing immediate upgrade simulation');
          
          // Get current user from Supabase
          const { data: { user } } = await import('@supabase/supabase-js').then(({ createClient }) => {
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            return supabase.auth.getUser();
          });
          
          if (user) {
            // Upgrade the user to Pro immediately
            await SubscriptionService.handlePaymentSuccess(user.id, sessionId, plan as 'pro');
            
            toast({
              title: "🎉 Upgrade Successful!",
              description: "You now have Pro access with 50 AI analyses per month!",
            });
          } else {
            // For users without accounts, simulate success
            toast({
              title: "🎉 Upgrade Simulation Complete!",
              description: "Sign up for a real account to get actual Pro features!",
            });
          }
          
          setUpgraded(true);
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
          
          return;
        }

        // Handle fallback mode
        if (mode === 'fallback') {
          console.log('Processing fallback upgrade');
          
          const { data: { user } } = await import('@supabase/supabase-js').then(({ createClient }) => {
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            return supabase.auth.getUser();
          });
          
          if (user) {
            await SubscriptionService.handlePaymentSuccess(user.id, sessionId, plan as 'pro');
            
            toast({
              title: "🎉 Upgrade Successful!",
              description: "Your account has been upgraded to Pro!",
            });
          }
          
          setUpgraded(true);
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
          
          return;
        }

        // Handle legacy payment success
        const pendingUserId = localStorage.getItem('dodo_pending_user_id');
        const pendingPlan = localStorage.getItem('dodo_pending_plan') || plan;
        
        if (pendingUserId) {
          await SubscriptionService.handlePaymentSuccess(pendingUserId, sessionId, pendingPlan as 'pro');
          
          // Clear pending payment data
          localStorage.removeItem('dodo_pending_payment');
          localStorage.removeItem('dodo_pending_user_id');
          localStorage.removeItem('dodo_pending_plan');
          
          toast({
            title: "🎉 Payment Successful!",
            description: "Your Pro subscription is now active!",
          });
        } else {
          toast({
            title: "🎉 Upgrade Complete!",
            description: "Welcome to FootRate AI Pro!",
          });
        }
        
        setUpgraded(true);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        
      } catch (error: any) {
        console.error('Payment success handling error:', error);
        toast({
          title: "Upgrade Error",
          description: error.message || "Failed to upgrade account. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [sessionId, plan, mode, userId, upgrade, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-blue-300/20 rounded-2xl shadow-neon p-8 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <div className="w-8 h-8 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            </div>
            <div>
              <h2 className="text-2xl font-thin text-white tracking-wide mb-2">
                Processing Payment...
              </h2>
              <p className="text-gray-400 text-sm">
                Please wait while we upgrade your account to Pro
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (upgraded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-blue-300/20 rounded-2xl shadow-neon p-8 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-thin text-white tracking-wide">
                🎉 Welcome to Pro!
              </h2>
              <p className="text-gray-400 text-sm">
                {mode === 'production' 
                  ? 'Your Pro subscription is now active!' 
                  : mode === 'simulation'
                  ? 'Your account has been upgraded to Pro!'
                  : 'Welcome to FootRate AI Pro!'}
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-300/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Pro Plan Activated</span>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>50 AI analyses per month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Priority processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Premium support</span>
                </div>
              </div>
            </div>

            {mode === 'production' && (
              <div className="bg-green-900/20 border border-green-300/20 rounded-xl p-3">
                <p className="text-green-300 text-xs">
                  ✅ Real payment processed through Dodo Payment
                </p>
              </div>
            )}

            {mode === 'test' && (
              <div className="bg-yellow-900/20 border border-yellow-300/20 rounded-xl p-3">
                <p className="text-yellow-300 text-xs">
                  🧪 Test mode - no real payment was charged
                </p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                Redirecting to dashboard in a few seconds...
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-black font-medium py-3 rounded-xl shadow-xl transition-all duration-300"
              >
                <Brain className="w-4 h-4 mr-2" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-red-300/20 rounded-2xl shadow-neon p-8 text-center">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <Brain className="w-8 h-8 text-black" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-thin text-white tracking-wide">
              Payment Error
            </h2>
            <p className="text-gray-400 text-sm">
              Something went wrong with your payment
            </p>
          </div>

          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="w-full border-gray-600/30 text-gray-300 hover:text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
