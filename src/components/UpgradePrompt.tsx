import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Sparkles, 
  Zap, 
  Crown, 
  ArrowRight, 
  CheckCircle,
  Star,
  Camera,
  BarChart3,
  Shield
} from 'lucide-react'
import { SubscriptionService } from '@/lib/subscriptionService'

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  currentUsage: number
  monthlyLimit: number
}

export const UpgradePrompt = ({ isOpen, onClose, userId, currentUsage, monthlyLimit }: UpgradePromptProps) => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      // Initiate Dodo Payment
      const paymentUrl = await SubscriptionService.initiateDodoPayment(userId, 'pro')
      
      // Redirect to Dodo Payment
      window.open(paymentUrl, '_blank')
      
      toast({
        title: "🚀 Redirecting to Payment",
        description: "Complete your payment to unlock Pro features!",
      })
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="bg-black/90 backdrop-blur-2xl border border-blue-300/30 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden relative flex flex-col">
        {/* Close Button - Fixed Position */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          ✕
        </button>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-12">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
          </div>
          
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30 mb-3 sm:mb-4 text-xs sm:text-sm">
            Limit Reached
          </Badge>
          
          <h2 className="text-2xl sm:text-3xl font-thin text-white mb-2 sm:mb-3 tracking-wide">
            Upgrade to Pro
          </h2>
          
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed px-2">
            You've used all <span className="text-blue-300 font-medium">{currentUsage}/{monthlyLimit}</span> analyses this month.
            Upgrade to Pro for unlimited AI-powered foot analysis!
          </p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Current Plan */}
          <div className="bg-black/40 border border-gray-600/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="text-center">
              <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-1 sm:mb-2" />
              <div className="text-sm sm:text-lg font-light text-gray-300">Free</div>
              <div className="text-xl sm:text-2xl font-thin text-white">3</div>
              <div className="text-xs text-gray-500">analyses/month</div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 relative">
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
            </div>
            <div className="text-center">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300 mx-auto mb-1 sm:mb-2" />
              <div className="text-sm sm:text-lg font-light text-blue-300">Pro</div>
              <div className="text-xl sm:text-2xl font-thin text-white">50</div>
              <div className="text-xs text-blue-200">analyses/month</div>
            </div>
          </div>
        </div>

        {/* Pro Features */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-light text-white mb-3 sm:mb-4 text-center">Pro Features</h3>
          <div className="space-y-2 sm:space-y-3">
            {[
              "50 AI analyses per month",
              "Everything in Free plan",
              "Priority AI processing",
              "Advanced analytics dashboard", 
              "Progress tracking graphs",
              "Export analysis reports",
              "Premium support",
              "Early access to new features"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300 font-light">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-black/60 border border-blue-300/20 rounded-full px-4 py-2 sm:px-6 sm:py-3">
            <span className="text-xl sm:text-2xl font-thin text-white">$9</span>
            <span className="text-xs sm:text-sm text-gray-400">/month</span>
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 ml-2" />
          </div>
          <p className="text-xs text-gray-500 mt-2">30-day money-back guarantee</p>
        </div>
        
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="flex-shrink-0 border-t border-blue-300/20 p-4 sm:p-6 bg-black/40 backdrop-blur-xl">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full sm:flex-1 bg-black/40 border border-gray-600/30 text-gray-300 hover:bg-black/60 hover:text-white transition-all duration-300 py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base"
            >
              Maybe Later
            </Button>
            
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-black font-medium py-3 rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Upgrade to Pro</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              )}
            </Button>
          </div>

          {/* Payment Info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Secure payment via Dodo Payment</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
