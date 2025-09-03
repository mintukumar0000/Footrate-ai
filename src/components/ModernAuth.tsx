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
      <div className="fixed inset-0 bg-gradient-to-br from-white/50 via-transparent to-blue-50/20 pointer-events-none z-10"></div>

      <div className="relative z-20 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 sm:mb-8 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 text-sm sm:text-base rounded-xl"
        >
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 rotate-180" />
          <span className="font-medium">Back to Landing</span>
        </Button>

        <Card className="bg-white border border-gray-200 rounded-xl">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <div className="mx-auto w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-black rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                <Brain className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-wide">
                Join FootRate AI
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                Experience real AI-powered foot analysis
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:justify-center sm:gap-6 lg:gap-8 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 font-medium">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                  <span>100% Private</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="signin" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-2 rounded-xl border border-gray-200">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border data-[state=active]:border-gray-200 rounded-lg font-bold transition-all duration-300 text-sm sm:text-base py-3 px-4"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border data-[state=active]:border-gray-200 rounded-lg font-bold transition-all duration-300 text-sm sm:text-base py-3 px-4"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-8">
                <form onSubmit={handleSignIn} className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="signin-email" className="text-sm sm:text-base text-gray-800 font-semibold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-500 rounded-xl h-12 text-sm sm:text-base font-medium shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="signin-password" className="text-sm sm:text-base text-gray-800 font-semibold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-500 rounded-xl h-12 text-sm sm:text-base font-medium shadow-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black text-white border border-black hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 py-4 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] mt-8"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="tracking-wide">Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5" />
                        <span className="tracking-wide">Sign In to Analyze</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
                
                {/* Forgot Password Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300 underline decoration-gray-400 hover:decoration-blue-500 font-medium"
                  >
                    Forgot your password?
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-8">
                <form onSubmit={handleSignUp} className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="signup-username" className="text-sm sm:text-base text-gray-800 font-semibold">Username</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        className="pl-12 bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-500 rounded-xl h-12 text-sm sm:text-base font-medium shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="signup-email" className="text-sm sm:text-base text-gray-800 font-semibold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-500 rounded-xl h-12 text-sm sm:text-base font-medium shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="signup-password" className="text-sm sm:text-base text-gray-800 font-semibold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-12 pr-12 bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-500 rounded-xl h-12 text-sm sm:text-base font-medium shadow-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
                    <p className="text-sm font-semibold text-gray-800 mb-4">What you get:</p>
                    <div className="space-y-3">
                      {[
                        "Real AI analysis with OpenAI GPT-4o",
                        "Instant professional foot assessment",
                        "Detailed improvement recommendations",
                        "Analysis history tracking"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black text-white border border-black hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 py-4 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] mt-8"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="tracking-wide">Creating account...</span>
                      </div>
                    ) : (
                                              <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-4" />
                          <span className="tracking-wide">Start Analyzing Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">Privacy Protected</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">AI Powered</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">Medical Grade</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
