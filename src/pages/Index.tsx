import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LandingPage } from '@/components/LandingPage'
import { ModernAuth } from '@/components/ModernAuth'
import { PhotoUpload } from '@/components/PhotoUpload'
import { DetailedAnalysisDisplay } from '@/components/DetailedAnalysisDisplay'
import { UserProfile } from '@/components/UserProfile'
import { RatingHistory } from '@/components/RatingHistory'
import { ParticleBackground } from '@/components/ParticleBackground'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Shield, Award, Brain, BarChart3, Settings, LogOut, ArrowRight, Menu } from 'lucide-react'
import { RealFootAnalysisResult } from '@/lib/realFootAnalysisAI'
import { SubscriptionService } from '@/lib/subscriptionService'

type AppState = 'landing' | 'auth' | 'dashboard'

const Index = () => {
  const { user, loading, signOut } = useAuth()
  const [currentAnalysis, setCurrentAnalysis] = useState<RealFootAnalysisResult | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [analysisCount, setAnalysisCount] = useState(0)
  const [appState, setAppState] = useState<AppState>('landing')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)

  // Fetch subscription status when user is available
  useEffect(() => {
    if (user?.id) {
      SubscriptionService.getSubscriptionStatus(user.id).then(setSubscription).catch(console.error);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-20 flex items-center gap-4 text-gray-900">
          <Brain className="w-10 h-10 animate-pulse text-blue-600" />
          <span className="text-3xl font-thin tracking-wide">
            <span className="text-gray-900">Loading </span>
            <span className="text-blue-600">FootRate AI</span>
            <span className="text-gray-500">...</span>
          </span>
        </div>
      </div>
    )
  }

  // Show landing page if no user and not explicitly showing auth
  if (!user && appState !== 'auth') {
    return <LandingPage onGetStarted={() => setAppState('auth')} />
  }

  // Show auth page if requested
  if (!user && appState === 'auth') {
    return (
      <ModernAuth 
        onAuthSuccess={() => setAppState('dashboard')}
        onBack={() => setAppState('landing')}
      />
    )
  }

  // Modern Dashboard for authenticated users
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/50 via-transparent to-blue-50/20 pointer-events-none z-10"></div>
      
      {/* Navigation Bar */}
      <nav className="relative z-30 bg-black rounded-xl shadow-2xl max-w-xl mx-8 sm:mx-auto mt-6 sm:mt-8 mb-16 sm:mb-20 lg:mb-24">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold tracking-wider">
                  <span className="text-white">Foot</span>
                  <span className="text-blue-500">Rate</span>
                  <span className="text-white"> AI</span>
                </div>
              </div>
            </div>

            {/* OpenAI Status - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-5 ml-auto mr-3">
              <div className="flex items-center gap-2 text-white font-medium">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                <span>OpenAI GPT-4o Active</span>
              </div>
            </div>

            {/* Right-side Actions (always right-aligned) */}
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-blue-400 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 p-1.5 sm:p-2 rounded-xl"
              >
                <Settings className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-white hover:text-red-400 bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/30 transition-all duration-300 p-1.5 sm:p-2 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
              {/* Mobile Menu Button */}
              <Button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-8 h-8 bg-white rounded-xl flex items-center justify-center"
              >
                <Menu className="w-4 h-4 text-black" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 bg-white rounded-xl p-3 space-y-2.5 border border-gray-200 mx-1">
              <div className="flex items-center gap-2 text-gray-900 font-medium py-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                <span>OpenAI GPT-4o Active</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-gray-900 hover:text-blue-500 bg-gray-100 hover:bg-blue-50 transition-colors duration-300 py-2"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="w-full justify-start text-gray-900 hover:text-red-500 bg-gray-100 hover:bg-red-50 transition-colors duration-300 py-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>
      


      <div className="relative z-20 container mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border border-gray-200 p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{analysisCount}</div>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">AI Analyses</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black rounded-xl flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {currentAnalysis ? currentAnalysis.overallScore.toFixed(1) : '--'}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">Latest Score</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {currentAnalysis ? currentAnalysis.confidenceScore : '--'}%
                </div>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">AI Confidence</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-gray-200 p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black rounded-xl flex items-center justify-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Pro</div>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">Account Type</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Analysis Area */}
          <div className="xl:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
            <Card className="bg-white border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 rounded-xl shadow-sm">
              <div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3 tracking-wide">AI-Powered Foot Analysis</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-relaxed px-2 sm:px-0">Upload a photo for instant professional assessment</p>
              </div>
              <PhotoUpload 
                onAnalysisComplete={(analysis, imageUrl) => {
                  setCurrentAnalysis(analysis);
                  setOriginalImageUrl(imageUrl);
                  setAnalysisCount(prev => prev + 1);
                }}
                userId={user?.id}
              />
            </Card>
            
            {currentAnalysis && (
              <DetailedAnalysisDisplay 
                analysis={currentAnalysis} 
                isPaidUser={subscription?.currentTier === 'pro'}
                originalImageUrl={originalImageUrl || undefined}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* User Profile */}
            <Card className="bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg tracking-wide truncate">
                    {user?.user_metadata?.username || 'User'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                <span>Real AI Powered • Medical Grade</span>
              </div>
            </Card>
            
            {/* Analysis History */}
            <Card className="bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm">
              <RatingHistory userId={user?.id} />
            </Card>

            {/* AI Insights */}
            <Card className="bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-lg sm:text-xl tracking-wide">AI Insights</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 font-medium leading-relaxed">
                  Get personalized recommendations based on your analysis history
                </p>
                <div className="text-xs text-gray-500 font-medium">
                  Powered by OpenAI GPT-4o Vision
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index