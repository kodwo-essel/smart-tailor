import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { appointmentService, Appointment, clientService, Client, authService } from '../services';

const Calendar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 8;
  const user = authService.getUser();
  const appointmentsEnabled = user?.subscriptionPlan?.appointmentsEnabled ?? true;

  useEffect(() => {
    fetchAppointments();
    fetchClients();
  }, [currentPage]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (editId && appointments.length > 0) {
      const appointment = appointments.find(a => a.id === editId);
      if (appointment) {
        handleEditAppointment(appointment);
        window.history.replaceState({}, '', '/appointments');
      }
    }
  }, [appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAll(currentPage, itemsPerPage);
      setAppointments(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'CONFIRMED': 'bg-green-100 text-green-700 border-green-200',
      'COMPLETED': 'bg-blue-100 text-blue-700 border-blue-200',
      'CANCELLED': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };



  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === 'today') {
      const apptDay = new Date(appointmentDate);
      apptDay.setHours(0, 0, 0, 0);
      return apptDay.getTime() === today.getTime();
    }
    
    if (filter === 'week') {
      const weekFromNow = new Date(today);
      weekFromNow.setDate(today.getDate() + 7);
      return appointmentDate >= today && appointmentDate <= weekFromNow;
    }
    
    return true;
  });

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setShowModal(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const openDeleteModal = (appointment: Appointment) => {
    setDeletingAppointment(appointment);
    setDeleteModal(true);
  };

  const handleDeleteAppointment = async () => {
    if (!deletingAppointment) return;
    
    setDeleting(true);
    try {
      await appointmentService.delete(deletingAppointment.id);
      await fetchAppointments();
      setDeleteModal(false);
      setDeletingAppointment(null);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('Failed to delete appointment');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveAppointment = async (appointmentData: any) => {
    try {
      if (editingAppointment) {
        await appointmentService.update(editingAppointment.id, appointmentData);
      } else {
        await appointmentService.create(appointmentData);
      }
      fetchAppointments();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save appointment:', error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="appointments" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen} 
          title="Appointments" 
          subtitle="View and manage your scheduled appointments"
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          {!appointmentsEnabled && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-yellow-100 rounded-full flex-shrink-0">
                  <i className="ri-lock-line text-2xl text-yellow-600"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1A2A3A] mb-2">Upgrade to Access Appointments</h3>
                  <p className="text-sm text-gray-700 mb-4">Appointments are not available on the FREE plan. Upgrade to STANDARD or PREMIUM to manage appointments.</p>
                  <a href="/settings" className="inline-block px-6 py-3 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors">
                    Upgrade Plan
                  </a>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === 'all' ? 'bg-[#1A2A3A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('today')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === 'today' ? 'bg-[#1A2A3A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button 
                  onClick={() => setFilter('week')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === 'week' ? 'bg-[#1A2A3A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Week
                </button>
              </div>
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
                />
              </div>
            </div>

          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto md:overflow-visible">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A]">Client</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A] hidden md:table-cell">Type</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A] hidden lg:table-cell">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A] hidden lg:table-cell">Time</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A]">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-[#1A2A3A]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Loader size="md" text="Loading appointments..." />
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <i className="ri-calendar-line text-3xl text-gray-400"></i>
                        <p className="text-sm text-gray-500 mt-2">No appointments found</p>
                      </td>
                    </tr>
                  ) : filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors relative">
                      <td className="py-4 px-6 text-sm font-medium text-[#1A2A3A]">{appointment.client.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 hidden md:table-cell">{appointment.type}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 hidden lg:table-cell">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 hidden lg:table-cell">{appointment.appointmentTime}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="md:flex items-center space-x-2 hidden">
                          <a
                            href={`/appointments/${appointment.id}`}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <i className="ri-eye-line text-lg text-gray-600"></i>
                          </a>
                          <button 
                            onClick={() => handleEditAppointment(appointment)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <i className="ri-edit-line text-lg text-gray-600"></i>
                          </button>
                          <button 
                            onClick={() => openDeleteModal(appointment)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <i className="ri-delete-bin-line text-lg text-red-600"></i>
                          </button>
                        </div>
                        <div className="md:hidden">
                          <a href={`/appointments/${appointment.id}`} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
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
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm border rounded-lg ${
                      currentPage === page 
                        ? 'bg-[#1A2A3A] text-white border-[#1A2A3A]' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && deletingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
              <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1A2A3A] text-center mb-2">Delete Appointment</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete the appointment with <span className="font-medium text-[#1A2A3A]">{deletingAppointment.client.name}</span>? This action cannot be undone.
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
                onClick={handleDeleteAppointment}
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

      {/* Floating Add Button */}
      <button 
        onClick={handleAddAppointment}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#1A2A3A] text-white rounded-full shadow-lg hover:bg-[#2F2F2F] transition-all hover:scale-110 flex items-center justify-center z-40"
      >
        <i className="ri-add-line text-2xl"></i>
      </button>

      {/* Modern Add/Edit Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>
            
            {/* Modal panel */}
            <div className="relative transform rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#1A2A3A]">
                    {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingAppointment ? 'Update appointment details' : 'Schedule a new appointment with your client'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-400"></i>
                </button>
              </div>
              
              <AppointmentForm 
                appointment={editingAppointment}
                clients={clients}
                onSave={handleSaveAppointment}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Appointment Form Component
const AppointmentForm: React.FC<{
  appointment?: any;
  clients: Client[];
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ appointment, clients, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    clientId: appointment?.client?.id || '',
    type: appointment?.type || 'FITTING',
    appointmentDate: appointment?.appointmentDate || '',
    appointmentTime: appointment?.appointmentTime || '',
    status: appointment?.status || 'PENDING',
    notes: appointment?.notes || ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const appointmentTypes = [
    { value: 'CONSULTATION', label: 'Consultation', icon: 'ri-chat-3-line', color: 'text-blue-600' },
    { value: 'MEASUREMENT', label: 'Measurement', icon: 'ri-ruler-line', color: 'text-purple-600' },
    { value: 'FITTING', label: 'Fitting', icon: 'ri-shirt-line', color: 'text-orange-600' },
    { value: 'FINAL_FITTING', label: 'Final Fitting', icon: 'ri-checkbox-circle-line', color: 'text-green-600' },
    { value: 'PICKUP', label: 'Pickup', icon: 'ri-shopping-bag-line', color: 'text-indigo-600' }
  ];

  const statuses = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      
      {/* Client Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Client</label>
        <div className="relative">
          <i className="ri-user-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all appearance-none"
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Appointment Type */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Appointment Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
          required
        >
          {appointmentTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      
      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Date</label>
          <div className="relative">
            <i className="ri-calendar-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Time</label>
          <div className="relative">
            <i className="ri-time-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Status */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">Status</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => setFormData({ ...formData, status: status.value })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                formData.status === status.value
                  ? status.color
                  : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent resize-none transition-all"
          placeholder="Add any additional notes or special requirements..."
        />
      </div>
      
      {/* Action Buttons */}
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
            <i className="ri-loader-4-line animate-spin text-lg"></i>
          ) : (
            <>
              <i className={`${appointment ? 'ri-save-line' : 'ri-add-line'} text-lg`}></i>
              <span>{appointment ? 'Update' : 'Create'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Calendar;