import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { orderService, Order, clientService } from '../services';

const Orders: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-blue-100 text-blue-700 border-blue-200',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'COMPLETED': 'bg-green-100 text-green-700 border-green-200',
      'CANCELED': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const totalOrders = orders.length;
  const inProgressOrders = orders.filter(o => o.status === 'IN_PROGRESS').length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);

  const stats = [
    { icon: 'ri-shopping-bag-line', value: totalOrders.toString(), label: 'Total Orders', color: 'bg-[#1A2A3A]' },
    { icon: 'ri-time-line', value: inProgressOrders.toString(), label: 'In Progress', color: 'bg-[#1A2A3A]' },
    { icon: 'ri-checkbox-circle-line', value: completedOrders.toString(), label: 'Completed', color: 'bg-[#1A2A3A]' },
    { icon: 'ri-money-dollar-circle-line', value: `$${totalRevenue.toLocaleString()}`, label: 'Total Revenue', color: 'bg-[#1A2A3A]' }
  ];

  const statusFilters = ['All', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];



  const handleCreateOrder = async (orderData: any) => {
    try {
      console.log('Creating order:', orderData);
      await orderService.create(orderData);
      await fetchOrders();
      setShowModal(false);
    } catch (error: any) {
      console.error('Failed to create order:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to create order: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  const handleEditOrder = async (orderData: any) => {
    try {
      if (editingOrder) {
        console.log('Updating order:', editingOrder.id, orderData);
        await orderService.update(editingOrder.id, orderData);
        await fetchOrders();
        setShowModal(false);
        setEditingOrder(null);
      }
    } catch (error: any) {
      console.error('Failed to update order:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to update order: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || order.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="orders" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen} 
          title="Orders" 
          subtitle="Manage and track all your orders"
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold text-[#1A2A3A] mb-1">{stat.value}</h3>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              {statusFilters.map((filter) => (
                <button 
                  key={filter}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activeFilter === filter 
                      ? 'bg-[#1A2A3A] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
              <input 
                placeholder="Search orders..."
                className="pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto md:overflow-visible">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A] hidden lg:table-cell">Order ID</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A]">Client</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A] hidden md:table-cell">Item</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A]">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A] hidden xl:table-cell">Type</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A] hidden xl:table-cell">Due Date</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A] hidden lg:table-cell">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <Loader size="md" text="Loading orders..." />
                      </td>
                    </tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <i className="ri-shopping-bag-line text-3xl text-gray-400"></i>
                        <p className="text-sm text-gray-500 mt-2">No orders found</p>
                      </td>
                    </tr>
                  ) : paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors relative">
                      <td className="py-4 px-6 text-sm text-[#1A2A3A] font-medium hidden lg:table-cell">{order.id.substring(0, 8)}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{order.client.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 hidden md:table-cell">{order.name}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 hidden xl:table-cell">{order.measurement.type}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 hidden xl:table-cell">{new Date(order.dueDate).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-sm text-[#1A2A3A] font-medium hidden lg:table-cell">${order.price}</td>
                      <td className="py-4 px-6">
                        <div className="md:flex items-center space-x-2 hidden">
                          <a href={`/orders/${order.id}`} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                            <i className="ri-eye-line text-lg text-gray-600"></i>
                          </a>
                          <button 
                            onClick={() => openEditModal(order)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <i className="ri-edit-line text-lg text-gray-600"></i>
                          </button>
                        </div>
                        <div className="md:hidden">
                          <a href={`/orders/${order.id}`} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                            <i className="ri-eye-line text-lg text-gray-600"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-3 mt-8 mb-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm border rounded-lg ${
                      currentPage === page 
                        ? 'bg-[#1A2A3A] text-white border-[#1A2A3A]' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => {
          setEditingOrder(null);
          setShowModal(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#1A2A3A] text-white rounded-full shadow-lg hover:bg-[#2F2F2F] transition-all hover:scale-110 flex items-center justify-center z-40"
      >
        <i className="ri-add-line text-2xl"></i>
      </button>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#1A2A3A]">{editingOrder ? 'Edit Order' : 'Create New Order'}</h3>
                  <p className="text-sm text-gray-500 mt-1">{editingOrder ? 'Update order details' : 'Start a new order for your client'}</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-400"></i>
                </button>
              </div>
              
              <OrderForm 
                order={editingOrder}
                onSave={editingOrder ? handleEditOrder : handleCreateOrder} 
                onCancel={() => {
                  setShowModal(false);
                  setEditingOrder(null);
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderForm: React.FC<{
  order?: Order | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ order, onSave, onCancel }) => {
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    client: order?.client.name || '',
    item: order?.name || '',
    template: order?.measurement.type || '',
    measurementId: order?.measurement.id || '',
    status: order?.status || 'PENDING',
    dueDate: order?.dueDate ? new Date(order.dueDate).toISOString().split('T')[0] : getDefaultDueDate(),
    amount: order?.price ? `$${order.price}` : '',
    notes: order?.notes || ''
  });
  const [clients, setClients] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (formData.client) {
      const selectedClient = clients.find(c => c.name === formData.client);
      if (selectedClient) {
        fetchMeasurements(selectedClient.id);
      }
    } else {
      setMeasurements([]);
    }
  }, [formData.client, clients]);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const fetchMeasurements = async (clientId: string) => {
    try {
      const { measurementService } = await import('../services');
      const data = await measurementService.getByClientId(clientId);
      setMeasurements(data);
    } catch (error) {
      console.error('Failed to fetch measurements:', error);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    try {
      const selectedClient = clients.find(c => c.name === formData.client);
      const submitData: any = {
        name: formData.item,
        status: formData.status,
        dueDate: formData.dueDate,
        price: parseFloat(formData.amount.replace('$', '')),
        notes: formData.notes
      };
      
      // Add clientId only for create, measurementId for both
      if (!order) {
        submitData.clientId = selectedClient?.id;
      }
      if (formData.measurementId) {
        submitData.measurementId = formData.measurementId;
      }
      
      await onSave(submitData);
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Client</label>
          <select
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value, measurementId: '', template: '' })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
            required
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.name}>{client.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
            required
          />
        </div>
      </div>
      
      {/* Client Measurements */}
      {formData.client && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Select Measurement (Optional)</label>
          <select
            value={formData.measurementId}
            onChange={(e) => {
              const selectedMeasurement = measurements.find(m => m.id === e.target.value);
              setFormData({ 
                ...formData, 
                measurementId: e.target.value,
                template: selectedMeasurement?.type || ''
              });
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
          >
            <option value="">No measurement selected</option>
            {measurements.map((measurement) => (
              <option key={measurement.id} value={measurement.id}>
                {measurement.type} - {new Date(measurement.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Garment Type */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Garment Type</label>
        <input
          type="text"
          value={formData.item}
          onChange={(e) => setFormData({ ...formData, item: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
          placeholder="e.g., Wedding Dress, Business Suit, Casual Shirt"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
            required
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={formData.amount.replace('$', '')}
              onChange={(e) => setFormData({ ...formData, amount: `$${e.target.value}` })}
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
              placeholder="0.00"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent resize-none transition-all"
          placeholder="Special requirements, fabric details, etc..."
        />
      </div>
      
      <div className="flex space-x-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-[#1A2A3A] text-white font-medium rounded-xl hover:bg-[#2F2F2F] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <i className="ri-loader-4-line animate-spin text-lg text-white"></i>
          ) : (
            <>
              <i className={`${order ? 'ri-save-line' : 'ri-add-line'} text-lg`}></i>
              <span>{order ? 'Update Order' : 'Create Order'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Orders;