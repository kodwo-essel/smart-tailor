import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        {/* Rotating scissors */}
        <div className={`${sizeClasses[size]} relative animate-spin`} style={{ animationDuration: '2s' }}>
          <i className="ri-scissors-cut-line text-[#1A2A3A] absolute inset-0 flex items-center justify-center text-2xl"></i>
        </div>
        
        {/* Pulsing circle behind */}
        <div 
          className={`${sizeClasses[size]} absolute inset-0 rounded-full bg-[#D9C7A8] opacity-20 animate-ping`}
          style={{ animationDuration: '2s' }}
        ></div>
      </div>
      
      {text && (
        <p className={`${textSizes[size]} text-gray-600 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
