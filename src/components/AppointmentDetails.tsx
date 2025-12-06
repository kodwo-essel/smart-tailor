import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentService, Appointment } from '../services';

const AppointmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAppointment(id);
    }
  }, [id]);

  const fetchAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);
      const data = await appointmentService.getById(appointmentId);
      setAppointment(data);
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="appointments" />
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" text="Loading appointment..." />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="appointments" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-calendar-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Appointment not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="appointments" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} title="Appointment Details" />

        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          <button 
            onClick={() => navigate('/appointments')}
            className="flex items-center space-x-2 text-[#2F2F2F] hover:text-[#1A2A3A] mb-6 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
            <span className="text-sm font-medium">Back to Appointments</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1A2A3A] mb-2">{appointment.type}</h2>
                  <p className="text-sm text-gray-500">Appointment ID: {appointment.id.substring(0, 8)}</p>
                </div>
                <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Client Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#1A2A3A] border-b border-gray-200 pb-3">Client Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-[#D9C7A8] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-[#1A2A3A]">
                          {appointment.client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Client Name</p>
                        <p className="text-sm font-semibold text-[#1A2A3A]">{appointment.client.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-phone-line text-lg text-[#2F2F2F]"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Phone</p>
                        <p className="text-sm font-medium text-[#1A2A3A]">{appointment.client.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-mail-line text-lg text-[#2F2F2F]"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Email</p>
                        <p className="text-sm font-medium text-[#1A2A3A]">{appointment.client.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#1A2A3A] border-b border-gray-200 pb-3">Appointment Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-calendar-line text-lg text-[#2F2F2F]"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Date</p>
                        <p className="text-sm font-medium text-[#1A2A3A]">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-time-line text-lg text-[#2F2F2F]"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Time</p>
                        <p className="text-sm font-medium text-[#1A2A3A]">{appointment.appointmentTime}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-file-list-line text-lg text-[#2F2F2F]"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Type</p>
                        <p className="text-sm font-medium text-[#1A2A3A]">{appointment.type}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-calendar-check-line text-lg text-[#2F2F2F]"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Created</p>
                        <p className="text-sm font-medium text-[#1A2A3A]">
                          {new Date(appointment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {appointment.notes && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-[#1A2A3A] mb-4">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentDetails;
