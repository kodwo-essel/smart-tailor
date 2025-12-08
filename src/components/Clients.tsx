import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { clientService, Client } from '../services';

const Clients: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      if (editingClient) {
        await clientService.update(editingClient.id, newClient);
      } else {
        await clientService.create(newClient);
      }
      await fetchClients();
      setShowModal(false);
      setEditingClient(null);
      setNewClient({ name: '', phoneNumber: '', email: '', notes: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save client');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      phoneNumber: client.phoneNumber,
      email: client.email,
      notes: client.notes || ''
    });
    setError('');
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingClient(null);
    setNewClient({ name: '', phoneNumber: '', email: '', notes: '' });
    setError('');
    setShowModal(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewClient(prev => ({ ...prev, [field]: value }));
  };

  const openDeleteModal = (client: Client) => {
    setDeletingClient(client);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingClient) return;
    
    setDeleting(true);
    try {
      await clientService.delete(deletingClient.id);
      await fetchClients();
      setDeleteModal(false);
      setDeletingClient(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete client');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="clients" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} title="Clients" />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-gray-50">
          {/* Search and Add Client */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-search-line text-xl text-gray-400"></i>
              </div>
              <input 
                placeholder="Search clients by name, phone, or email..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:border-[#1A2A3A] focus:ring-1 focus:ring-[#1A2A3A]"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto md:overflow-visible">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#2F2F2F]">Client Name</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#2F2F2F] hidden md:table-cell">Phone</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#2F2F2F] hidden lg:table-cell">Email</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#2F2F2F] hidden xl:table-cell">Notes</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#2F2F2F] hidden lg:table-cell">Joined</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#2F2F2F]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Loader size="md" text="Loading clients..." />
                      </td>
                    </tr>
                  ) : paginatedClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <i className="ri-user-line text-3xl text-gray-400"></i>
                        <p className="text-sm text-gray-500 mt-2">No clients found</p>
                      </td>
                    </tr>
                  ) : paginatedClients.map((client, index) => (
                    <tr key={client.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors relative ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-gray-600">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <a className="text-sm font-medium text-[#1A2A3A] hover:underline cursor-pointer" href={`/clients/${client.id}`}>
                            {client.name}
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-[#2F2F2F] hidden md:table-cell">{client.phoneNumber}</td>
                      <td className="py-4 px-6 text-sm text-[#2F2F2F] hidden lg:table-cell">{client.email}</td>
                      <td className="py-4 px-6 text-sm text-[#2F2F2F] hidden xl:table-cell">{client.notes || '-'}</td>
                      <td className="py-4 px-6 text-xs text-gray-500 hidden lg:table-cell">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="md:flex items-center space-x-2 hidden">
                          <a 
                            href={`/clients/${client.id}`}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <i className="ri-eye-line text-lg text-[#2F2F2F]"></i>
                          </a>
                          <button 
                            onClick={() => openEditModal(client)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <i className="ri-edit-line text-lg text-[#2F2F2F]"></i>
                          </button>
                          <button 
                            onClick={() => openDeleteModal(client)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <i className="ri-delete-bin-line text-lg text-red-600"></i>
                          </button>
                        </div>
                        <div className="md:hidden">
                          <a href={`/clients/${client.id}`} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
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
        onClick={openAddModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#1A2A3A] text-white rounded-full shadow-lg hover:bg-[#2F2F2F] transition-all hover:scale-110 flex items-center justify-center z-40"
      >
        <i className="ri-add-line text-2xl"></i>
      </button>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A2A3A]">{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddClient} className="space-y-4">
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
                  value={newClient.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                  placeholder="Enter client's full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Phone Number</label>
                <input 
                  type="tel"
                  required
                  value={newClient.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Email</label>
                <input 
                  type="email"
                  required
                  value={newClient.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                  placeholder="client@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Notes</label>
                <textarea 
                  rows={3}
                  value={newClient.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] resize-none"
                  placeholder="Preferences, allergies, etc."
                ></textarea>
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
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
                    editingClient ? 'Update Client' : 'Add Client'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && deletingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
              <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1A2A3A] text-center mb-2">Delete Client</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-medium text-[#1A2A3A]">{deletingClient.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
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
    </div>
  );
};

export default Clients;