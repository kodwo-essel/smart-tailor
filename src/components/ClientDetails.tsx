import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService, Client, measurementService } from '../services';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);

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
            className="flex items-center space-x-2 text-[#2F2F2F] hover:text-[#1A2A3A] mb-6 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
            <span className="text-sm font-medium">Back to Clients</span>
          </button>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Client Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 flex items-center justify-center bg-[#D9C7A8] rounded-full mb-4">
                    <span className="text-3xl font-bold text-[#1A2A3A]">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1A2A3A] mb-2">{client.name}</h2>
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
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="w-full px-6 py-3 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors"
                  >
                    Edit Client Info
                  </button>
                </div>
              </div>
            </div>

            {/* Measurements and Orders */}
            <div className="lg:col-span-2 space-y-8">
              {/* Measurements */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1A2A3A]">Measurements</h3>
                  <button 
                    onClick={() => setShowMeasurementModal(true)}
                    className="flex items-center space-x-2 text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors"
                  >
                    <i className="ri-add-circle-line text-2xl"></i>
                    <span className="text-sm font-medium">Add Measurement</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {measurements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <i className="ri-ruler-line text-3xl mb-2"></i>
                      <p className="text-sm">No measurements yet</p>
                    </div>
                  ) : (
                    measurements.map((measurement) => (
                      <div key={measurement.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-base font-semibold text-[#1A2A3A]">{measurement.type}</h4>
                            <p className="text-xs text-gray-600">{new Date(measurement.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(measurement.data).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-gray-600 mb-1 capitalize">{key}</p>
                              <p className="text-sm font-semibold text-[#1A2A3A]">{value as string}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Orders */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1A2A3A]">Orders</h3>
                  <button 
                    onClick={() => setShowOrderModal(true)}
                    className="flex items-center space-x-2 text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors"
                  >
                    <i className="ri-add-circle-line text-2xl"></i>
                    <span className="text-sm font-medium">Add Order</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <i className="ri-shopping-bag-line text-3xl mb-2"></i>
                    <p className="text-sm">No orders yet</p>
                  </div>
                </div>
              </div>

              {/* Premium Feature */}
              <div className="bg-white rounded-xl shadow-sm p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-[#D9C7A8] rounded-full mx-auto mb-4">
                      <i className="ri-lock-line text-3xl text-[#1A2A3A]"></i>
                    </div>
                    <h4 className="text-lg font-bold text-[#1A2A3A] mb-2">Premium Feature</h4>
                    <p className="text-sm text-[#2F2F2F] mb-4">Upgrade to Pro or Premium to upload cloth photos</p>
                    <a className="inline-block px-6 py-3 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors" href="/pricing">
                      View Pricing
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1A2A3A]">Uploaded Cloth Photos</h3>
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowMeasurementModal(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#1A2A3A]">Add Measurement</h3>
                  <p className="text-sm text-gray-500 mt-1">For {client.name}</p>
                </div>
                <button 
                  onClick={() => setShowMeasurementModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-400"></i>
                </button>
              </div>
              
              <ClientMeasurementForm 
                client={client}
                onSave={() => setShowMeasurementModal(false)}
                onCancel={() => setShowMeasurementModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && client && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowEditModal(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#1A2A3A]">Edit Client</h3>
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

      {/* Add Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowOrderModal(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#1A2A3A]">Add Order</h3>
                  <p className="text-sm text-gray-500 mt-1">For {client.name}</p>
                </div>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-400"></i>
                </button>
              </div>
              
              <ClientOrderForm 
                client={client}
                onSave={() => setShowOrderModal(false)}
                onCancel={() => setShowOrderModal(false)}
              />
            </div>
          </div>
        </div>
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Template</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
            required
          >
            <option value="">Select template</option>
            {templates.map((template) => (
              <option key={template.name} value={template.name}>{template.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Measurement Name</label>
          <input
            type="text"
            value={measurementName}
            onChange={(e) => setMeasurementName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
            placeholder="e.g., Wedding Dress #1"
            required
          />
        </div>
      </div>
      
      {selectedTemplateData && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Measurements</h4>
          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {selectedTemplateData.fields.map((field: string, index: number) => (
              <div key={index}>
                <label className="block text-xs text-gray-700 mb-1">{field}</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={measurements[field] || ''}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent text-sm"
                    placeholder="0.0"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">in</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-[#1A2A3A] text-white font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors"
        >
          Save Measurement
        </button>
      </div>
    </form>
  );
};

const ClientOrderForm: React.FC<{
  client: any;
  onSave: () => void;
  onCancel: () => void;
}> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    measurementId: '',
    item: '',
    priority: 'Medium',
    dueDate: '',
    amount: '',
    notes: ''
  });
  const [clientMeasurements, setClientMeasurements] = useState<any[]>([]);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const data = await measurementService.getByClientId(client.id);
      setClientMeasurements(data);
    } catch (error) {
      console.error('Failed to fetch measurements:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating order for', client.name, formData);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Select Measurement</label>
        <div className="space-y-2">
          {clientMeasurements.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">
              No measurements found for this client
            </div>
          ) : (
            clientMeasurements.map((measurement) => (
              <button
                key={measurement.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, measurementId: measurement.id, item: measurement.type }))}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  formData.measurementId === measurement.id
                    ? 'border-[#1A2A3A] bg-[#1A2A3A]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{measurement.type}</div>
                    <div className="text-xs text-gray-500">{new Date(measurement.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-xs text-gray-400">ID: {measurement.id.substring(0, 8)}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent resize-none"
          placeholder="Special requirements, fabric details, etc..."
        />
      </div>
      
      <div className="flex space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-[#1A2A3A] text-white font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors"
        >
          Create Order
        </button>
      </div>
    </form>
  );
};

const EditClientForm: React.FC<{
  client: Client;
  onSave: () => void;
  onCancel: () => void;
}> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: client.name,
    phoneNumber: client.phoneNumber,
    email: client.email,
    notes: client.notes || ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      await clientService.update(client.id, formData);
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update client');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      
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

export default ClientDetails;