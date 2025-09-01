import OpenAI from 'openai';

// Types for real AI analysis
export interface RealFootAnalysisResult {
  isFootDetected: boolean;
  overallScore: number;
  breakdown: {
    skinCondition: { score: number; feedback: string; tips: string[] };
    nailHealth: { score: number; feedback: string; tips: string[] };
    footShape: { score: number; feedback: string; tips: string[] };
    symmetry: { score: number; feedback: string; tips: string[] };
    cleanliness: { score: number; feedback: string; tips: string[] };
  };
  detectedIssues: string[];
  improvementTips: string[];
  confidenceScore: number;
  aiProvider: 'openai';
  medicalWarning?: string;
}

export class RealFootAnalysisAI {
  private openai: OpenAI | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize OpenAI if API key is available
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });
        console.log('✅ OpenAI Vision API initialized');
      } else {
        console.warn('⚠️ No OpenAI API key found. Add VITE_OPENAI_API_KEY to .env');
        throw new Error('OpenAI API key required. Please add VITE_OPENAI_API_KEY to your .env file.');
      }

      this.isInitialized = true;
      console.log('🧠 Real AI Analysis Engine Initialized');
    } catch (error) {
      console.error('Failed to initialize real AI engine:', error);
      throw new Error('Real AI initialization failed');
    }
  }

  async analyzeFootImage(imageDataUrl: string): Promise<RealFootAnalysisResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Use OpenAI Vision API
      if (this.openai) {
        return await this.analyzeWithOpenAI(imageDataUrl);
      }

      throw new Error('OpenAI service not available');
    } catch (error) {
      console.error('Real AI analysis failed:', error);
      throw new Error('Failed to analyze image with real AI');
    }
  }

  private async analyzeWithOpenAI(imageDataUrl: string): Promise<RealFootAnalysisResult> {
    if (!this.openai) throw new Error('OpenAI not initialized');

    const prompt = `
You are a strict professional podiatrist AI assistant. Analyze this foot image with medical precision and be CRITICAL in your assessment.

FIRST: Verify this is actually a foot/feet. If not, respond with: {"isFootDetected": false}

If it IS a foot, provide a RIGOROUS medical assessment. Be harsh and realistic - most feet have issues that need attention.

CRITICAL SCORING GUIDELINES (1-10 scale):
🔥 SKIN CONDITION: Look for these SERIOUS issues that should get LOW scores (1-4):
- Severe dryness, cracking, or flaking skin (especially heels)
- Calluses, corns, or hard patches
- Discoloration, dark spots, or uneven skin tone  
- Rough, damaged, or unhealthy-looking skin texture
- Any visible skin conditions or irritation
- Lack of proper moisturization

⚠️ NAIL HEALTH: Be critical about:
- Discolored, yellow, or unhealthy nails (score 1-4)
- Overgrown, poorly trimmed, or uneven nails
- Any fungal infections or damage
- Poor nail care or hygiene

⚠️ FOOT STRUCTURE: Look for:
- Deformities, bunions, or structural issues
- Poor arch support or flat feet
- Misalignment or asymmetry

⚠️ CLEANLINESS: Be strict about:
- Any visible dirt, debris, or poor hygiene
- Unkempt appearance

SCORING RULES:
- Score 8-10: ONLY for nearly perfect, healthy feet with excellent care
- Score 6-7: Minor issues, generally healthy but needs some improvement  
- Score 4-5: Moderate problems requiring attention
- Score 1-3: Serious issues requiring immediate care/medical attention

Provide detailed feedback explaining exactly what you see wrong and specific improvement tips.

Return JSON with this exact structure:
{
  "isFootDetected": true,
  "skinCondition": {"score": X, "feedback": "detailed observation", "issues": ["specific problems seen"]},
  "nailHealth": {"score": X, "feedback": "detailed observation", "issues": ["specific problems seen"]},
  "footStructure": {"score": X, "feedback": "detailed observation", "issues": ["specific problems seen"]},
  "symmetry": {"score": X, "feedback": "detailed observation", "issues": ["specific problems seen"]},
  "cleanliness": {"score": X, "feedback": "detailed observation", "issues": ["specific problems seen"]},
  "overallScore": X,
  "detectedIssues": ["list all problems you observe"],
  "improvementTips": ["specific actionable advice"],
  "confidenceScore": X,
  "medicalRecommendation": "advice if serious issues detected"
}
`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text", 
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.1
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) throw new Error('No response from OpenAI');

    // Parse the AI response
    const analysis = await this.parseAIResponse(aiResponse, 'openai');
    return analysis;
  }



  private async parseAIResponse(aiResponse: string, provider: 'openai'): Promise<RealFootAnalysisResult> {
    try {
      // First check if AI detected this is not a foot
      if (aiResponse.includes('NOT_A_FOOT') || aiResponse.includes('"isFootDetected": false')) {
        return {
          isFootDetected: false,
          overallScore: 0,
          breakdown: {
            skinCondition: { score: 0, feedback: 'No foot detected', tips: [] },
            nailHealth: { score: 0, feedback: 'No foot detected', tips: [] },
            footShape: { score: 0, feedback: 'No foot detected', tips: [] },
            symmetry: { score: 0, feedback: 'No foot detected', tips: [] },
            cleanliness: { score: 0, feedback: 'No foot detected', tips: [] }
          },
          detectedIssues: ['Image does not contain feet'],
          improvementTips: ['Please upload a clear photo of feet for analysis'],
          confidenceScore: 100,
          aiProvider: provider,
          medicalWarning: 'This image does not appear to contain feet. Please upload a clear photo of feet for accurate analysis.'
        };
      }

      // Try to parse JSON response from AI
      let analysisData;
      try {
        // Extract JSON from response if it's wrapped in text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
        analysisData = JSON.parse(jsonString);
      } catch (parseError) {
        // If JSON parsing fails, create structured response from text
        analysisData = await this.extractAnalysisFromText(aiResponse);
      }

      // Structure the real AI response - BE CRITICAL, NO HIGH DEFAULT SCORES
      const result: RealFootAnalysisResult = {
        isFootDetected: analysisData.isFootDetected !== false,
        overallScore: analysisData.overallScore || 5, // Much lower default
        breakdown: {
          skinCondition: {
            score: analysisData.skinCondition?.score || 5, // Lower default
            feedback: analysisData.skinCondition?.feedback || 'Detailed analysis required',
            tips: this.extractTipsFromIssues(analysisData.skinCondition?.issues) || ['Apply daily moisturizer', 'Address dry or cracked skin']
          },
          nailHealth: {
            score: analysisData.nailHealth?.score || 5, // Lower default
            feedback: analysisData.nailHealth?.feedback || 'Detailed analysis required', 
            tips: this.extractTipsFromIssues(analysisData.nailHealth?.issues) || ['Maintain proper nail trimming', 'Keep nails clean']
          },
          footShape: {
            score: analysisData.footShape?.score || analysisData.footStructure?.score || 5, // Lower default
            feedback: analysisData.footShape?.feedback || analysisData.footStructure?.feedback || 'Detailed analysis required',
            tips: this.extractTipsFromIssues(analysisData.footShape?.issues || analysisData.footStructure?.issues) || ['Monitor foot structure', 'Check for alignment issues']
          },
          symmetry: {
            score: analysisData.symmetry?.score || 5, // Lower default
            feedback: analysisData.symmetry?.feedback || 'Detailed analysis required',
            tips: this.extractTipsFromIssues(analysisData.symmetry?.issues) || ['Check bilateral balance', 'Monitor symmetry']
          },
          cleanliness: {
            score: analysisData.cleanliness?.score || 5, // Lower default
            feedback: analysisData.cleanliness?.feedback || 'Detailed analysis required',
            tips: this.extractTipsFromIssues(analysisData.cleanliness?.issues) || ['Maintain daily hygiene', 'Keep feet clean and dry']
          }
        },
        detectedIssues: analysisData.detectedIssues || ['Analysis incomplete - manual assessment needed'],
        improvementTips: analysisData.improvementTips || ['Consider professional foot care consultation'],
        confidenceScore: analysisData.confidenceScore || 75, // Lower confidence default
        aiProvider: provider,
        medicalWarning: analysisData.medicalRecommendation || analysisData.medicalWarning
      };

      return result;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Failed to process AI analysis results');
    }
  }

  private extractTipsFromIssues(issues: string[] | undefined): string[] {
    if (!issues || issues.length === 0) return [];
    
    const tipMap: { [key: string]: string } = {
      'dry': 'Apply a high-quality foot moisturizer daily, especially to heels',
      'crack': 'Use a healing balm with urea or salicylic acid for cracked skin',
      'callus': 'Gently exfoliate calluses and moisturize regularly',
      'rough': 'Use a pumice stone weekly and moisturize daily',
      'discolor': 'Consult a podiatrist about skin discoloration',
      'nail': 'Maintain proper nail trimming and hygiene',
      'thick': 'Consider professional pedicure treatment',
      'flak': 'Address flaking skin with intensive moisturizing',
      'hard': 'Soften hard patches with regular moisturizing'
    };

    const tips: string[] = [];
    issues.forEach(issue => {
      const lowerIssue = issue.toLowerCase();
      Object.keys(tipMap).forEach(key => {
        if (lowerIssue.includes(key)) {
          tips.push(tipMap[key]);
        }
      });
    });

    return tips.length > 0 ? [...new Set(tips)] : ['Consult with a foot care professional for proper assessment'];
  }

  private async extractAnalysisFromText(text: string): Promise<any> {
    // Extract scores and feedback from natural language response
    const scoreRegex = /(\w+).*?(\d+(?:\.\d+)?)\s*\/\s*10/gi;
    const scores: any = {};
    
    let match;
    while ((match = scoreRegex.exec(text)) !== null) {
      const category = match[1].toLowerCase();
      const score = parseFloat(match[2]);
      scores[category] = { score, feedback: 'AI analysis provided', tips: [] };
    }

    return {
      isFootDetected: !text.toLowerCase().includes('not a foot'),
      ...scores,
      overallScore: Object.keys(scores).length > 0 
        ? Object.values(scores).reduce<number>((sum, item: any) => {
            const score = item && typeof item === 'object' ? (Number(item.score) || 0) : (Number(item) || 0);
            return (sum as number) + (score as number);
          }, 0) / Object.keys(scores).length
        : 5,
      confidenceScore: 85
    };
  }

  private calculateOverallScore(analysisData: any): number {
    const scores = [
      Number(analysisData.skinCondition?.score) || 5,
      Number(analysisData.nailHealth?.score) || 5,
      Number(analysisData.footShape?.score || analysisData.footStructure?.score) || 5,
      Number(analysisData.symmetry?.score) || 5,
      Number(analysisData.cleanliness?.score) || 5
    ];
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
}

// Singleton instance
export const realFootAnalysisAI = new RealFootAnalysisAI();
