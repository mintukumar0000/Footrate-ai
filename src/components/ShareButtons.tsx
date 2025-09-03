import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Twitter, 
  Share2, 
  Instagram, 
  Download,
  Copy,
  CheckCircle
} from 'lucide-react';
import { MemeVerdict } from '@/lib/memeVerdicts';
import { createShareableImage, addWatermarkToImage } from '@/lib/imageWatermark';
import { 
  shareToTwitter, 
  shareToInstagram, 
  shareToWhatsApp, 
  shareToTelegram, 
  useNativeShare, 
  copyToClipboard 
} from '@/lib/socialSharing';

interface ShareButtonsProps {
  memeVerdict: MemeVerdict;
  overallScore: number;
  isPaidUser: boolean;
  onWatermarkToggle?: (showWatermark: boolean) => void;
  showWatermark: boolean;
  originalImageUrl?: string;
  analysisResult?: any;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  memeVerdict, 
  overallScore, 
  isPaidUser,
  onWatermarkToggle,
  showWatermark,
  originalImageUrl,
  analysisResult
}) => {
  const [copied, setCopied] = useState(false);
  const [showWatermarkChoice, setShowWatermarkChoice] = useState(false);
  const [shareableImageUrl, setShareableImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Pre-generate shareable image when component mounts
  useEffect(() => {
    const generateShareableImage = async () => {
      if (originalImageUrl && analysisResult && !shareableImageUrl) {
        try {
          setIsGeneratingImage(true);
          const imageUrl = await createShareableImage(analysisResult, originalImageUrl, showWatermark);
          setShareableImageUrl(imageUrl);
        } catch (error) {
          console.error('Error pre-generating shareable image:', error);
        } finally {
          setIsGeneratingImage(false);
        }
      }
    };

    generateShareableImage();
  }, [originalImageUrl, analysisResult, showWatermark, shareableImageUrl]);

  const handleTwitterShare = async () => {
    try {
      let imageUrl = shareableImageUrl;
      
      if (!imageUrl && originalImageUrl && analysisResult) {
        // Create shareable image with watermark
        imageUrl = await createShareableImage(analysisResult, originalImageUrl, showWatermark);
        setShareableImageUrl(imageUrl);
      }
      
      // Enhanced meme-worthy Twitter text
      const twitterText = `AI just roasted my feet ${memeVerdict.emoji} Got a ${overallScore}/10 ${memeVerdict.scoreEmojis}\n\n"${memeVerdict.verdict}"\n\nTry it 👉 footrateai.com`;
      
      await shareToTwitter(twitterText, imageUrl || undefined);
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      // Fallback to text-only sharing
      const fallbackText = `AI just roasted my feet ${memeVerdict.emoji} Got a ${overallScore}/10 ${memeVerdict.scoreEmojis}\n\nTry it 👉 footrateai.com`;
      await shareToTwitter(fallbackText);
    }
  };

  const handleCopyLink = async () => {
    try {
      const success = await copyToClipboard('https://footrateai.com');
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleInstagramShare = async () => {
    try {
      let imageUrl = shareableImageUrl;
      
      if (!imageUrl && originalImageUrl && analysisResult) {
        imageUrl = await createShareableImage(analysisResult, originalImageUrl, showWatermark);
        setShareableImageUrl(imageUrl);
      }
      
      if (imageUrl) {
        // Enhanced meme-worthy Instagram caption
        const instagramCaption = `🤖 AI just roasted my feet ${memeVerdict.emoji}\n\nScore: ${overallScore}/10 ${memeVerdict.scoreEmojis}\n\n"${memeVerdict.verdict}"\n\nTry it 👉 footrateai.com\n\n#FootRateAI #AI #FootAnalysis #Meme #Funny`;
        await shareToInstagram(imageUrl, instagramCaption);
      }
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      let imageUrl = shareableImageUrl;
      
      if (!imageUrl && originalImageUrl && analysisResult) {
        imageUrl = await createShareableImage(analysisResult, originalImageUrl, showWatermark);
        setShareableImageUrl(imageUrl);
      }
      
      // Enhanced meme-worthy WhatsApp text
      const whatsappText = `🤖 AI just roasted my feet ${memeVerdict.emoji}\n\nScore: ${overallScore}/10 ${memeVerdict.scoreEmojis}\n\n"${memeVerdict.verdict}"\n\nTry it 👉 footrateai.com`;
      
      await shareToWhatsApp(whatsappText, imageUrl || undefined);
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
    }
  };

  const handleNativeShare = async () => {
    try {
      let imageUrl = shareableImageUrl;
      
      if (!imageUrl && originalImageUrl && analysisResult) {
        imageUrl = await createShareableImage(analysisResult, originalImageUrl, showWatermark);
        setShareableImageUrl(imageUrl);
      }
      
      // Enhanced meme-worthy native share text
      const shareText = `🤖 AI just roasted my feet ${memeVerdict.emoji}\n\nScore: ${overallScore}/10 ${memeVerdict.scoreEmojis}\n\n"${memeVerdict.verdict}"\n\nTry it 👉 footrateai.com`;
      
      const success = await useNativeShare({
        title: 'FootRate AI Analysis',
        text: shareText,
        url: 'https://footrateai.com',
        imageUrl: imageUrl || undefined
      });
      
      if (!success) {
        handleCopyLink();
      }
    } catch (error) {
      console.error('Error with native share:', error);
      handleCopyLink();
    }
  };

  const handleWatermarkChoice = (showWatermark: boolean) => {
    if (onWatermarkToggle) {
      onWatermarkToggle(showWatermark);
    }
    setShowWatermarkChoice(false);
  };

  const renderShareButtons = () => {
    if (showWatermarkChoice) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center">
            Add watermark to your shared result?
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleWatermarkChoice(true)}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              Yes, Add Watermark
            </Button>
            <Button 
              onClick={() => handleWatermarkChoice(false)}
              variant="outline"
              className="flex-1"
            >
              No Watermark
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Main Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={handleTwitterShare}
            disabled={isGeneratingImage}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Twitter className="w-4 h-4 mr-2" />
            {isGeneratingImage ? 'Preparing...' : 'Twitter'}
          </Button>
          
          <Button 
            onClick={handleInstagramShare}
            disabled={isGeneratingImage}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Instagram className="w-4 h-4 mr-2" />
            {isGeneratingImage ? 'Preparing...' : 'Instagram'}
          </Button>
          
          <Button 
            onClick={handleWhatsAppShare}
            disabled={isGeneratingImage}
            className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isGeneratingImage ? 'Preparing...' : 'WhatsApp'}
          </Button>
          
          <Button 
            onClick={handleNativeShare}
            disabled={isGeneratingImage}
            className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isGeneratingImage ? 'Preparing...' : 'Share'}
          </Button>
        </div>
        
        {/* Copy Link Button */}
        <Button 
          onClick={handleCopyLink}
          variant="outline"
          className="w-full border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span className="font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              <span className="font-semibold">Copy Link</span>
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">Share Your Foot Roast</h4>
            <p className="text-sm text-gray-600">Turn your analysis into a viral meme! 🚀</p>
          </div>
        </div>

        {/* User Plan Info */}
        {isPaidUser && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">💎</span>
              </div>
              <p className="text-sm font-semibold text-blue-800">
                Pro User: Choose watermark preference when sharing
              </p>
            </div>
          </div>
        )}

        {!isPaidUser && (
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">🆓</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Free Plan: Watermark included on all shared results
              </p>
            </div>
          </div>
        )}

        {/* Share Buttons */}
        {renderShareButtons()}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 text-center font-medium">
            Share your <span className="font-bold text-gray-900">{overallScore}/10</span> foot roast and challenge your friends! {memeVerdict.scoreEmojis}
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            Let's see who has the most meme-worthy feet! 👣
          </p>
          {isGeneratingImage && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-blue-600 font-medium">
                ⚡ Preparing viral meme card...
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
