import React from 'react';

interface WatermarkProps {
  isVisible: boolean;
  className?: string;
}

export const Watermark: React.FC<WatermarkProps> = ({ isVisible, className = '' }) => {
  if (!isVisible) return null;

  return (
    <div className={`absolute bottom-4 right-4 z-10 ${className}`}>
      <div className="bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg">
        <span className="text-sm font-bold tracking-wide">
          👣 Rated by FootRateAI.com
        </span>
      </div>
    </div>
  );
};

export const WatermarkOverlay: React.FC<WatermarkProps> = ({ isVisible, className = '' }) => {
  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg">
          <span className="text-sm font-bold tracking-wide">
            👣 Rated by FootRateAI.com
          </span>
        </div>
      </div>
    </div>
  );
};
