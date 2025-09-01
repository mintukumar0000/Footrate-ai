import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Star, Trophy, Award, Calendar, TrendingUp, Brain, Sparkles } from 'lucide-react'

interface FootAnalysis {
  id: number
  user_id: string
  overall_score: number
  skin_score: number
  nail_score: number
  shape_score: number
  symmetry_score: number
  cleanliness_score: number
  confidence_score: number
  created_at: string
}

interface RatingHistoryProps {
  userId: string
}

export const RatingHistory = ({ userId }: RatingHistoryProps) => {
  const [analyses, setAnalyses] = useState<FootAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalyses()
  }, [userId])

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('foot_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAnalyses(data || [])
    } catch (error: any) {
      console.log('Database error:', error)
      // Don't show error toast for missing table - just show empty state
      setAnalyses([])
    } finally {
      setLoading(false)
    }
  }

  const getRatingCategory = (score: number) => {
    if (score >= 9) return { label: 'Exceptional', icon: Trophy, color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' }
    if (score >= 8) return { label: 'Excellent', icon: Award, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
    if (score >= 7) return { label: 'Good', icon: Star, color: 'bg-green-500/20 text-green-300 border-green-500/30' }
    return { label: 'Fair', icon: Star, color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' }
  }

  const averageRating = analyses.length > 0 
    ? analyses.reduce((sum, analysis) => sum + analysis.overall_score, 0) / analyses.length 
    : 0

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-secondary/50 rounded w-1/2"></div>
          <div className="h-12 bg-secondary/30 rounded"></div>
          <div className="h-12 bg-secondary/30 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Analysis History</h3>
        </div>
        {analyses.length > 0 && (
          <div className="text-right">
            <div className="text-lg font-bold bg-neon-gradient bg-clip-text text-transparent">
              {averageRating.toFixed(1)}/10
            </div>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
        )}
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">No AI analyses yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload your first photo for real AI analysis
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analyses.map((analysis) => {
            const category = getRatingCategory(analysis.overall_score)
            const IconComponent = category.icon
            
            return (
              <div
                key={analysis.id}
                className="p-3 rounded-lg bg-secondary/20 border border-primary/10 hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {analysis.overall_score.toFixed(1)}/10
                        </span>
                        <Badge variant="outline" className={`text-xs ${category.color}`}>
                          {category.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(analysis.created_at).toLocaleDateString()}
                        <span className="ml-2 flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          {analysis.confidence_score}% confident
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(analysis.overall_score / 2) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Mini breakdown */}
                <div className="mt-2 grid grid-cols-5 gap-1 text-xs">
                  <div className="text-center">
                    <div className={`text-xs font-medium ${analysis.skin_score >= 7 ? 'text-green-400' : analysis.skin_score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysis.skin_score.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Skin</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${analysis.nail_score >= 7 ? 'text-green-400' : analysis.nail_score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysis.nail_score.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Nails</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${analysis.shape_score >= 7 ? 'text-green-400' : analysis.shape_score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysis.shape_score.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Shape</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${analysis.symmetry_score >= 7 ? 'text-green-400' : analysis.symmetry_score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysis.symmetry_score.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Symm</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${analysis.cleanliness_score >= 7 ? 'text-green-400' : analysis.cleanliness_score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysis.cleanliness_score.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Clean</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}