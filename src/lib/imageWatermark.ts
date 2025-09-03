export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  opacity?: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  padding?: number;
}

export const addWatermarkToImage = (
  imageUrl: string, 
  options: WatermarkOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const {
      text = "👣 Rated by FootRateAI.com",
      fontSize = 16,
      fontFamily = "Impact, 'Comic Sans MS', cursive, sans-serif",
      color = "#FFFFFF",
      opacity = 0.9,
      position = "bottom-right",
      padding = 20
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Set font properties
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      
      // Add shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Calculate text position
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;
      
      let x: number, y: number;
      
      switch (position) {
        case 'bottom-right':
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'top-right':
          x = canvas.width - textWidth - padding;
          y = textHeight + padding;
          break;
        case 'top-left':
          x = padding;
          y = textHeight + padding;
          break;
        default:
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
      }
      
      // Draw the watermark text
      ctx.fillText(text, x, y);
      
      // Convert canvas to data URL
      const watermarkedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(watermarkedImageUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for watermarking'));
    };
    
    img.src = imageUrl;
  });
};

export const createShareableImage = async (
  analysisResult: any,
  originalImageUrl: string,
  showWatermark: boolean = true
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  
  // Set canvas size for shareable image
  canvas.width = 1200;
  canvas.height = 800;
  
  // Create professional gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.5, '#f8fafc');
  gradient.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add subtle pattern overlay
  ctx.save();
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < canvas.width; i += 40) {
    for (let j = 0; j < canvas.height; j += 40) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(i, j, 1, 1);
    }
  }
  ctx.restore();
  
  // Load and draw the original image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Calculate image dimensions to fit nicely
      const maxWidth = 500;
      const maxHeight = 350;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Center the image
      const imageX = (canvas.width - scaledWidth) / 2;
      const imageY = 120;
      
      // Create shadow for the image
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      
      // Draw image with rounded corners and shadow
      ctx.beginPath();
      const radius = 25;
      ctx.moveTo(imageX + radius, imageY);
      ctx.lineTo(imageX + scaledWidth - radius, imageY);
      ctx.quadraticCurveTo(imageX + scaledWidth, imageY, imageX + scaledWidth, imageY + radius);
      ctx.lineTo(imageX + scaledWidth, imageY + scaledHeight - radius);
      ctx.quadraticCurveTo(imageX + scaledWidth, imageY + scaledHeight, imageX + scaledWidth - radius, imageY + scaledHeight);
      ctx.lineTo(imageX + radius, imageY + scaledHeight);
      ctx.quadraticCurveTo(imageX, imageY + scaledHeight, imageX, imageY + scaledHeight - radius);
      ctx.lineTo(imageX, imageY + radius);
      ctx.quadraticCurveTo(imageX, imageY, imageX + radius, imageY);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, imageX, imageY, scaledWidth, scaledHeight);
      ctx.restore();
      
      // Add professional header with logo
      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      
      // Main title
      ctx.font = 'bold 56px "Segoe UI", system-ui, -apple-system, sans-serif';
      ctx.fillText('FootRate AI', canvas.width / 2, 60);
      
      // Subtitle
      ctx.font = '300 20px "Segoe UI", system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Professional Foot Health Analysis', canvas.width / 2, 85);
      ctx.restore();
      
      // Add score with professional styling
      ctx.save();
      ctx.textAlign = 'center';
      
      // Score background circle
      const scoreY = imageY + scaledHeight + 100;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, scoreY, 60, 0, 2 * Math.PI);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Score text
      ctx.font = 'bold 48px "Segoe UI", system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${analysisResult.overallScore}/10`, canvas.width / 2, scoreY + 15);
      
      // Add score emojis
      if (analysisResult.memeVerdict?.scoreEmojis) {
        ctx.font = 'bold 32px "Segoe UI", system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(analysisResult.memeVerdict.scoreEmojis, canvas.width / 2, scoreY + 50);
      }
      ctx.restore();
      
      // Add meme verdict with better styling
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = 'bold 28px "Segoe UI", system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#1f2937';
      
      // Wrap text if too long
      const verdict = analysisResult.memeVerdict?.verdict || 'Foot Analysis Complete';
      const textMaxWidth = 800;
      const words = verdict.split(' ');
      let line = '';
      let y = scoreY + 80;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > textMaxWidth && i > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[i] + ' ';
          y += 35;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);
      ctx.restore();
      
      // Add fun watermark if requested (top-right corner)
      if (showWatermark) {
        ctx.save();
        
        // Fun watermark with playful styling
        const watermarkText = '👣 Rated by FootRateAI.com';
        ctx.font = 'bold 24px "Comic Sans MS", "Segoe UI", system-ui, -apple-system, sans-serif';
        const watermarkMetrics = ctx.measureText(watermarkText);
        const watermarkWidth = watermarkMetrics.width + 24;
        const watermarkHeight = 36;
        const watermarkX = canvas.width - watermarkWidth - 20;
        const watermarkY = 20; // Top-right corner
        
        // Fun gradient background
        const gradient = ctx.createLinearGradient(watermarkX, watermarkY, watermarkX + watermarkWidth, watermarkY + watermarkHeight);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.5, '#4ecdc4');
        gradient.addColorStop(1, '#45b7d1');
        
        // Rounded rectangle background with fun styling
        ctx.beginPath();
        const watermarkRadius = 18;
        ctx.moveTo(watermarkX + watermarkRadius, watermarkY);
        ctx.lineTo(watermarkX + watermarkWidth - watermarkRadius, watermarkY);
        ctx.quadraticCurveTo(watermarkX + watermarkWidth, watermarkY, watermarkX + watermarkWidth, watermarkY + watermarkRadius);
        ctx.lineTo(watermarkX + watermarkWidth, watermarkY + watermarkHeight - watermarkRadius);
        ctx.quadraticCurveTo(watermarkX + watermarkWidth, watermarkY + watermarkHeight, watermarkX + watermarkWidth - watermarkRadius, watermarkY + watermarkHeight);
        ctx.lineTo(watermarkX + watermarkRadius, watermarkY + watermarkHeight);
        ctx.quadraticCurveTo(watermarkX, watermarkY + watermarkHeight, watermarkX, watermarkY + watermarkHeight - watermarkRadius);
        ctx.lineTo(watermarkX, watermarkY + watermarkRadius);
        ctx.quadraticCurveTo(watermarkX, watermarkY, watermarkX + watermarkRadius, watermarkY);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add fun shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Watermark text with fun styling
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(watermarkText, watermarkX + watermarkWidth / 2, watermarkY + watermarkHeight / 2 + 8);
        
        // Add sparkle effect
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Segoe UI", system-ui, -apple-system, sans-serif';
        ctx.fillText('✨', watermarkX + watermarkWidth + 5, watermarkY + 15);
        ctx.fillText('✨', watermarkX - 15, watermarkY + watermarkHeight - 5);
        
        ctx.restore();
      }
      
      // Add subtle border
      ctx.save();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
      ctx.restore();
      
      // Convert to data URL
      const shareableImageUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve(shareableImageUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for shareable creation'));
    };
    
    img.src = originalImageUrl;
  });
};
