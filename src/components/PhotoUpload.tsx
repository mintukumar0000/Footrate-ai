import { useState, useCallback, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Star, Sparkles, Brain, Crown, AlertTriangle, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { realFootAnalysisAI, type RealFootAnalysisResult } from '@/lib/realFootAnalysisAI';
import { SubscriptionService, SubscriptionStatus } from '@/lib/subscriptionService';

interface PhotoUploadProps {
  onAnalysisComplete: (analysis: RealFootAnalysisResult, originalImageUrl: string) => void;
  userId?: string;
}

export const PhotoUpload = ({ onAnalysisComplete, userId }: PhotoUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [showInlineUpgrade, setShowInlineUpgrade] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Check subscription status when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      checkSubscriptionStatus();
    }
  }, [userId]);

  const checkSubscriptionStatus = async () => {
    if (!userId) return;
    
    try {
      const status = await SubscriptionService.getSubscriptionStatus(userId);
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const performRealAIAnalysis = async (imageDataUrl: string): Promise<RealFootAnalysisResult> => {
    setAnalysisStage('🤖 Connecting to AI services...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAnalysisStage('👁️ AI detecting foot region...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAnalysisStage('🧬 AI analyzing skin condition...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAnalysisStage('💅 AI evaluating nail health...');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    setAnalysisStage('🦴 AI assessing foot structure...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAnalysisStage('🎯 AI finalizing medical assessment...');
    const analysis = await realFootAnalysisAI.analyzeFootImage(imageDataUrl);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return analysis;
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Check subscription limits before analysis
    if (userId && subscriptionStatus) {
      if (!subscriptionStatus.canAnalyze) {
        setShowInlineUpgrade(true);
        return;
      }
    }

    setAnalyzing(true);
    setAnalysisStage('Loading image...');
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      setUploadedImage(imageDataUrl);

      try {
        // Perform REAL AI analysis with the image data URL
        const analysis = await performRealAIAnalysis(imageDataUrl);
        
        // Check if AI detected a foot
        if (!analysis.isFootDetected) {
          setAnalyzing(false);
          setAnalysisStage('');
          toast({
            title: "❌ Not a Foot Image",
            description: analysis.medicalWarning || "Please upload a clear photo of feet for analysis.",
            variant: "destructive",
          });
          return;
        }
        
        // Increment usage counter after successful analysis
        if (userId) {
          try {
            await SubscriptionService.incrementUsage(userId);
            // Refresh subscription status
            await checkSubscriptionStatus();
          } catch (error) {
            console.error('Failed to increment usage:', error);
          }
        }
        
        // Save detailed analysis to database if user is logged in
        if (userId) {
          try {
            await supabase.from('foot_analyses').insert({
              user_id: userId,
              overall_score: analysis.overallScore,
              skin_score: analysis.breakdown.skinCondition.score,
              nail_score: analysis.breakdown.nailHealth.score,
              shape_score: analysis.breakdown.footShape.score,
              symmetry_score: analysis.breakdown.symmetry.score,
              cleanliness_score: analysis.breakdown.cleanliness.score,
              detected_issues: analysis.detectedIssues,
              improvement_tips: analysis.improvementTips,
              confidence_score: analysis.confidenceScore,
              full_analysis: JSON.stringify(analysis.breakdown)
            });
          } catch (error) {
            console.error('Failed to save analysis:', error);
          }
        }
        
        onAnalysisComplete(analysis, imageDataUrl);
        setAnalyzing(false);
        setAnalysisStage('');
        
        const remainingMessage = subscriptionStatus ? ` ${subscriptionStatus.analysesRemaining - 1} analyses remaining this month.` : '';
        toast({
          title: `🎉 Real AI Analysis Complete! (${analysis.aiProvider.toUpperCase()})`,
          description: `Your foot scored ${analysis.overallScore.toFixed(1)}/10 with ${analysis.confidenceScore}% confidence.${remainingMessage}`,
        });
      } catch (error) {
        console.error('Real AI analysis failed:', error);
        setAnalyzing(false);
        setAnalysisStage('');
        toast({
          title: "AI Analysis Failed",
          description: error instanceof Error ? error.message : "Please check your AI API keys and try again.",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(file);
  }, [onAnalysisComplete, toast, userId, subscriptionStatus, checkSubscriptionStatus]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleUpgrade = async () => {
    try {
      // Initiate Dodo Payment
      const paymentUrl = await SubscriptionService.initiateDodoPayment(userId || '', 'pro')
      
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
    }
  }

  return (
    <>
      {/* Inline Pro Features Section */}
      {showInlineUpgrade && subscriptionStatus && (
        <Card className="mb-4 sm:mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-xl flex items-center justify-center">
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <button
                  onClick={() => setShowInlineUpgrade(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <Badge className="bg-red-100 text-red-700 border-red-200 mb-3 sm:mb-4 text-xs sm:text-sm">
                Limit Reached
              </Badge>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-wide">
                Pro
              </h2>
              
              <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 sm:px-6 sm:py-3 mb-3">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">$9</span>
                <span className="text-xs sm:text-sm text-gray-600">/month</span>
              </div>
              
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                For serious foot care
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                "50 AI image analyses",
                "Everything in Free plan",
                "Priority AI processing",
                "Advanced analytics dashboard",
                "Progress tracking graphs",
                "Export analysis reports",
                "Premium support",
                "Early access to new features"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Upgrade Button */}
            <div className="text-center">
              <Button
                onClick={handleUpgrade}
                className="w-full sm:w-auto bg-black text-white hover:bg-gray-900 border border-black hover:border-gray-900 font-medium py-3 px-8 rounded-xl shadow-lg transition-all duration-300 text-sm sm:text-base"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
                <Shield className="w-3 h-3" />
                <span>Secure payment via Dodo Payment</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-sm">
      <div
        className={`p-4 sm:p-6 md:p-8 border-2 border-dashed transition-all duration-300 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${analyzing ? 'animate-pulse' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
          {uploadedImage ? (
            <div className="space-y-3 sm:space-y-4">
              <img
                src={uploadedImage}
                alt="Uploaded foot"
                className="mx-auto max-w-xs rounded-lg shadow-neon border border-primary/20 w-full sm:w-auto"
              />
              {analyzing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Brain className="w-5 h-5 animate-pulse" />
                    <span className="font-medium bg-neon-gradient bg-clip-text text-transparent">
                      AI Analysis in Progress...
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground animate-pulse">
                      {analysisStage}
                    </p>
                    <div className="w-full bg-secondary/30 rounded-full h-2 mt-2">
                      <div 
                        className="bg-neon-gradient h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: analyzing ? '100%' : '0%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center">
                {analyzing ? (
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white animate-pulse" />
                ) : (
                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                )}
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Upload Your Foot Photo
                </h3>
                <p className="text-sm sm:text-base text-gray-700 px-2 sm:px-0">
                  Drag and drop your image here, or click to select
                </p>
              </div>

              <div className="flex gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-900 border border-black hover:border-gray-900 transition-all duration-300 font-semibold text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4"
                  onClick={() => document.getElementById('file-input')?.click()}
                  disabled={analyzing}
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Choose Photo
                </Button>
              </div>
            </>
          )}
        </div>

        <input
          id="file-input"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
          disabled={analyzing}
        />
      </div>

      {/* Subscription Status Display */}
      {subscriptionStatus && (
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Badge 
              variant={subscriptionStatus.currentTier === 'pro' ? 'default' : 'secondary'}
              className={`self-start ${subscriptionStatus.currentTier === 'pro' 
                ? 'bg-black text-white' 
                : 'bg-gray-600 text-white'}`}
            >
              {subscriptionStatus.currentTier === 'pro' ? (
                <><Crown className="w-3 h-3 mr-1" />Pro</>
              ) : (
                'Free'
              )}
            </Badge>
            <span className="text-xs sm:text-sm text-gray-400">
              {subscriptionStatus.usedThisMonth}/{subscriptionStatus.monthlyLimit} analyses used this month
            </span>
          </div>
          
          <div className="flex items-center justify-end">
            {subscriptionStatus.analysesRemaining === 0 && subscriptionStatus.currentTier === 'free' && (
              <Button
                onClick={() => setShowInlineUpgrade(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-black font-medium text-xs sm:text-sm"
              >
                <Crown className="w-3 h-3 mr-1" />
                Upgrade
              </Button>
            )}
            
            {subscriptionStatus.analysesRemaining <= 2 && subscriptionStatus.analysesRemaining > 0 && subscriptionStatus.currentTier === 'free' && (
              <div className="flex items-center gap-1 sm:gap-2 text-amber-400">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Almost at limit</span>
              </div>
            )}
          </div>
        </div>
      )}
      </Card>
    </>
  );
};