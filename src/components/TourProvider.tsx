import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TourGuide from './TourGuide';

interface TourContextType {
  startTour: () => void;
  closeTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within TourProvider');
  }
  return context;
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTour, setShowTour] = useState(false);
  const navigate = useNavigate();

  const tourSteps = [
    {
      target: '[data-tour="dashboard"]',
      title: 'Welcome to Your Dashboard',
      content: 'This is your business overview showing key metrics, charts, and recent activity. Everything you need to monitor your tailoring business at a glance.',
      position: 'bottom' as const,
      route: '/dashboard'
    },
    {
      target: '[data-tour="add-client"]',
      title: 'Manage Your Clients',
      content: 'Here you can view all your clients and their information. Click the "Add Client" button to register new customers.',
      position: 'bottom' as const,
      route: '/clients'
    },
    {
      target: '[data-tour="add-template"]',
      title: 'Measurement Templates',
      content: 'Create and manage measurement templates for different garment types. Use "Add Template" to create new measurement forms.',
      position: 'bottom' as const,
      route: '/templates'
    },
    {
      target: '[data-tour="add-order"]',
      title: 'Order Management',
      content: 'Track all your orders from creation to completion. Click "Add Order" to create new orders for your clients.',
      position: 'bottom' as const,
      route: '/orders'
    },
    {
      target: '[data-tour="profile-tab"]',
      title: 'Profile Settings',
      content: 'Manage your personal and business information here. Update your details, business name, and contact information.',
      position: 'right' as const,
      route: '/settings'
    },
    {
      target: '[data-tour="billing-tab"]',
      title: 'Billing & Subscription',
      content: 'View your current plan and upgrade options. Manage your subscription and billing preferences from here.',
      position: 'right' as const,
      route: '/settings',
      action: () => {
        setTimeout(() => {
          const billingTab = document.querySelector('[data-tour="billing-tab"]') as HTMLElement;
          if (billingTab) billingTab.click();
        }, 500);
      }
    }
  ];

  const startTour = () => {
    setShowTour(true);
  };

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  return (
    <TourContext.Provider value={{ startTour, closeTour }}>
      {children}
      <TourGuide 
        steps={tourSteps}
        isOpen={showTour}
        onClose={closeTour}
      />
    </TourContext.Provider>
  );
};