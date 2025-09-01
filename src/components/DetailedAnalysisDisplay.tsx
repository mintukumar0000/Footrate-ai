import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Trophy, 
  Award, 
  AlertCircle, 
  CheckCircle, 
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Heart,
  Shield
} from 'lucide-react';
import { RealFootAnalysisResult } from '@/lib/realFootAnalysisAI';

interface DetailedAnalysisDisplayProps {
  analysis: RealFootAnalysisResult | null;
}

export const DetailedAnalysisDisplay = ({ analysis }: DetailedAnalysisDisplayProps) => {
  if (!analysis) return null;

  const getRatingCategory = (score: number) => {
    if (score >= 9) return { label: 'Exceptional', icon: Trophy, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' };
    if (score >= 8) return { label: 'Excellent', icon: Award, color: 'text-blue-500', bgColor: 'bg-blue-500/20' };
    if (score >= 7) return { label: 'Very Good', icon: Star, color: 'text-green-500', bgColor: 'bg-green-500/20' };
    if (score >= 6) return { label: 'Good', icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/20' };
    if (score >= 4) return { label: 'Fair', icon: Target, color: 'text-orange-500', bgColor: 'bg-orange-500/20' };
    return { label: 'Needs Improvement', icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500/20' };
  };

  const overallCategory = getRatingCategory(analysis.overallScore);
  const OverallIcon = overallCategory.icon;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="bg-card/80 backdrop-blur-xl border-primary/20 shadow-neon overflow-hidden">
        <div className="relative p-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-gradient opacity-10 rounded-full -mr-16 -mt-16" />
          
          <div className="text-center space-y-6 relative">
            <div className="space-y-2">
              <div className="mx-auto w-20 h-20 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon">
                <OverallIcon className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Overall Score</h3>
            </div>

            <div className="space-y-4">
              <div className="text-7xl font-bold bg-neon-gradient bg-clip-text text-transparent">
                {analysis.overallScore}/10
              </div>
              
              <div className={`inline-flex items-center px-6 py-3 rounded-full ${overallCategory.bgColor} border border-primary/20 backdrop-blur-sm`}>
                <OverallIcon className={`w-5 h-5 mr-2 ${overallCategory.color}`} />
                <span className={`font-semibold ${overallCategory.color}`}>{overallCategory.label}</span>
              </div>

              <div className="flex justify-center space-x-1 mt-6">
                {[...Array(10)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 transition-colors ${
                      i < Math.floor(analysis.overallScore) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Brain className="w-4 h-4" />
              <span className="text-sm">Confidence: {analysis.confidenceScore}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Breakdown */}
      <Card className="bg-card/80 backdrop-blur-xl border-primary/20 shadow-neon">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-neon-gradient rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Detailed Analysis</h3>
          </div>

          <div className="grid gap-6">
            {/* Skin Condition */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="font-semibold text-foreground">Skin Condition</span>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(analysis.breakdown.skinCondition.score)}`}>
                  {analysis.breakdown.skinCondition.score}/10
                </span>
              </div>
              <Progress 
                value={analysis.breakdown.skinCondition.score * 10} 
                className="h-2 bg-secondary/30"
              />
              <p className="text-sm text-muted-foreground">{analysis.breakdown.skinCondition.feedback}</p>
            </div>

            {/* Nail Health */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-foreground">Nail Health</span>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(analysis.breakdown.nailHealth.score)}`}>
                  {analysis.breakdown.nailHealth.score}/10
                </span>
              </div>
              <Progress 
                value={analysis.breakdown.nailHealth.score * 10} 
                className="h-2 bg-secondary/30"
              />
              <p className="text-sm text-muted-foreground">{analysis.breakdown.nailHealth.feedback}</p>
            </div>

            {/* Foot Shape */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="font-semibold text-foreground">Foot Structure</span>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(analysis.breakdown.footShape.score)}`}>
                  {analysis.breakdown.footShape.score}/10
                </span>
              </div>
              <Progress 
                value={analysis.breakdown.footShape.score * 10} 
                className="h-2 bg-secondary/30"
              />
              <p className="text-sm text-muted-foreground">{analysis.breakdown.footShape.feedback}</p>
            </div>

            {/* Symmetry */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-foreground">Symmetry</span>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(analysis.breakdown.symmetry.score)}`}>
                  {analysis.breakdown.symmetry.score}/10
                </span>
              </div>
              <Progress 
                value={analysis.breakdown.symmetry.score * 10} 
                className="h-2 bg-secondary/30"
              />
              <p className="text-sm text-muted-foreground">{analysis.breakdown.symmetry.feedback}</p>
            </div>

            {/* Cleanliness */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span className="font-semibold text-foreground">Cleanliness</span>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(analysis.breakdown.cleanliness.score)}`}>
                  {analysis.breakdown.cleanliness.score}/10
                </span>
              </div>
              <Progress 
                value={analysis.breakdown.cleanliness.score * 10} 
                className="h-2 bg-secondary/30"
              />
              <p className="text-sm text-muted-foreground">{analysis.breakdown.cleanliness.feedback}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Issues & Recommendations */}
      {(analysis.detectedIssues.length > 0 || analysis.improvementTips.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Detected Issues */}
          {analysis.detectedIssues.length > 0 && (
            <Card className="bg-card/80 backdrop-blur-xl border-orange-500/20 shadow-neon">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  <h4 className="font-semibold text-foreground">Areas to Address</h4>
                </div>
                <div className="space-y-2">
                  {analysis.detectedIssues.map((issue, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-sm text-muted-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Improvement Tips */}
          {analysis.improvementTips.length > 0 && (
            <Card className="bg-card/80 backdrop-blur-xl border-green-500/20 shadow-neon">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-foreground">Improvement Tips</h4>
                </div>
                <div className="space-y-2">
                  {analysis.improvementTips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-xl border-primary/20 shadow-neon">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Real AI Analysis Summary</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs font-semibold text-muted-foreground">
                OpenAI GPT-4o Vision
              </span>
            </div>
          </div>
          
          {!analysis.isFootDetected ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h5 className="font-semibold text-red-400">Image Validation Failed</h5>
              </div>
              <p className="text-sm text-red-300">
                {analysis.medicalWarning}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                This analysis was performed by real AI using OpenAI's GPT-4o Vision model. 
                The AI analyzed your foot image for medical accuracy, considering skin texture, color uniformity, nail health indicators, 
                structural symmetry, and overall foot hygiene based on scientific foot health standards.
              </p>
              
              {analysis.medicalWarning && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-semibold text-orange-400">Medical Notice</span>
                  </div>
                  <p className="text-sm text-orange-300 mt-1">{analysis.medicalWarning}</p>
                </div>
              )}
            </>
          )}
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Real AI Vision</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Image Validation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span>Medical Standards</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>{analysis.confidenceScore}% Accuracy</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
