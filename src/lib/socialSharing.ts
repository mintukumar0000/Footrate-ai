export interface ShareOptions {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}

export const shareToTwitter = async (text: string, imageUrl?: string) => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent('https://footrateai.com');
  
  // Twitter doesn't support direct image uploads via URL, so we use text + URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  window.open(twitterUrl, '_blank');
  
  // If we have an image, we can offer to download it for manual sharing
  if (imageUrl) {
    // Create a temporary download link for the image
    const link = document.createElement('a');
    link.download = `footrate-ai-result-${Date.now()}.jpg`;
    link.href = imageUrl;
    link.click();
  }
};

export const shareToInstagram = async (imageUrl: string, caption: string) => {
  // Instagram doesn't support direct sharing via URL, so we download the image
  const link = document.createElement('a');
  link.download = `footrate-ai-instagram-${Date.now()}.jpg`;
  link.href = imageUrl;
  link.click();
  
  // Show instructions to user
  alert('Image downloaded! Open Instagram and upload this image with the caption: ' + caption);
};

export const shareToWhatsApp = async (text: string, imageUrl?: string) => {
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
  
  if (imageUrl) {
    const link = document.createElement('a');
    link.download = `footrate-ai-whatsapp-${Date.now()}.jpg`;
    link.href = imageUrl;
    link.click();
  }
};

export const shareToTelegram = async (text: string, imageUrl?: string) => {
  const encodedText = encodeURIComponent(text);
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('https://footrateai.com')}&text=${encodedText}`;
  window.open(telegramUrl, '_blank');
  
  if (imageUrl) {
    const link = document.createElement('a');
    link.download = `footrate-ai-telegram-${Date.now()}.jpg`;
    link.href = imageUrl;
    link.click();
  }
};

export const useNativeShare = async (options: ShareOptions) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
        // Note: files sharing is not widely supported yet
      });
      return true;
    } catch (error) {
      console.log('Native sharing cancelled or failed');
      return false;
    }
  }
  return false;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
