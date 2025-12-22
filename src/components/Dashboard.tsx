import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
// import { useTour } from './TourProvider';
import { orderService, appointmentService, userService } from '../services';
import apiService from '../services/api.service';
import { API_ENDPOINTS } from '../config/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  // const { startTour } = useTour();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [revenueTrend, setRevenueTrend] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<any>(null);

  useEffect(() => {
    fetchData();
    // const hasSeenTour = localStorage.getItem('hasSeenTour');
    // if (!hasSeenTour) {
    //   setTimeout(() => startTour(), 1000);
    // }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await userService.getMe();
      setUserPlan(user.subscriptionPlan);
      
      const promises = [
        apiService.get(API_ENDPOINTS.STATISTICS),
        apiService.get('/api/statistics/revenue-trend'),
        orderService.getAll()
      ];
      
      if (user.subscriptionPlan?.name !== 'FREE') {
        promises.push(appointmentService.getAll(0, 5));
      }
      
      const results = await Promise.allSettled(promises);
      
      if (results[0].status === 'fulfilled') setStatistics(results[0].value);
      if (results[1].status === 'fulfilled') setRevenueTrend(results[1].value);
      if (results[2].status === 'fulfilled') setOrders(results[2].value);
      if (user.subscriptionPlan?.name !== 'FREE' && results[3]?.status === 'fulfilled') {
        setAppointments(results[3].value.content);
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  const stats = [
    { icon: 'ri-user-line', value: statistics ? formatNumber(statistics.totalClients || 0) : 'Not enough data', label: 'Total Clients', change: statistics ? `${statistics.clientsGrowthPercentage >= 0 ? '+' : ''}${statistics.clientsGrowthPercentage}%` : '', trend: statistics?.clientsTrend || [] },
    { icon: 'ri-shopping-bag-line', value: statistics ? formatNumber(statistics.pendingOrders || 0) : 'Not enough data', label: 'Pending Orders', change: statistics ? `${statistics.pendingOrdersChange >= 0 ? '+' : ''}${statistics.pendingOrdersChange}` : '', trend: statistics?.pendingOrdersTrend || [] },
    { icon: 'ri-checkbox-circle-line', value: statistics ? formatNumber(statistics.completedThisMonth || 0) : 'Not enough data', label: 'Completed This Month', change: statistics ? `${statistics.completedGrowthPercentage >= 0 ? '+' : ''}${statistics.completedGrowthPercentage}%` : '', trend: statistics?.completedTrend || [] },
    { icon: 'ri-money-dollar-circle-line', value: statistics ? `$${formatNumber(statistics.revenueThisMonth || 0)}` : 'Not enough data', label: 'Revenue This Month', change: statistics ? `${statistics.revenueGrowthPercentage >= 0 ? '+' : ''}${statistics.revenueGrowthPercentage}%` : '', trend: statistics?.revenueTrend || [] }
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
        <main className="flex-1 overflow-y-auto p-6 lg:p-12" data-tour="dashboard">
          {/* Stats Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-8 mb-12">
              <Loader size="md" text="Loading dashboard..." />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
              {stats.map((stat, index) => {
                const isNegative = stat.change.startsWith('-');
                const trendData = stat.trend.map((value: number) => ({ value }));
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <i className={`${stat.icon} text-lg lg:text-xl text-gray-400`}></i>
                      {stat.change && <span className={`text-[10px] lg:text-xs font-medium ${stat.change === '+0%' || stat.change === '+0' || stat.change === '0%' || stat.change === '0' ? 'text-gray-400' : isNegative ? 'text-red-600' : 'text-green-600'}`}>{stat.change}</span>}
                    </div>
                    <div className="flex items-end justify-between gap-2 lg:gap-3">
                      <div>
                        <h3 className="text-sm lg:text-lg font-bold text-[#1A2A3A]">{stat.value}</h3>
                        <p className="text-[10px] lg:text-xs text-gray-600 mt-1">{stat.label}</p>
                      </div>
                      <div className="hidden lg:block w-20 h-12">
                        {trendData.length > 0 && (
                          <ResponsiveContainer width={80} height={48} minWidth={80} minHeight={48}>
                            <LineChart data={trendData}>
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={stat.change === '+0%' || stat.change === '+0' || stat.change === '0%' || stat.change === '0' ? '#9ca3af' : isNegative ? '#ef4444' : '#22c55e'} 
                                strokeWidth={2} 
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xs font-semibold text-[#1A2A3A] mb-4">Revenue Overview</h2>
              {!revenueTrend?.monthlyData || revenueTrend.monthlyData.length === 0 || revenueTrend.monthlyData.every((item: any) => item.revenue === 0) ? (
                <div className="flex items-center justify-center h-[250px] text-gray-500">
                  <div className="text-center">
                    <i className="ri-bar-chart-line text-4xl mb-2"></i>
                    <p className="text-sm">Not enough data</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueTrend.monthlyData.map((item: any) => ({
                    month: item.month.substring(0, 3),
                    revenue: item.revenue
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#1A2A3A" strokeWidth={2} dot={{ fill: '#1A2A3A', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Orders Status Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xs font-semibold text-[#1A2A3A] mb-4">Orders by Status</h2>
              {!statistics || (statistics.pendingOrdersCount + statistics.inProgressOrders + statistics.completedOrders + statistics.canceledOrders) === 0 ? (
                <div className="flex items-center justify-center h-[250px] text-gray-500">
                  <div className="text-center">
                    <i className="ri-pie-chart-line text-4xl mb-2"></i>
                    <p className="text-sm">Not enough data</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pending', value: statistics?.pendingOrdersCount || 0, color: '#eab308' },
                        { name: 'In Progress', value: statistics?.inProgressOrders || 0, color: '#3b82f6' },
                        { name: 'Completed', value: statistics?.completedOrders || 0, color: '#22c55e' },
                        { name: 'Cancelled', value: statistics?.canceledOrders || 0, color: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Pending', value: statistics?.pendingOrdersCount || 0, color: '#eab308' },
                        { name: 'In Progress', value: statistics?.inProgressOrders || 0, color: '#3b82f6' },
                        { name: 'Completed', value: statistics?.completedOrders || 0, color: '#22c55e' },
                        { name: 'Cancelled', value: statistics?.canceledOrders || 0, color: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Orders & Appointments */}
          <div className={`grid ${userPlan?.name === 'FREE' ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8 mb-12`}>
            {/* Recent Orders */}
            <div className={`${userPlan?.name === 'FREE' ? 'lg:col-span-1' : 'lg:col-span-2'} bg-white border border-gray-200 rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-semibold text-[#1A2A3A]">Recent Orders</h2>
                <a className="px-4 py-2 bg-[#1A2A3A] text-white text-xs font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors whitespace-nowrap" href="/orders">
                  All
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 text-[10px] font-medium text-gray-600 hidden md:table-cell">Order ID</th>
                      <th className="text-left py-3 px-3 text-[10px] font-medium text-gray-600">Client</th>
                      <th className="text-left py-3 px-3 text-[10px] font-medium text-gray-600 hidden sm:table-cell">Item</th>
                      <th className="text-left py-3 px-3 text-[10px] font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-3 text-[10px] font-medium text-gray-600 hidden lg:table-cell">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-xs text-gray-500">
                          No orders yet
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 text-xs text-[#1A2A3A] font-medium hidden md:table-cell">{order.id.substring(0, 8)}</td>
                        <td className="py-3 px-3 text-xs text-gray-700">{order.client.name}</td>
                        <td className="py-3 px-3 text-xs text-gray-700 hidden sm:table-cell">{order.name}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border whitespace-nowrap ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-700 hidden lg:table-cell">{new Date(order.dueDate).toLocaleDateString()}</td>
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
              <h2 className="text-xs font-semibold text-[#1A2A3A] mb-6">Upcoming Appointments</h2>
              <div className="space-y-6">
                {loading ? (
                  <div className="py-6 text-center">
                    <Loader size="sm" />
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-500">
                    No upcoming appointments
                  </div>
                ) : appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                      <i className="ri-calendar-line text-xl text-[#1A2A3A]"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium text-[#1A2A3A] mb-1">{appointment.client.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{appointment.type}</p>
                      <div className="flex items-center space-x-4 text-[10px] text-gray-600">
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
              <a href="/appointments" className="block w-full mt-6 px-4 py-2 bg-gray-100 text-[#1A2A3A] text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap text-center">
                View All Appointments
              </a>
            </div>
            )}
          </div>


        </main>
      </div>
      
      {/* Manual Tour Button */}
      {/* <button 
        onClick={startTour}
        className="fixed bottom-24 right-8 w-12 h-12 bg-[#1A2A3A] text-white rounded-full shadow-lg hover:bg-[#2F2F2F] transition-all hover:scale-110 flex items-center justify-center z-[9998]"
        title="Take Tour"
      >
        <i className="ri-guide-line text-xl"></i>
      </button> */}
    </div>
  );
};

export default Dashboard;