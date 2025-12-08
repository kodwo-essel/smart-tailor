import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { orderService, Order } from '../services';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const data = await orderService.getById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
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

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="orders" />
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" text="Loading order..." />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="orders" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-file-warning-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="orders" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} title="Order Details" />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/orders')}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#1A2A3A] transition-colors"
              >
                <i className="ri-arrow-left-line text-xl"></i>
                <span className="text-sm font-medium">Back to Orders</span>
              </button>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
                <button
                  onClick={() => navigate('/orders', { state: { editOrder: order } })}
                  className="px-4 py-2 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors flex items-center space-x-2"
                >
                  <i className="ri-edit-line"></i>
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#1A2A3A] mb-2">{order.name}</h2>
                  <p className="text-sm text-gray-600">Order ID: {order.id.substring(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#1A2A3A]">${order.price}</p>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Client</p>
                  <p className="text-xs font-semibold text-[#1A2A3A]">{order.client.name}</p>
                  <p className="text-xs text-gray-600">{order.client.phoneNumber}</p>
                  <p className="text-xs text-gray-600">{order.client.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tailor</p>
                  <p className="text-xs font-semibold text-[#1A2A3A]">{order.tailor.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Due Date</p>
                  <p className="text-xs font-semibold text-[#1A2A3A]">{new Date(order.dueDate).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600 mt-2">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {order.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Notes</p>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Measurements */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#1A2A3A] mb-4">Measurements</h3>
              <div className="mb-4 flex items-center gap-4">
                {order.measurement.name && (
                  <p className="text-sm text-gray-600">Name: <span className="font-semibold text-[#1A2A3A]">{order.measurement.name}</span></p>
                )}
                <p className="text-sm text-gray-600">Type: <span className="font-semibold text-[#1A2A3A]">{order.measurement.type}</span></p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(order.measurement.data).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-xs font-semibold text-[#1A2A3A]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetails;
