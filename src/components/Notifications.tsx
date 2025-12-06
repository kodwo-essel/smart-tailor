import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { notificationService, Notification } from '../services';

const Notifications: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: { icon: string; color: string } } = {
      'ORDER': { icon: 'ri-shopping-bag-line', color: 'bg-blue-100 text-blue-600' },
      'APPOINTMENT': { icon: 'ri-calendar-line', color: 'bg-green-100 text-green-600' },
      'PAYMENT': { icon: 'ri-money-dollar-circle-line', color: 'bg-yellow-100 text-yellow-600' },
      'REMINDER': { icon: 'ri-alarm-line', color: 'bg-orange-100 text-orange-600' },
      'SYSTEM': { icon: 'ri-information-line', color: 'bg-gray-100 text-gray-600' }
    };
    return icons[type] || icons['SYSTEM'];
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="notifications" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen} 
          title="Notifications" 
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'all' ? 'bg-[#1A2A3A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                  filter === 'unread' ? 'bg-[#1A2A3A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>Unread</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center">
                <i className="ri-loader-4-line animate-spin text-3xl text-gray-400"></i>
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-12 text-center">
                <i className="ri-notification-line text-3xl text-gray-400"></i>
                <p className="text-sm text-gray-500 mt-2">No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const iconConfig = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`bg-white border rounded-xl p-4 hover:shadow-md transition-shadow ${
                      notification.isRead ? 'border-gray-200' : 'border-[#1A2A3A] bg-[#1A2A3A]/5'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 ${iconConfig.color}`}>
                        <i className={`${iconConfig.icon} text-xl`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-sm font-semibold text-[#1A2A3A]">{notification.title}</h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        {notification.order && (
                          <div className="text-xs text-gray-500 mb-2">
                            Order: {notification.order.name} - {notification.order.clientName}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-[#1A2A3A] hover:underline font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
