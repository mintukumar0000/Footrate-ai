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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="fixed inset-0 bg-gradient-to-br from-white/50 via-transparent to-blue-50/20 pointer-events-none z-10"></div>

      <div className="relative z-20">
        {/* Header */}
        <header className="container mx-auto px-3 sm:px-6 py-6 sm:py-8">
          <div className="flex justify-center">
            <nav className="bg-black rounded-xl px-2 sm:px-3 py-2 sm:py-3 shadow-xl border border-gray-800 max-w-3xl w-full relative">
              <div className="flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-4.5 h-4.5 sm:w-6.5 sm:h-6.5 text-black" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    <span className="text-white">Foot</span>
                    <span className="text-blue-500">Rate</span>
                    <span className="text-white"> AI</span>
                  </div>
                </div>
                
                {/* Navigation Links - Left aligned and bold */}
                <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-auto mr-3">
                  <a 
                    href="#why-choose" 
                    className="text-white font-bold hover:text-blue-400 transition-colors duration-200 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Features
                  </a>
                  <a 
                    href="#pricing" 
                    className="text-white font-bold hover:text-blue-400 transition-colors duration-200 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Pricing
                  </a>
                  <a 
                    href="#footer" 
                    className="text-white font-bold hover:text-blue-400 transition-colors duration-200 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Contact Us
                  </a>
                </div>
                
                {/* CTA Button */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Button 
                    onClick={onGetStarted}
                    className="bg-white text-black border border-white hover:bg-gray-100 hover:border-gray-100 transition-all duration-300 px-2.5 sm:px-3 py-2 text-sm font-semibold rounded-xl shadow-lg"
                    size="sm"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-1.5" />
                  </Button>
                  
                  {/* Mobile Menu Button */}
                  <button 
                    className="md:hidden w-9 h-9 sm:w-11 sm:h-11 bg-gray-800 rounded-xl flex items-center justify-center"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-black rounded-xl border border-gray-800 shadow-xl z-50">
                  <div className="p-4 space-y-4">
                    <a 
                      href="#why-choose" 
                      className="block text-white font-bold hover:text-blue-400 transition-colors duration-200 text-center py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      Features
                    </a>
                    <a 
                      href="#pricing" 
                      className="block text-white font-bold hover:text-blue-400 transition-colors duration-200 text-center py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      Pricing
                    </a>
                    <a 
                      href="#footer" 
                      className="block text-white font-bold hover:text-blue-400 transition-colors duration-200 text-center py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      Contact Us
                    </a>
                    <div className="pt-2 border-t border-gray-700">
                      <Button 
                        onClick={() => {
                          onGetStarted();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-white text-black border border-white hover:bg-gray-100 hover:border-gray-100 transition-all duration-300 py-3 text-sm font-bold rounded-xl shadow-lg"
                        size="sm"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>
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
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-semibold mb-6 sm:mb-8 lg:mb-12 leading-none tracking-tight">
              <div className="text-gray-900 mb-2 sm:mb-4">The Future of</div>
              <div className="text-blue-600 font-semibold">
                Foot Analysis
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-gray-700 mb-8 sm:mb-12 lg:mb-16 max-w-2xl sm:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed font-medium px-4 sm:px-0">
              Professional-grade foot health assessment powered by artificial intelligence. 
              <br className="hidden sm:block" />
              Upload a photo and receive detailed medical-grade analysis in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
              <Button 
                onClick={onGetStarted}
                className="bg-black text-white border border-black hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 px-6 py-3 sm:px-8 sm:py-3 lg:px-12 lg:py-4 text-sm sm:text-base lg:text-lg font-medium rounded-xl sm:rounded-2xl shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none"
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold text-gray-900 mb-4 sm:mb-6 tracking-wide">
              Real AI, Real Results
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto font-medium leading-relaxed px-4 sm:px-0">
              Experience the power of genuine artificial intelligence with medical-grade precision
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group h-full">
                  {/* Clean Card Design */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-xl hover:scale-[1.02] hover:border-blue-200 transition-all duration-300 ease-out group-hover:bg-gray-50/30 h-full flex flex-col">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:from-blue-100 group-hover:to-blue-200 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight group-hover:text-gray-800 transition-colors duration-300 flex-shrink-0">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-1">
                      {feature.description}
                    </p>
                    
                    {/* Subtle Badge */}
                    <div className="mt-6 inline-flex items-center px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full group-hover:bg-blue-50 group-hover:text-blue-700 transition-all duration-300 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 group-hover:scale-110 transition-transform duration-300"></div>
                      Available
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section id="why-choose" className="container mx-auto px-3 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold text-gray-900 mb-4 sm:mb-6 tracking-wide">
                Why Choose FootRate AI?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-medium px-4 sm:px-0">
                Advanced technology meets medical expertise for unparalleled precision
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Benefits List */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                        {benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Demo Card */}
              <div className="group">
                <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-10 shadow-xl border border-blue-100 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-200 transition-all duration-500 ease-out group-hover:from-blue-100 group-hover:via-white group-hover:to-purple-100 h-full flex flex-col relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gray-900 group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-lg group-hover:shadow-xl">
                    <Activity className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold text-black mb-4 leading-tight group-hover:text-gray-800 transition-colors duration-300 flex-shrink-0">
                    Live Demo
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-1 mb-8 text-lg">
                    Experience FootRate AI with real-time analysis
                  </p>
                  
                  {/* Button */}
                  <Button 
                    onClick={onGetStarted}
                    className="w-full bg-black text-white border border-black hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl flex-shrink-0 group-hover:scale-105"
                  >
                    <span className="tracking-wide">Try It Now</span>
                    <Zap className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-3 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold text-gray-900 mb-4 sm:mb-6 tracking-wide">
                Choose Your Plan
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-bold leading-relaxed px-4 sm:px-0">
                Start free and upgrade when you need more analyses
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="group">
                <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-200 transition-all duration-500 ease-out group-hover:bg-gray-50/30 h-full flex flex-col relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gray-900 group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-lg group-hover:shadow-xl">
                    <Eye className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold text-black mb-2 leading-tight group-hover:text-gray-800 transition-colors duration-300 flex-shrink-0">
                    Free
                  </h3>
                  
                  {/* Price */}
                  <div className="text-4xl font-bold text-black mb-2">$0</div>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-shrink-0 mb-8 text-lg">
                    Perfect for trying out
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">3 AI image analyses</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Real AI-powered analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">5-factor health assessment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Detailed improvement tips</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Analysis history</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Medical-grade scoring</span>
                    </div>
                  </div>
                  
                  {/* Button */}
                  <Button 
                    onClick={onGetStarted}
                    className="w-full bg-black text-white border border-black hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl flex-shrink-0 group-hover:scale-105"
                  >
                    <span className="tracking-wide">Get Started Free</span>
                  </Button>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="group">
                <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-10 shadow-xl border border-blue-100 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-200 transition-all duration-500 ease-out group-hover:from-blue-100 group-hover:via-white group-hover:to-purple-100 h-full flex flex-col relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Popular Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold shadow-xl">
                      Most Popular
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gray-900 group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-lg group-hover:shadow-xl">
                    <Sparkles className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-bold text-black mb-2 leading-tight group-hover:text-gray-800 transition-colors duration-300 flex-shrink-0">
                    Pro
                  </h3>
                  
                  {/* Price */}
                  <div className="text-4xl font-bold text-black mb-2">$9</div>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-shrink-0 mb-8 text-lg">
                    For serious foot care
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">50 AI image analyses</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Everything in Free plan</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Priority AI processing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Advanced analytics dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Progress tracking graphs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Export analysis reports</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Premium support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">Early access to new features</span>
                    </div>
                  </div>
                  
                  {/* Button */}
                  <Button 
                    onClick={handleUpgradeClick}
                    disabled={loadingPayment}
                    className="w-full bg-black text-white border border-black hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl flex-shrink-0 group-hover:scale-105"
                  >
                    {loadingPayment ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-black mb-1">30-Day Money-Back Guarantee</h3>
                  <p className="text-sm text-gray-600">Try FootRate AI Pro completely risk-free. If you're not 100% satisfied, we'll give you a full refund - no questions asked.</p>
                </div>
              </div>
            </div>

            {/* Open Source Section */}
            <div className="text-center mt-8 sm:mt-12">
              <div className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Open Source</h3>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">Contribute to FootRate AI on GitHub</p>
                </div>
                <a 
                  href="https://github.com/mintukumar0000/footrate-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 sm:ml-4 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 border border-green-500 hover:border-green-400 rounded-full text-xs sm:text-sm text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="footer" className="bg-black rounded-3xl mx-4 sm:mx-8 mb-4 sm:mb-8">
          <div className="container mx-auto px-6 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              {/* Left Section - Branding */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    FootRate AI
                  </div>
                </div>
                <p className="text-white text-sm max-w-xs">
                  AI-powered foot analysis with medical-grade precision for better health insights.
                </p>
              </div>
              
              {/* Right Section - Features & Contact */}
              <div className="flex flex-col items-end lg:items-end items-start gap-6">
                {/* Features */}
                <div className="flex flex-col lg:items-end items-start gap-3">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span>Powered by OpenAI</span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Privacy First</span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Award className="w-4 h-4 text-blue-400" />
                    <span>Medical Grade</span>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="flex flex-col lg:items-end items-start gap-3">
                  <a 
                    href="mailto:heyquixy@gmail.com"
                    className="flex items-center gap-2 text-white text-sm hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>heyquixy@gmail.com</span>
                  </a>
                  <a 
                    href="https://x.com/Mintu_aa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white text-sm hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>@Mintu_aa</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/mintu-nee-3bb156317/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white text-sm hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
              © 2024 FootRate AI. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
