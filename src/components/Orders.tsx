import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { orderService, Order, clientService } from '../services';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const Orders: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const state = location.state as { editOrder?: Order };
    if (state?.editOrder) {
      setEditingOrder(state.editOrder);
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  const totalOrders = orders.length;
  const inProgressOrders = orders.filter(o => o.status === 'IN_PROGRESS').length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);

  const stats = [
    { icon: 'ri-shopping-bag-line', value: formatNumber(totalOrders), label: 'Total Orders', color: 'bg-[#1A2A3A]' },
    { icon: 'ri-time-line', value: formatNumber(inProgressOrders), label: 'In Progress', color: 'bg-[#1A2A3A]' },
    { icon: 'ri-checkbox-circle-line', value: formatNumber(completedOrders), label: 'Completed', color: 'bg-[#1A2A3A]' },
    { icon: 'ri-money-dollar-circle-line', value: `$${formatNumber(totalRevenue)}`, label: 'Total Revenue', color: 'bg-[#1A2A3A]' }
  ];

  const statusFilters = [
    { value: 'All', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELED', label: 'Canceled' }
  ];



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
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(order.status);
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 hover:shadow-md transition-shadow">
                <h3 className="text-sm lg:text-lg font-bold text-[#1A2A3A] mb-1">{stat.value}</h3>
                <p className="text-[10px] lg:text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  <span className="flex items-center gap-2">
                    <i className="ri-filter-line text-sm"></i>
                    Filter
                    {activeFilters.length > 0 && (
                      <span className="bg-[#1A2A3A] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {activeFilters.length}
                      </span>
                    )}
                  </span>
                  <i className="ri-arrow-down-s-line text-sm"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="p-0">Status</DropdownMenuLabel>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={() => setActiveFilters([])}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {statusFilters.filter(f => f.value !== 'All').map((filter) => (
                    <div
                      key={filter.value}
                      onClick={() => {
                        setActiveFilters(prev => 
                          prev.includes(filter.value)
                            ? prev.filter(f => f !== filter.value)
                            : [...prev, filter.value]
                        );
                      }}
                      className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        {activeFilters.includes(filter.value) && (
                          <i className="ri-check-line text-sm"></i>
                        )}
                      </span>
                      {filter.label}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="relative w-full lg:w-auto">
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
              <input 
                placeholder="Search orders..."
                className="w-full lg:w-auto pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
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
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#1A2A3A] hidden lg:table-cell">Order ID</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#1A2A3A]">Client</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#1A2A3A] hidden md:table-cell">Item</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#1A2A3A]">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#1A2A3A] hidden xl:table-cell">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#1A2A3A] hidden xl:table-cell">Due Date</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#1A2A3A] hidden lg:table-cell">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#1A2A3A]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center">
                        <Loader size="md" text="Loading orders..." />
                      </td>
                    </tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center">
                        <i className="ri-shopping-bag-line text-xl text-gray-400"></i>
                        <p className="text-xs text-gray-500 mt-2">No orders found</p>
                      </td>
                    </tr>
                  ) : paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors relative">
                      <td className="py-3 px-4 text-xs text-[#1A2A3A] font-medium hidden lg:table-cell">{order.id.substring(0, 8)}</td>
                      <td className="py-3 px-4 text-xs text-gray-700">{order.client.name}</td>
                      <td className="py-3 px-4 text-xs text-gray-700 hidden md:table-cell">{order.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border whitespace-nowrap ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-700 hidden xl:table-cell">{order.measurement.type}</td>
                      <td className="py-3 px-4 text-xs text-gray-700 hidden xl:table-cell">{new Date(order.dueDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-xs text-[#1A2A3A] font-medium hidden lg:table-cell">${order.price}</td>
                      <td className="py-3 px-4">
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
              <div className="mt-8 mb-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      if (totalPages <= 7 || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
        data-tour="add-order"
      >
        <i className="ri-add-line text-2xl"></i>
      </button>

      {/* Create Order Modal */}
      {showModal && (
        <Dialog open={true} onOpenChange={() => setShowModal(false)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#1A2A3A]">{editingOrder ? 'Edit Order' : 'Create New Order'}</DialogTitle>
              <DialogDescription>
                {editingOrder ? 'Update order details' : 'Start a new order for your client'}
              </DialogDescription>
            </DialogHeader>
            <OrderForm 
              order={editingOrder}
              onSave={editingOrder ? handleEditOrder : handleCreateOrder} 
              onCancel={() => {
                setShowModal(false);
                setEditingOrder(null);
              }} 
            />
          </DialogContent>
        </Dialog>
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
    dueDate: order?.dueDate ? new Date(order.dueDate) : new Date(getDefaultDueDate()),
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
        dueDate: formData.dueDate.toISOString().split('T')[0],
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client</Label>
          <Select value={formData.client} onValueChange={(value) => setFormData({ ...formData, client: value, measurementId: '', template: '' })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Due Date</Label>
          <DatePicker
            date={formData.dueDate}
            onDateChange={(date) => setFormData({ ...formData, dueDate: date || new Date() })}
          />
        </div>
      </div>
      
      {formData.client && (
        <div className="space-y-2">
          <Label>Select Measurement (Optional)</Label>
          <Select value={formData.measurementId} onValueChange={(value) => {
            const selectedMeasurement = measurements.find(m => m.id === value);
            setFormData({ 
              ...formData, 
              measurementId: value,
              template: selectedMeasurement?.type || ''
            });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="No measurement selected" />
            </SelectTrigger>
            <SelectContent>
              {measurements.map((measurement) => (
                <SelectItem key={measurement.id} value={measurement.id}>
                  {measurement.type} - {new Date(measurement.createdAt).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="item">Garment Type</Label>
        <Input
          id="item"
          value={formData.item}
          onChange={(e) => setFormData({ ...formData, item: e.target.value })}
          placeholder="e.g., Wedding Dress, Business Suit, Casual Shirt"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="amount"
              type="number"
              value={formData.amount.replace('$', '')}
              onChange={(e) => setFormData({ ...formData, amount: `$${e.target.value}` })}
              className="pl-7"
              placeholder="0.00"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Special requirements, fabric details, etc..."
        />
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? (
            <i className="ri-loader-4-line animate-spin text-lg"></i>
          ) : (
            <>
              <i className={`${order ? 'ri-save-line' : 'ri-add-line'} text-lg mr-2`}></i>
              {order ? 'Update Order' : 'Create Order'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default Orders;