import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function TypewriterText({ text, className, style }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <h2 className={className} style={style}>
      {displayText}
      <span className="animate-pulse">|</span>
    </h2>
  );
}