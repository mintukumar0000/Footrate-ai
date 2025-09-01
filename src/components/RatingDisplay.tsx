import { Card } from '@/components/ui/card';
import { Star, Trophy, Award } from 'lucide-react';

interface RatingDisplayProps {
  rating: number | null;
}

export const RatingDisplay = ({ rating }: RatingDisplayProps) => {
  if (rating === null) return null;

  const getRatingCategory = (score: number) => {
    if (score >= 9) return { label: 'Exceptional', icon: Trophy, color: 'text-yellow-500' };
    if (score >= 8) return { label: 'Excellent', icon: Award, color: 'text-blue-500' };
    if (score >= 7) return { label: 'Good', icon: Star, color: 'text-green-500' };
    return { label: 'Fair', icon: Star, color: 'text-gray-500' };
  };

  const category = getRatingCategory(rating);
  const IconComponent = category.icon;

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-primary/20 shadow-neon">
      <div className="p-8 text-center space-y-6">
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon">
            <IconComponent className={`w-8 h-8 text-black`} />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Your Rating</h3>
        </div>

        <div className="space-y-4">
          <div className="text-6xl font-bold bg-neon-gradient bg-clip-text text-transparent">
            {rating}/10
          </div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-secondary/50 border backdrop-blur-sm ${category.color}`}>
            <IconComponent className={`w-4 h-4 mr-2 ${category.color.split(' ')[1]}`} />
            <span className="font-semibold">{category.label}</span>
          </div>

          <div className="flex justify-center space-x-1 mt-4">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4 border border-primary/10">
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Our AI analysis considers symmetry, skin health, nail condition, and overall foot aesthetics to provide this rating.
          </p>
        </div>
      </div>
    </Card>
  );
};