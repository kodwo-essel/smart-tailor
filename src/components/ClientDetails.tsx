import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService, uploadService, Client, measurementService } from '../services';
import { useToast } from './ToastContainer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [measurementPage, setMeasurementPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [editingMeasurement, setEditingMeasurement] = useState<any>(null);
  const measurementsPerPage = 3;
  const ordersPerPage = 3;

  useEffect(() => {
    if (id) {
      fetchClient(id);
    }
  }, [id]);

  const fetchClient = async (clientId: string) => {
    try {
      setLoading(true);
      const [clientData, measurementsData] = await Promise.all([
        clientService.getById(clientId),
        measurementService.getByClientId(clientId)
      ]);
      setClient(clientData);
      setMeasurements(measurementsData);
      
      // Fetch orders separately
      try {
        const { default: apiService } = await import('../services/api.service');
        const ordersData = await apiService.get(`/api/clients/${clientId}/orders?page=0&size=100`);
        setOrders(ordersData.content || []);
      } catch (orderError) {
        console.error('Failed to fetch orders:', orderError);
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch client:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="clients" />
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" text="Loading client..." />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="clients" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-user-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Client not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="clients" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} title="Client Details" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          <button 
            onClick={() => navigate('/clients')}
            className="flex items-center space-x-2 text-[#2F2F2F] hover:text-[#1A2A3A] mb-4 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
            <span className="text-sm font-medium">Back to Clients</span>
          </button>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Client Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full mb-4 overflow-hidden">
                    {client.profileImageUrl ? (
                      <img src={client.profileImageUrl} alt={client.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-gray-700">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#1A2A3A] mb-2">{client.name}</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-phone-line text-lg text-[#2F2F2F]"></i>
                    </div>
                    <div>
                      <p className="text-xs text-[#2F2F2F] mb-1">Phone</p>
                      <p className="text-sm font-medium text-[#1A2A3A]">{client.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-mail-line text-lg text-[#2F2F2F]"></i>
                    </div>
                    <div>
                      <p className="text-xs text-[#2F2F2F] mb-1">Email</p>
                      <p className="text-sm font-medium text-[#1A2A3A]">{client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-map-pin-line text-lg text-[#2F2F2F]"></i>
                    </div>
                    <div>
                      <p className="text-xs text-[#2F2F2F] mb-1">Notes</p>
                      <p className="text-sm font-medium text-[#1A2A3A]">{client.notes || 'No notes'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-calendar-line text-lg text-[#2F2F2F]"></i>
                    </div>
                    <div>
                      <p className="text-xs text-[#2F2F2F] mb-1">Client Since</p>
                      <p className="text-sm font-medium text-[#1A2A3A]">{new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="w-full px-4 py-2 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors"
                  >
                    Edit Client Info
                  </button>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Client
                  </button>
                </div>
              </div>
            </div>

            {/* Measurements and Orders */}
            <div className="lg:col-span-2 space-y-8">
              {/* Measurements */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#1A2A3A]">Measurements</h3>
                  <button 
                    onClick={() => setShowMeasurementModal(true)}
                    className="flex items-center space-x-2 text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors"
                  >
                    <i className="ri-add-circle-line text-2xl"></i>
                    <span className="text-sm font-medium hidden sm:inline">Add Measurement</span>
                    <span className="text-sm font-medium sm:hidden">Add</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {measurements.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <i className="ri-ruler-line text-2xl mb-2"></i>
                      <p className="text-sm">No measurements yet</p>
                    </div>
                  ) : (
                    <>
                      {measurements
                        .slice((measurementPage - 1) * measurementsPerPage, measurementPage * measurementsPerPage)
                        .map((measurement) => (
                          <div key={measurement.id} className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-xs font-semibold text-[#1A2A3A]">{measurement.type}</h4>
                                <p className="text-xs text-gray-600">{new Date(measurement.createdAt).toLocaleDateString()}</p>
                              </div>
                              <button
                                onClick={() => setEditingMeasurement(measurement)}
                                className="px-3 py-1.5 text-sm text-[#1A2A3A] hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <i className="ri-edit-line"></i>
                                Edit
                              </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(measurement.data).map(([key, value]) => (
                                <div key={key}>
                                  <p className="text-xs text-gray-600 mb-1 capitalize">{key}</p>
                                  <p className="text-xs font-semibold text-[#1A2A3A]">{value as string}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      }
                      {Math.ceil(measurements.length / measurementsPerPage) > 1 && (
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => measurementPage > 1 && setMeasurementPage(prev => prev - 1)}
                                className={measurementPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                            </PaginationItem>
                            {Array.from({ length: Math.ceil(measurements.length / measurementsPerPage) }, (_, i) => i + 1).map(page => {
                              const totalPages = Math.ceil(measurements.length / measurementsPerPage);
                              if (totalPages <= 7 || page === 1 || page === totalPages || (page >= measurementPage - 1 && page <= measurementPage + 1)) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setMeasurementPage(page)}
                                      isActive={measurementPage === page}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              } else if (page === measurementPage - 2 || page === measurementPage + 2) {
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
                                onClick={() => measurementPage < Math.ceil(measurements.length / measurementsPerPage) && setMeasurementPage(prev => prev + 1)}
                                className={measurementPage === Math.ceil(measurements.length / measurementsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Orders */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#1A2A3A]">Orders</h3>
                  <button 
                    onClick={() => setShowOrderModal(true)}
                    className="flex items-center space-x-2 text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors"
                  >
                    <i className="ri-add-circle-line text-2xl"></i>
                    <span className="text-sm font-medium hidden sm:inline">Add Order</span>
                    <span className="text-sm font-medium sm:hidden">Add</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <i className="ri-shopping-bag-line text-2xl mb-2"></i>
                      <p className="text-sm">No orders yet</p>
                    </div>
                  ) : (
                    <>
                      {orders
                        .slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage)
                        .map((order) => (
                          <a
                            key={order.id}
                            href={`/orders/${order.id}`}
                            className="block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-xs font-semibold text-[#1A2A3A]">{order.name}</h4>
                                <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                                'bg-red-100 text-red-700 border-red-200'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                              <span className="font-semibold text-[#1A2A3A]">${order.price}</span>
                            </div>
                          </a>
                        ))
                      }
                      {Math.ceil(orders.length / ordersPerPage) > 1 && (
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => orderPage > 1 && setOrderPage(prev => prev - 1)}
                                className={orderPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                            </PaginationItem>
                            {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => i + 1).map(page => {
                              const totalPages = Math.ceil(orders.length / ordersPerPage);
                              if (totalPages <= 7 || page === 1 || page === totalPages || (page >= orderPage - 1 && page <= orderPage + 1)) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => setOrderPage(page)}
                                      isActive={orderPage === page}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              } else if (page === orderPage - 2 || page === orderPage + 2) {
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
                                onClick={() => orderPage < Math.ceil(orders.length / ordersPerPage) && setOrderPage(prev => prev + 1)}
                                className={orderPage === Math.ceil(orders.length / ordersPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Premium Feature */}
              <div className="bg-white rounded-xl shadow-sm p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full mx-auto mb-4">
                      <i className="ri-lock-line text-2xl text-gray-700"></i>
                    </div>
                    <h4 className="text-lg font-bold text-[#1A2A3A] mb-2">Premium Feature</h4>
                    <p className="text-sm text-[#2F2F2F] mb-4">Upgrade to Pro or Premium to upload cloth photos</p>
                    <a className="inline-block px-4 py-2 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors" href="/pricing">
                      View Pricing
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#1A2A3A]">Uploaded Cloth Photos</h3>
                  <button className="flex items-center space-x-2 text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors">
                    <i className="ri-add-circle-line text-2xl"></i>
                    <span className="text-sm font-medium">Upload Photos</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-[#F7F6F3] rounded-lg"></div>
                  <div className="aspect-square bg-[#F7F6F3] rounded-lg"></div>
                  <div className="aspect-square bg-[#F7F6F3] rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Measurement Modal */}
      {showMeasurementModal && (
        <Dialog open={true} onOpenChange={() => setShowMeasurementModal(false)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#1A2A3A]">Add Measurement</DialogTitle>
              <DialogDescription>For {client.name}</DialogDescription>
            </DialogHeader>
            <ClientMeasurementForm 
              client={client}
              onSave={() => setShowMeasurementModal(false)}
              onCancel={() => setShowMeasurementModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Measurement Modal */}
      {editingMeasurement && (
        <Dialog open={true} onOpenChange={() => setEditingMeasurement(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#1A2A3A]">Edit Measurement</DialogTitle>
              <DialogDescription>Update measurement details</DialogDescription>
            </DialogHeader>
            <EditMeasurementForm 
              measurement={editingMeasurement}
              onSave={async () => {
                setEditingMeasurement(null);
                if (id) await fetchClient(id);
              }}
              onCancel={() => setEditingMeasurement(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Client Modal */}
      {showEditModal && client && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowEditModal(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1A2A3A]">Edit Client</h3>
                  <p className="text-sm text-gray-500 mt-1">Update client information</p>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-400"></i>
                </button>
              </div>
              
              <EditClientForm 
                client={client}
                onSave={async () => {
                  setShowEditModal(false);
                  if (id) await fetchClient(id);
                }}
                onCancel={() => setShowEditModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && client && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
              <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <h2 className="text-xs font-semibold text-[#1A2A3A] text-center mb-2">Delete Client</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-medium text-[#1A2A3A]">{client.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await clientService.delete(client.id);
                    navigate('/clients');
                  } catch (err: any) {
                    alert(err.response?.data?.message || 'Failed to delete client');
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {deleting ? (
                  <i className="ri-loader-4-line animate-spin text-lg"></i>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showOrderModal && (
        <Dialog open={true} onOpenChange={() => setShowOrderModal(false)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#1A2A3A]">Add Order</DialogTitle>
              <DialogDescription>For {client.name}</DialogDescription>
            </DialogHeader>
            <ClientOrderForm 
              client={client}
              measurements={measurements}
              onSave={() => setShowOrderModal(false)}
              onCancel={() => setShowOrderModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const ClientMeasurementForm: React.FC<{
  client: any;
  onSave: () => void;
  onCancel: () => void;
}> = ({ client, onSave, onCancel }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [measurementName, setMeasurementName] = useState('');
  const [measurements, setMeasurements] = useState<{[key: string]: string}>({});

  const templates = [
    { name: "Men's Suit", fields: ['Chest', 'Waist', 'Hip', 'Shoulder Width', 'Sleeve Length'] },
    { name: "Women's Dress", fields: ['Bust', 'Waist', 'Hip', 'Shoulder Width', 'Dress Length'] },
    { name: 'Wedding Gown', fields: ['Bust', 'Waist', 'Hip', 'Train Length', 'Bodice Length'] },
    { name: 'Casual Shirt', fields: ['Chest', 'Waist', 'Shoulder Width', 'Sleeve Length'] }
  ];

  const selectedTemplateData = templates.find(t => t.name === selectedTemplate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving measurement for', client.name, { selectedTemplate, measurementName, measurements });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Template</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate} required>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.name} value={template.name}>{template.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="measurementName">Measurement Name</Label>
          <Input
            id="measurementName"
            value={measurementName}
            onChange={(e) => setMeasurementName(e.target.value)}
            placeholder="e.g., Wedding Dress #1"
            required
          />
        </div>
      </div>
      
      {selectedTemplateData && (
        <div className="space-y-2">
          <Label>Measurements</Label>
          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {selectedTemplateData.fields.map((field: string, index: number) => (
              <div key={index} className="space-y-1">
                <Label className="text-xs">{field}</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    value={measurements[field] || ''}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, [field]: e.target.value }))}
                    className="pr-8"
                    placeholder="0.0"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">in</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Save Measurement
        </Button>
      </div>
    </form>
  );
};

const ClientOrderForm: React.FC<{
  client: any;
  measurements: any[];
  onSave: () => void;
  onCancel: () => void;
}> = ({ client, measurements, onSave, onCancel }) => {
  console.log('ClientOrderForm measurements:', measurements);
  const [formData, setFormData] = useState({
    measurementId: '',
    item: '',
    priority: 'Medium',
    dueDate: new Date(),
    amount: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating order for', client.name, formData);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Select Measurement</Label>
        {!measurements || measurements.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            No measurements found for this client
          </div>
        ) : (
          <Select 
            value={formData.measurementId} 
            onValueChange={(value) => {
              const measurement = measurements.find(m => m.id === value);
              setFormData(prev => ({ ...prev, measurementId: value, item: measurement?.type || '' }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a measurement" />
            </SelectTrigger>
            <SelectContent>
              {measurements.map((measurement) => (
                <SelectItem key={measurement.id} value={measurement.id}>
                  {measurement.type} - {new Date(measurement.createdAt).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Due Date</Label>
          <DatePicker
            date={formData.dueDate}
            onDateChange={(date) => setFormData(prev => ({ ...prev, dueDate: date || new Date() }))}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="pl-7"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          placeholder="Special requirements, fabric details, etc..."
        />
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create Order
        </Button>
      </div>
    </form>
  );
};

const EditClientForm: React.FC<{
  client: Client;
  onSave: () => void;
  onCancel: () => void;
}> = ({ client, onSave, onCancel }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: client.name,
    phoneNumber: client.phoneNumber,
    email: client.email,
    notes: client.notes || ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(client.profileImageUrl || null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      let imageUrl = profileImage;
      
      if (previewImage && !profileImage) {
        setUploading(true);
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          imageUrl = await uploadService.uploadFile(file);
        }
        setUploading(false);
      }
      
      const clientData = { ...formData, profileImageUrl: imageUrl };
      await clientService.update(client.id, clientData);
      showToast('Client updated successfully!', 'success');
      onSave();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update client';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {uploading ? (
              <i className="ri-loader-4-line animate-spin text-xl text-gray-400"></i>
            ) : previewImage ? (
              <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
            ) : profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-700">
                {client.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 bg-[#1A2A3A] text-white rounded-full flex items-center justify-center hover:bg-[#2F2F2F] transition-colors"
          >
            <i className="ri-camera-line text-sm"></i>
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Full Name</label>
        <input 
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
          placeholder="Enter client's full name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Phone Number</label>
        <input 
          type="tel"
          required
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
          placeholder="+1234567890"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Email</label>
        <input 
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
          placeholder="client@email.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Notes</label>
        <textarea 
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] resize-none"
          placeholder="Preferences, allergies, etc."
        ></textarea>
      </div>
      
      <div className="flex items-center space-x-3 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-3 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting ? (
            <i className="ri-loader-4-line animate-spin text-lg"></i>
          ) : (
            'Update Client'
          )}
        </button>
      </div>
    </form>
  );
};

const EditMeasurementForm: React.FC<{
  measurement: any;
  onSave: () => void;
  onCancel: () => void;
}> = ({ measurement, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: measurement.type,
    data: { ...measurement.data }
  });
  const [submitting, setSubmitting] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    { name: "Men's Suit", fields: ['Chest', 'Waist', 'Hip', 'Shoulder Width', 'Sleeve Length'] },
    { name: "Women's Dress", fields: ['Bust', 'Waist', 'Hip', 'Shoulder Width', 'Dress Length'] },
    { name: 'Wedding Gown', fields: ['Bust', 'Waist', 'Hip', 'Train Length', 'Bodice Length'] },
    { name: 'Casual Shirt', fields: ['Chest', 'Waist', 'Shoulder Width', 'Sleeve Length'] }
  ];

  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName);
    const template = templates.find(t => t.name === templateName);
    if (template) {
      const newData: {[key: string]: string} = {};
      template.fields.forEach(field => {
        newData[field] = formData.data[field] || '';
      });
      setFormData({ type: templateName, data: newData });
    }
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      setFormData(prev => ({
        ...prev,
        data: { ...prev.data, [newFieldName]: '' }
      }));
      setNewFieldName('');
    }
  };

  const handleRemoveField = (key: string) => {
    const newData = { ...formData.data };
    delete newData[key];
    setFormData({ ...formData, data: newData });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await measurementService.update(measurement.id, formData);
      onSave();
    } catch (error) {
      console.error('Failed to update measurement:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Change Template (Optional)</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.name} value={template.name}>{template.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Measurements</Label>
        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {Object.entries(formData.data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs capitalize">{key}</Label>
                <button
                  type="button"
                  onClick={() => handleRemoveField(key)}
                  className="text-red-600 hover:text-red-700"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={value as string}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    data: { ...prev.data, [key]: e.target.value }
                  }))}
                  className="pr-8"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">in</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Add Custom Field</Label>
        <div className="flex gap-2">
          <Input
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Field name (e.g., Neck)"
          />
          <Button type="button" onClick={handleAddField} size="sm">
            <i className="ri-add-line"></i>
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? (
            <i className="ri-loader-4-line animate-spin text-lg"></i>
          ) : (
            'Update Measurement'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ClientDetails;