import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ParticleBackground } from '@/components/ParticleBackground';
import { SubscriptionService } from '@/lib/subscriptionService';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Shield, 
  Award, 
  ArrowRight, 
  CheckCircle,
  Users,
  TrendingUp,
  Star,
  Camera,
  Eye,
  Target,
  Heart,
  Activity
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { toast } = useToast();

  const handleUpgradeClick = async () => {
    setLoadingPayment(true);
    try {
      // For landing page visitors, we need to create a temporary user ID
      // or redirect them to sign up first
      const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store temp user info for after payment
      localStorage.setItem('temp_upgrade_user', tempUserId);
      
      // Initiate payment
      const paymentUrl = await SubscriptionService.initiateDodoPayment(tempUserId, 'pro');
      
      // Redirect to payment
      window.open(paymentUrl, '_blank');
      
      toast({
        title: "🚀 Redirecting to Payment",
        description: "Complete your payment to unlock Pro features!",
      });
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setLoadingPayment(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Real AI Vision",
      description: "OpenAI GPT-4o analyzes your foot images with medical precision"
    },
    {
      icon: Eye,
      title: "Smart Detection", 
      description: "Automatically validates images and rejects non-foot photos"
    },
    {
      icon: Target,
      title: "5-Factor Analysis",
      description: "Comprehensive evaluation of skin, nails, structure, symmetry & cleanliness"
    },
    {
      icon: Heart,
      title: "Medical Standards",
      description: "Assessment based on podiatrist-approved health metrics"
    }
  ];

  const benefits = [
    "Real AI-powered analysis using OpenAI GPT-4o Vision",
    "Instant professional-grade foot health assessment",
    "Detailed breakdown with improvement recommendations", 
    "Secure analysis with no data storage on servers",
    "Track progress with comprehensive history",
    "Medical-grade confidence scoring"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/50 via-transparent to-blue-950/20 pointer-events-none z-10"></div>

      <div className="relative z-20">
        {/* Header */}
        <header className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-blue-300/30 flex items-center justify-center shadow-2xl group hover:scale-105 transition-all duration-300">
                {/* Foot Icon Base */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-400/10 to-cyan-400/10"></div>
                
                {/* Main Logo - Stylized Foot with AI Brain */}
                <div className="relative flex items-center justify-center">
                  {/* Foot outline */}
                  <svg width="20" height="20" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <ellipse cx="12" cy="18" rx="6" ry="4" />
                    <ellipse cx="12" cy="12" rx="4" ry="6" />
                    <circle cx="10" cy="8" r="1" fill="currentColor" />
                    <circle cx="14" cy="8" r="1" fill="currentColor" />
                    <circle cx="8" cy="10" r="0.5" fill="currentColor" />
                    <circle cx="16" cy="10" r="0.5" fill="currentColor" />
                    <circle cx="12" cy="6" r="0.5" fill="currentColor" />
                  </svg>
                  
                  {/* AI Brain overlay */}
                  <Brain className="absolute w-2 h-2 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-cyan-400 opacity-80 top-0 right-0" />
                  
                  {/* Sparkle effects */}
                  <Sparkles className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 text-blue-400 opacity-60 -top-1 -left-1 animate-pulse" />
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-light tracking-wider">
                <span className="text-white">Foot</span>
                <span className="text-blue-300 font-thin">Rate</span>
                <span className="text-gray-400 text-sm sm:text-base lg:text-lg ml-1 sm:ml-2">AI</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-gray-400 font-light">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Real AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure</span>
                </div>
              </div>
              <Button 
                onClick={onGetStarted}
                className="bg-black/80 backdrop-blur-xl border border-blue-300/30 text-blue-200 hover:bg-black/90 hover:border-blue-300/50 hover:text-blue-100 transition-all duration-500 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 text-sm sm:text-base"
                size="sm"
              >
                <span className="font-light">Get Started</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </Button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-3 sm:px-6 py-12 sm:py-20 lg:py-32 text-center">
          <div className="max-w-7xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-black/60 backdrop-blur-2xl border border-blue-300/20 mb-8 sm:mb-12 shadow-2xl">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
              <span className="text-xs sm:text-sm font-light text-blue-200 tracking-wide">Powered by OpenAI GPT-4o Vision</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-thin mb-6 sm:mb-8 lg:mb-12 leading-none tracking-tight">
              <div className="text-white mb-2 sm:mb-4">The Future of</div>
              <div className="text-blue-300 font-extralight opacity-90">
                Foot Analysis
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-gray-400 mb-8 sm:mb-12 lg:mb-16 max-w-2xl sm:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              Professional-grade foot health assessment powered by artificial intelligence. 
              <br className="hidden sm:block" />
              Upload a photo and receive detailed medical-grade analysis in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
              <Button 
                onClick={onGetStarted}
                className="bg-black/70 backdrop-blur-2xl border border-blue-300/30 text-blue-100 hover:bg-black/80 hover:border-blue-300/50 hover:text-white transition-all duration-500 px-6 py-3 sm:px-8 sm:py-3 lg:px-12 lg:py-4 text-sm sm:text-base lg:text-lg font-light rounded-xl sm:rounded-2xl shadow-2xl w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                <span className="tracking-wide">Analyze My Foot</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
              </Button>
              
              <div className="flex items-center gap-2 sm:gap-3 text-gray-500 text-xs sm:text-sm font-light">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span>Free • Instant • Medical Grade</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 text-xs sm:text-sm text-gray-500 font-light max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span>10,000+ Analyses</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span>95% Accuracy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-3 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-thin text-white mb-4 sm:mb-6 tracking-wide">
              Real AI, Real Results
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto font-light leading-relaxed px-4 sm:px-0">
              Experience the power of genuine artificial intelligence with medical-grade precision
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  className={`p-4 sm:p-6 lg:p-8 bg-black/40 backdrop-blur-2xl border border-blue-300/10 hover:border-blue-300/30 transition-all duration-500 cursor-pointer rounded-xl sm:rounded-2xl shadow-2xl ${
                    activeFeature === index ? 'border-blue-300/50 bg-black/60' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-black/60 border border-blue-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-300" />
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-light text-white mb-2 sm:mb-3 tracking-wide">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-3 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-thin text-white mb-4 sm:mb-6 tracking-wide">
                Why Choose FootRate AI?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-light px-4 sm:px-0">
                Advanced technology meets medical expertise for unparalleled precision
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black/80 border border-blue-300/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1 shadow-xl">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-300" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              <Card className="p-6 sm:p-8 lg:p-10 bg-black/40 backdrop-blur-2xl border border-blue-300/20 rounded-2xl sm:rounded-3xl shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-black/80 border border-blue-300/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
                    <Activity className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-blue-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-white mb-3 sm:mb-4 tracking-wide">Live Demo</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 font-light leading-relaxed">
                    Experience FootRate AI with real-time analysis
                  </p>
                  <Button 
                    onClick={onGetStarted}
                    className="w-full bg-black/70 backdrop-blur-xl border border-blue-300/30 text-blue-100 hover:bg-black/80 hover:border-blue-300/50 hover:text-white transition-all duration-500 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-xl sm:rounded-2xl"
                  >
                    <span className="tracking-wide">Try It Now</span>
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-3 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-thin text-white mb-4 sm:mb-6 tracking-wide">
                Choose Your Plan
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-light leading-relaxed px-4 sm:px-0">
                Start free and upgrade when you need more analyses
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/20 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-black/80 border border-blue-300/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                    <Eye className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-white mb-2 tracking-wide">Free</h3>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-thin text-white mb-2">$0</div>
                  <p className="text-sm sm:text-base text-gray-400 font-light mb-6 sm:mb-8">Perfect for trying out</p>
                  
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">3 AI image analyses</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Real AI-powered analysis</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">5-factor health assessment</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Detailed improvement tips</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Analysis history</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Medical-grade scoring</span>
                    </div>
                  </div>

                  <Button 
                    onClick={onGetStarted}
                    className="w-full bg-black/70 backdrop-blur-xl border border-blue-300/30 text-blue-100 hover:bg-black/80 hover:border-blue-300/50 hover:text-white transition-all duration-500 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-xl sm:rounded-2xl"
                  >
                    <span className="tracking-wide">Get Started Free</span>
                  </Button>
                </div>
              </Card>

              {/* Pro Plan */}
              <Card className="bg-black/40 backdrop-blur-2xl border border-blue-300/30 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative">
                {/* Popular Badge */}
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-black px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                    Most Popular
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-white mb-2 tracking-wide">Pro</h3>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-thin text-white mb-2">$9</div>
                  <p className="text-sm sm:text-base text-gray-400 font-light mb-6 sm:mb-8">For serious foot care</p>
                  
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">50 AI image analyses</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Everything in Free plan</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Priority AI processing</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Advanced analytics dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Progress tracking graphs</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Export analysis reports</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Premium support</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-300 font-light">Early access to new features</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleUpgradeClick}
                    disabled={loadingPayment}
                    className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-black hover:from-blue-500 hover:to-cyan-500 transition-all duration-500 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl sm:rounded-2xl shadow-xl"
                  >
                    {loadingPayment ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span className="tracking-wide">Processing...</span>
                      </div>
                    ) : (
                      <>
                        <span className="tracking-wide">Upgrade to Pro</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Money Back Guarantee */}
            <div className="text-center mt-8 sm:mt-12">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-black/40 backdrop-blur-xl border border-blue-300/10">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span className="text-xs sm:text-sm text-gray-400 font-light">30-day money-back guarantee</span>
              </div>
            </div>

            {/* Open Source Section */}
            <div className="text-center mt-8 sm:mt-12">
              <div className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl border border-green-300/30 hover:border-green-300/50 transition-all duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Open Source</h3>
                  <p className="text-xs sm:text-sm text-gray-300 font-light">Contribute to FootRate AI on GitHub</p>
                </div>
                <a 
                  href="https://github.com/mintukumar0000/footrate-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 sm:ml-4 px-4 sm:px-6 py-2 sm:py-3 bg-black/40 hover:bg-black/60 border border-green-300/30 hover:border-green-300/50 rounded-full text-xs sm:text-sm text-green-300 hover:text-white transition-all duration-300"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-blue-300/10 bg-black/20 backdrop-blur-2xl">
          <div className="container mx-auto px-3 sm:px-6 py-8 sm:py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black/80 border border-blue-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                  <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-blue-300" />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-light tracking-wider">
                  <span className="text-white">Foot</span>
                  <span className="text-blue-300 font-thin">Rate</span>
                  <span className="text-gray-400 text-sm sm:text-base lg:text-lg ml-1 sm:ml-2">AI</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-400 font-light">
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  <span>Powered by OpenAI</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  <span>Medical Grade</span>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-blue-300/10">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-light text-white mb-3 sm:mb-4">Contact Us</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-light">Get in touch with us</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                {/* Email */}
                <a 
                  href="mailto:heyquixy@gmail.com"
                  className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-black/40 backdrop-blur-xl border border-blue-300/20 hover:border-blue-300/40 transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>heyquixy@gmail.com</span>
                </a>

                {/* Twitter/X */}
                <a 
                  href="https://x.com/Mintu_aa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-black/40 backdrop-blur-xl border border-blue-300/20 hover:border-blue-300/40 transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>@Mintu_aa</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/mintu-nee-3bb156317/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-black/40 backdrop-blur-xl border border-blue-300/20 hover:border-blue-300/40 transition-all duration-300 text-xs sm:text-sm text-gray-300 hover:text-white"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-blue-300/10 text-center text-gray-500 text-xs sm:text-sm font-light">
              © 2024 FootRate AI. Real AI-powered foot analysis with medical-grade precision.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
