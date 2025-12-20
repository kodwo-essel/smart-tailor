import React, { useState, useEffect } from 'react';
import { authService, userService } from '../services';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, currentPage }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    fetchUserData();

    // Listen for custom events for same-tab updates
    const handleUserDataUpdate = () => {
      fetchUserData();
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await userService.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Fallback to localStorage data
      const cachedUser = authService.getUser();
      setUser(cachedUser);
    }
  };

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
  }, [collapsed]);

  const appointmentsEnabled = user?.subscriptionPlan?.appointmentsEnabled ?? false;
  
  const navItems = [
    { href: '/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard', key: 'dashboard' },
    { href: '/clients', icon: 'ri-user-line', label: 'Clients', key: 'clients' },
    ...(appointmentsEnabled ? [{ href: '/appointments', icon: 'ri-calendar-line', label: 'Appointments', key: 'appointments' }] : []),
    { href: '/templates', icon: 'ri-ruler-line', label: 'Templates', key: 'templates' },
    { href: '/orders', icon: 'ri-shopping-bag-line', label: 'Orders', key: 'orders' },
    { href: '/settings', icon: 'ri-settings-line', label: 'Settings', key: 'settings' }
  ];

  return (
    <>
    <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200">
          <a className="flex items-center space-x-3" href="/">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
            </div>
            {!collapsed && <span className="text-lg font-bold text-[#1A2A3A]">Smart Tailor</span>}
          </a>
          <button 
            className="lg:hidden w-8 h-8 flex items-center justify-center hover:bg-[#F7F6F3] rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ri-close-line text-xl text-[#2F2F2F]"></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-visible py-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.key;
              const classes = [
                'flex items-center px-4 py-3 rounded-lg transition-colors',
                collapsed ? 'justify-center' : 'space-x-4',
                isActive ? 'bg-[#1A2A3A] text-white' : 'text-[#2F2F2F] hover:bg-[#F7F6F3]'
              ].join(' ');
              
              return (
                <li key={item.key} className="relative group">
                  <a className={classes} href={item.href}>
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className={item.icon + ' text-xl'}></i>
                    </div>
                    {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                  </a>
                  {collapsed && (
                    <div className="fixed left-20 px-3 py-2 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[100] pointer-events-none" style={{ top: `${item.key === 'dashboard' ? '8rem' : item.key === 'clients' ? '11rem' : item.key === 'appointments' ? '14rem' : item.key === 'templates' ? '17rem' : item.key === 'orders' ? '20rem' : '23rem'}` }}>
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1A2A3A]"></div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          {collapsed ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-gray-700">
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#F7F6F3] rounded-lg transition-colors group relative"
              >
                <i className="ri-logout-box-r-line text-lg text-[#2F2F2F]"></i>
                <div className="fixed left-20 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[100] pointer-events-none" style={{ top: 'calc(100vh - 5rem)' }}>
                  Logout
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-600"></div>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-gray-700">
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A2A3A] truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-[#2F2F2F] truncate">{user?.email || ''}</p>
              </div>
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#F7F6F3] rounded-lg transition-colors"
              >
                <i className="ri-logout-box-r-line text-lg text-[#2F2F2F]"></i>
              </button>
            </div>
          )}
        </div>
      </div>

    </aside>
    
    {/* Sidebar Toggle Button */}
    <button 
      className="hidden lg:flex fixed top-1/2 -translate-y-1/2 w-8 h-12 items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-md z-40"
      style={{ left: collapsed ? '80px' : '256px', borderRadius: '0 8px 8px 0' }}
      onClick={() => setCollapsed(!collapsed)}
    >
      <i className={(collapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line') + ' text-xl text-[#2F2F2F]'}></i>
    </button>
    
    {showLogoutModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6">
            <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
          </div>
          <h2 className="text-lg font-bold text-[#1A2A3A] text-center mb-3">Logout</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Are you sure you want to logout from your account?
          </p>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                authService.logout();
                window.location.href = '/signin';
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Sidebar;
