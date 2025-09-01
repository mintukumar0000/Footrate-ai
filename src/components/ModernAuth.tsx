import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { ParticleBackground } from '@/components/ParticleBackground'
import { PasswordReset } from '@/components/PasswordReset'
import { 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  Brain,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Zap
} from 'lucide-react'

interface ModernAuthProps {
  onAuthSuccess: () => void
  onBack: () => void
}

export const ModernAuth = ({ onAuthSuccess, onBack }: ModernAuthProps) => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      })

      if (error) throw error

      toast({
        title: "🎉 Welcome to FootRate AI!",
        description: "Check your email to confirm your account and start analyzing!",
      })
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      onAuthSuccess()
      toast({
        title: "🚀 Welcome back!",
        description: "Ready for some AI-powered foot analysis?",
      })
    } catch (error: any) {
      toast({
        title: "Sign In Error", 
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Show password reset form if requested
  if (showPasswordReset) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <ParticleBackground />
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-transparent to-blue-950/30 pointer-events-none z-10"></div>
        <div className="relative z-20 w-full max-w-sm sm:max-w-md">
          <PasswordReset onBack={() => setShowPasswordReset(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <ParticleBackground />
      
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-transparent to-blue-950/30 pointer-events-none z-10"></div>

      <div className="relative z-20 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 sm:mb-8 text-gray-400 hover:text-blue-200 bg-black/40 backdrop-blur-xl border border-blue-300/10 hover:border-blue-300/30 transition-all duration-500 text-sm sm:text-base"
        >
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 rotate-180" />
          <span className="font-light">Back to Landing</span>
        </Button>

        <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 shadow-2xl rounded-2xl sm:rounded-3xl">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <div className="mx-auto w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-black/80 border border-blue-300/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl">
                <Brain className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-blue-300" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-3xl font-light text-white mb-2 sm:mb-3 tracking-wide">
                Join FootRate AI
              </h1>
              <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed">
                Experience real AI-powered foot analysis
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:justify-center sm:gap-6 lg:gap-8 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-400 font-light">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                  <span>100% Private</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="signin" className="space-y-4 sm:space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-black/60 backdrop-blur-xl border border-blue-300/10 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-black/80 data-[state=active]:border data-[state=active]:border-blue-300/30 data-[state=active]:text-blue-100 rounded-lg sm:rounded-xl font-light transition-all duration-300 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-black/80 data-[state=active]:border data-[state=active]:border-blue-300/30 data-[state=active]:text-blue-100 rounded-lg sm:rounded-xl font-light transition-all duration-300 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signin-email" className="text-sm sm:text-base text-gray-300 font-light">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-3 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 sm:pl-12 bg-black/60 backdrop-blur-xl border border-blue-300/20 focus:border-blue-300/50 text-white placeholder:text-gray-400 rounded-xl sm:rounded-2xl h-10 sm:h-12 text-sm sm:text-base font-light"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signin-password" className="text-sm sm:text-base text-gray-300 font-light">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 sm:left-4 top-3 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 sm:pl-12 pr-10 sm:pr-12 bg-black/60 backdrop-blur-xl border border-blue-300/20 focus:border-blue-300/50 text-white placeholder:text-gray-400 rounded-xl sm:rounded-2xl h-10 sm:h-12 text-sm sm:text-base font-light"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-3 sm:top-3.5 text-gray-500 hover:text-blue-300 transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black/70 backdrop-blur-xl border border-blue-300/30 text-blue-100 hover:bg-black/80 hover:border-blue-300/50 hover:text-white transition-all duration-500 py-4 sm:py-6 text-sm sm:text-base lg:text-lg font-light rounded-xl sm:rounded-2xl shadow-2xl mt-4 sm:mt-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin"></div>
                        <span className="tracking-wide">Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="tracking-wide">Sign In to Analyze</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    )}
                  </Button>
                </form>
                
                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-sm text-gray-400 hover:text-blue-300 transition-colors duration-300 underline decoration-gray-600 hover:decoration-blue-300"
                  >
                    Forgot your password?
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signup-username" className="text-sm sm:text-base text-gray-300 font-light">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-3 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                      <Input
                        id="signup-username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        className="pl-10 sm:pl-12 bg-black/60 backdrop-blur-xl border border-blue-300/20 focus:border-blue-300/50 text-white placeholder:text-gray-400 rounded-xl sm:rounded-2xl h-10 sm:h-12 text-sm sm:text-base font-light"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signup-email" className="text-sm sm:text-base text-gray-300 font-light">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-3 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 sm:pl-12 bg-black/60 backdrop-blur-xl border border-blue-300/20 focus:border-blue-300/50 text-white placeholder:text-gray-400 rounded-xl sm:rounded-2xl h-10 sm:h-12 text-sm sm:text-base font-light"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="signup-password" className="text-sm sm:text-base text-gray-300 font-light">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 sm:left-4 top-3 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 sm:pl-12 pr-10 sm:pr-12 bg-black/60 backdrop-blur-xl border border-blue-300/20 focus:border-blue-300/50 text-white placeholder:text-gray-400 rounded-xl sm:rounded-2xl h-10 sm:h-12 text-sm sm:text-base font-light"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-3 sm:top-3.5 text-gray-500 hover:text-blue-300 transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="bg-black/60 backdrop-blur-xl border border-blue-300/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2">
                    <p className="text-xs sm:text-sm font-light text-gray-300 mb-2">What you get:</p>
                    <div className="space-y-1 sm:space-y-2">
                      {[
                        "Real AI analysis with OpenAI GPT-4o",
                        "Instant professional foot assessment",
                        "Detailed improvement recommendations",
                        "Analysis history tracking"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                          <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />
                          <span className="font-light">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-black py-4 sm:py-6 text-sm sm:text-base lg:text-lg font-medium rounded-xl sm:rounded-2xl border-0 shadow-2xl transition-all duration-500 mt-4 sm:mt-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span className="tracking-wide">Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="tracking-wide">Start Analyzing Now</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-blue-300/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs text-gray-500">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span className="font-light">Privacy Protected</span>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Brain className="w-3 h-3 text-blue-400" />
                  <span className="font-light">AI Powered</span>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                  <span className="font-light">Medical Grade</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
