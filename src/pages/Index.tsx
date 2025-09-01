import { useState } from 'react'
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
import { Sparkles, Zap, Shield, Award, Brain, BarChart3, Settings, LogOut } from 'lucide-react'
import { RealFootAnalysisResult } from '@/lib/realFootAnalysisAI'

type AppState = 'landing' | 'auth' | 'dashboard'

const Index = () => {
  const { user, loading, signOut } = useAuth()
  const [currentAnalysis, setCurrentAnalysis] = useState<RealFootAnalysisResult | null>(null)
  const [analysisCount, setAnalysisCount] = useState(0)
  const [appState, setAppState] = useState<AppState>('landing')

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-20 flex items-center gap-4 text-white">
          <Brain className="w-10 h-10 animate-pulse text-blue-300" />
          <span className="text-3xl font-thin tracking-wide">
            <span className="text-white">Loading </span>
            <span className="text-blue-300">FootRate AI</span>
            <span className="text-gray-400">...</span>
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
      <div className="fixed inset-0 bg-gradient-to-br from-black/50 via-transparent to-blue-950/20 pointer-events-none z-10"></div>
      
      {/* Modern Header */}
      <header className="relative z-20 bg-black/40 backdrop-blur-2xl border-b border-blue-300/10">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/80 backdrop-blur-xl border border-blue-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-blue-300" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-light tracking-wider">
                  <span className="text-white">Foot</span>
                  <span className="text-blue-300 font-thin">Rate</span>
                  <span className="text-gray-400 text-base sm:text-lg ml-1 sm:ml-2">AI</span>
                </div>
                <p className="text-xs text-gray-400 font-light hidden sm:block">Real AI Analysis Dashboard</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-gray-400 font-light">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                  <span>OpenAI GPT-4o Active</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-blue-200 bg-black/40 backdrop-blur-xl border border-blue-300/10 hover:border-blue-300/30 transition-all duration-500 p-2 sm:p-2.5"
                >
                  <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="text-gray-400 hover:text-red-300 bg-black/40 backdrop-blur-xl border border-blue-300/10 hover:border-red-300/30 transition-all duration-500 p-2 sm:p-2.5"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-20 container mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black/80 border border-blue-300/20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-thin text-white">{analysisCount}</div>
                <p className="text-xs sm:text-sm text-gray-400 font-light">AI Analyses</p>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black/80 border border-blue-300/20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-thin text-white">
                  {currentAnalysis ? currentAnalysis.overallScore.toFixed(1) : '--'}
                </div>
                <p className="text-xs sm:text-sm text-gray-400 font-light">Latest Score</p>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black/80 border border-blue-300/20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-thin text-white">
                  {currentAnalysis ? currentAnalysis.confidenceScore : '--'}%
                </div>
                <p className="text-xs sm:text-sm text-gray-400 font-light">AI Confidence</p>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-black/80 border border-blue-300/20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-thin text-white">Pro</div>
                <p className="text-xs sm:text-sm text-gray-400 font-light">Account Type</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Analysis Area */}
          <div className="xl:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
            <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl">
              <div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl font-thin text-white mb-1 sm:mb-2 md:mb-3 tracking-wide">AI-Powered Foot Analysis</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 font-light leading-relaxed px-2 sm:px-0">Upload a photo for instant professional assessment</p>
              </div>
              <PhotoUpload 
                onAnalysisComplete={(analysis) => {
                  setCurrentAnalysis(analysis);
                  setAnalysisCount(prev => prev + 1);
                }}
                userId={user?.id}
              />
            </Card>
            
            {currentAnalysis && (
              <DetailedAnalysisDisplay analysis={currentAnalysis} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* User Profile */}
            <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-black/80 border border-blue-300/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl">
                  <span className="text-lg sm:text-xl font-light text-blue-300">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-light text-white text-base sm:text-lg tracking-wide truncate">
                    {user?.user_metadata?.username || 'User'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-light truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 font-light">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                <span>Real AI Powered • Medical Grade</span>
              </div>
            </Card>
            
            {/* Analysis History */}
            <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
              <RatingHistory userId={user?.id} />
            </Card>

            {/* AI Insights */}
            <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-black/80 border border-blue-300/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-300" />
                </div>
                <h3 className="font-light text-white mb-2 sm:mb-3 text-lg sm:text-xl tracking-wide">AI Insights</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 font-light leading-relaxed">
                  Get personalized recommendations based on your analysis history
                </p>
                <div className="text-xs text-gray-500 font-light">
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