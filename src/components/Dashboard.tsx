import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { orderService, appointmentService, userService } from '../services';
import apiService from '../services/api.service';
import { API_ENDPOINTS } from '../config/api';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await userService.getMe();
      setUserPlan(user.subscriptionPlan);
      
      const promises = [
        apiService.get(API_ENDPOINTS.STATISTICS),
        orderService.getAll()
      ];
      
      if (user.subscriptionPlan?.name !== 'FREE') {
        promises.push(appointmentService.getAll(0, 5));
      }
      
      const results = await Promise.allSettled(promises);
      
      if (results[0].status === 'fulfilled') setStatistics(results[0].value);
      if (results[1].status === 'fulfilled') setOrders(results[1].value);
      if (user.subscriptionPlan?.name !== 'FREE' && results[2]?.status === 'fulfilled') {
        setAppointments(results[2].value.content);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'IN_PROGRESS': 'bg-blue-100 text-blue-700 border-blue-200',
      'COMPLETED': 'bg-green-100 text-green-700 border-green-200',
      'CANCELLED': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  console.log('Statistics state:', statistics);
  console.log('User plan:', userPlan);

  const stats = [
    { icon: 'ri-user-line', value: statistics?.totalClients?.toString() || '0', label: 'Total Clients', change: statistics ? `${statistics.clientsGrowthPercentage >= 0 ? '+' : ''}${statistics.clientsGrowthPercentage}%` : '+0%' },
    { icon: 'ri-shopping-bag-line', value: statistics?.pendingOrders?.toString() || '0', label: 'Pending Orders', change: statistics ? `${statistics.pendingOrdersChange >= 0 ? '+' : ''}${statistics.pendingOrdersChange}` : '+0' },
    { icon: 'ri-checkbox-circle-line', value: statistics?.completedThisMonth?.toString() || '0', label: 'Completed This Month', change: statistics ? `${statistics.completedGrowthPercentage >= 0 ? '+' : ''}${statistics.completedGrowthPercentage}%` : '+0%' },
    { icon: 'ri-money-dollar-circle-line', value: `$${statistics?.revenueThisMonth?.toLocaleString() || '0'}`, label: 'Revenue This Month', change: statistics ? `${statistics.revenueGrowthPercentage >= 0 ? '+' : ''}${statistics.revenueGrowthPercentage}%` : '+0%' }
  ];

  console.log('Stats array:', stats);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatAppointmentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} title="Dashboard" subtitle="Welcome back, John! Here's what's happening today." />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          {/* Stats Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-12 mb-12">
              <Loader size="md" text="Loading dashboard..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => {
                const isNegative = stat.change.startsWith('-');
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>{stat.change}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-[#1A2A3A] mb-1">{stat.value}</h3>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recent Orders & Appointments */}
          <div className={`grid ${userPlan?.name === 'FREE' ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8 mb-12`}>
            {/* Recent Orders */}
            <div className={`${userPlan?.name === 'FREE' ? 'lg:col-span-1' : 'lg:col-span-2'} bg-white border border-gray-200 rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-[#1A2A3A]">Recent Orders</h2>
                <a className="px-6 py-3 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors whitespace-nowrap" href="/orders">
                  All
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-xs font-medium text-gray-600 hidden md:table-cell">Order ID</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-gray-600">Client</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-gray-600 hidden sm:table-cell">Item</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-gray-600">Status</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-gray-600 hidden lg:table-cell">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                          No orders yet
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-[#1A2A3A] font-medium hidden md:table-cell">{order.id.substring(0, 8)}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{order.client.name}</td>
                        <td className="py-4 px-4 text-sm text-gray-700 hidden sm:table-cell">{order.name}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 hidden lg:table-cell">{new Date(order.dueDate).toLocaleDateString()}</td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Appointments */}
            {userPlan?.name !== 'FREE' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-[#1A2A3A] mb-6">Upcoming Appointments</h2>
              <div className="space-y-6">
                {loading ? (
                  <div className="py-8 text-center">
                    <Loader size="sm" />
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">
                    No upcoming appointments
                  </div>
                ) : appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                      <i className="ri-calendar-line text-xl text-[#1A2A3A]"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#1A2A3A] mb-1">{appointment.client.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{appointment.type}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center">
                          <i className="ri-time-line mr-1"></i>{appointment.appointmentTime}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-calendar-2-line mr-1"></i>{formatAppointmentDate(appointment.appointmentDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/appointments" className="block w-full mt-6 px-6 py-3 bg-gray-100 text-[#1A2A3A] text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap text-center">
                View All Appointments
              </a>
            </div>
            )}
          </div>


        </main>
      </div>
    </div>
  );
};

export default Dashboard;