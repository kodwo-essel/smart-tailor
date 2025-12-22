import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  route?: string;
  action?: () => void;
}

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
}

const TourGuide: React.FC<TourGuideProps> = ({ steps, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && steps[currentStep]) {
      const step = steps[currentStep];
      
      // Handle first step setup
      if (step.route) {
        navigate(step.route);
      }
      
      if (step.action) {
        step.action();
      }
      
      // Find element after navigation
      setTimeout(() => {
        const element = document.querySelector(step.target) as HTMLElement;
        setTargetElement(element);
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 800);
    }
  }, [isOpen, currentStep, steps, navigate]); // Add dependencies back

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen || !steps[currentStep]) return null;

  const step = steps[currentStep];
  let tooltipPosition = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  
  if (targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const offset = 20;
    
    switch (step.position) {
      case 'top':
        tooltipPosition = { top: rect.top - offset, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)' };
        break;
      case 'bottom':
        tooltipPosition = { top: rect.bottom + offset, left: rect.left + rect.width / 2, transform: 'translate(-50%, 0)' };
        break;
      case 'left':
        tooltipPosition = { top: rect.top + rect.height / 2, left: rect.left - offset, transform: 'translate(-100%, -50%)' };
        break;
      case 'right':
        tooltipPosition = { top: rect.top + rect.height / 2, left: rect.right + offset, transform: 'translate(0, -50%)' };
        break;
    }
  }

  return (
    <div 
      className="fixed bg-white rounded-lg shadow-2xl border p-6 max-w-sm z-[9999] pointer-events-auto"
      style={tooltipPosition}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#1A2A3A]">{step.title}</h3>
        <button onClick={skipTour} className="text-gray-400 hover:text-gray-600">
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">{step.content}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-[#1A2A3A]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={skipTour}
            className="px-3 py-1 text-xs text-gray-600 hover:text-[#1A2A3A] transition-colors"
          >
            Skip
          </button>
          {currentStep > 0 && (
            <button 
              onClick={prevStep}
              className="px-3 py-1 text-xs text-gray-600 hover:text-[#1A2A3A] transition-colors"
            >
              Back
            </button>
          )}
          <button 
            onClick={nextStep}
            className="px-4 py-2 bg-[#1A2A3A] text-white text-xs font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourGuide;