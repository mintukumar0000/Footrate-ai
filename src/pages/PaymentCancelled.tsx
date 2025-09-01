import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, Crown } from 'lucide-react'

export const PaymentCancelled = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center bg-black/80 backdrop-blur-xl border border-blue-300/30">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-light text-white mb-2">Payment Cancelled</h1>
          
          <p className="text-gray-400 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="bg-blue-500/10 rounded-lg p-4 mb-6 border border-blue-500/20">
          <h3 className="text-sm font-medium text-blue-300 mb-2">Pro Features Still Available:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• 50 AI analyses per month</li>
            <li>• Priority processing</li>
            <li>• Advanced analytics</li>
            <li>• Export reports</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-black font-medium"
          >
            <Crown className="w-4 h-4 mr-2" />
            Try Pro Again
          </Button>
          
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white border border-gray-600/30 hover:bg-black/40"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}


