import React, { useState, useEffect } from 'react';
import { authService, notificationService } from '../services';
import websocketService from '../services/websocket.service';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, title, subtitle }) => {
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
    fetchUnreadCount();
    
    websocketService.connect(() => {
      fetchUnreadCount();
    });

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 lg:px-12">
      <div className="flex items-center space-x-4">
        <button 
          className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <i className="ri-menu-line text-2xl text-[#1A2A3A]"></i>
        </button>
        <div>
          <h1 className="text-xs font-semibold text-[#1A2A3A]">{title}</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <a href="/notifications" className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors relative">
          <i className="ri-notification-line text-2xl text-gray-700"></i>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 px-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </a>
      </div>
    </header>
  );
};

export default Header;