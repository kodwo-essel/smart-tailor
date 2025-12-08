import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import { templateService, Template, clientService, Client, measurementService } from '../services';

const Templates: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showUseModal, setShowUseModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchTemplates();
    fetchClients();
  }, [currentPage]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateService.getAll(currentPage, itemsPerPage);
      setTemplates(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
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

  const handleSaveTemplate = async (templateData: any) => {
    try {
      if (editingTemplate) {
        await templateService.update(editingTemplate.id, templateData);
      } else {
        await templateService.create(templateData);
      }
      await fetchTemplates();
      setShowModal(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Failed to save template:', error);
      throw error;
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const openDeleteModal = (template: Template) => {
    setDeletingTemplate(template);
    setDeleteModal(true);
  };

  const handleDeleteTemplate = async () => {
    if (!deletingTemplate) return;
    
    try {
      await templateService.delete(deletingTemplate.id);
      await fetchTemplates();
      setDeleteModal(false);
      setDeletingTemplate(null);
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template');
    }
  };

  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowViewModal(true);
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowViewModal(false);
    setShowUseModal(true);
  };

  const handleSaveMeasurement = async (clientId: string, measurementData: any) => {
    try {
      await measurementService.createForClient(clientId, measurementData);
      setShowUseModal(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to save measurement:', error);
      throw error;
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="templates" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen} 
          title="Measurement Templates" 
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
                <input 
                  placeholder="Search templates..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#1A2A3A] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-l-lg transition-colors`}
              >
                <i className="ri-grid-line text-lg"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#1A2A3A] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-r-lg transition-colors`}
              >
                <i className="ri-list-check text-lg"></i>
              </button>
            </div>
          </div>

          {/* Templates Grid/List */}
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {loading ? (
              <div className="col-span-full py-12 text-center">
                <Loader size="md" text="Loading templates..." />
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <i className="ri-file-list-line text-3xl text-gray-400"></i>
                <p className="text-sm text-gray-500 mt-2">No templates found</p>
              </div>
            ) : viewMode === 'grid' ? (
              filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg">
                      <i className="ri-file-list-line text-3xl text-[#1A2A3A]"></i>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleEditTemplate(template)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <i className="ri-edit-line text-lg text-gray-600"></i>
                      </button>
                      <button 
                        onClick={() => openDeleteModal(template)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="ri-delete-bin-line text-lg text-red-600"></i>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A2A3A] mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <i className="ri-ruler-line mr-2"></i>{template.fields.length} measurements
                    </span>
                    <span className="text-xs text-gray-500">{new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleViewTemplate(template)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-[#1A2A3A] text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 px-4 py-2 bg-[#1A2A3A] text-white text-xs font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Use
                    </button>
                  </div>
                </div>
              ))
            ) : (
              filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
                      <i className="ri-file-list-line text-xl text-[#1A2A3A]"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#1A2A3A] truncate">{template.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{template.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <i className="ri-ruler-line"></i> {template.fields.length} measurements • {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Desktop buttons */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleUseTemplate(template)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-[#1A2A3A] rounded-lg hover:bg-[#2F2F2F] transition-colors whitespace-nowrap"
                      >
                        Use
                      </button>
                      <button 
                        onClick={() => handleViewTemplate(template)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <i className="ri-eye-line text-lg text-gray-600"></i>
                      </button>
                      <button 
                        onClick={() => handleEditTemplate(template)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <i className="ri-edit-line text-lg text-gray-600"></i>
                      </button>
                      <button 
                        onClick={() => openDeleteModal(template)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="ri-delete-bin-line text-lg text-red-600"></i>
                      </button>
                    </div>
                    {/* Mobile menu */}
                    <div className="relative flex-shrink-0 md:hidden">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === template.id ? null : template.id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <i className="ri-more-2-fill text-xl text-gray-600"></i>
                      </button>
                      {openMenuId === template.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                          <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                            <button
                              onClick={() => { handleViewTemplate(template); setOpenMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <i className="ri-eye-line"></i> View
                            </button>
                            <button
                              onClick={() => { handleUseTemplate(template); setOpenMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <i className="ri-scissors-cut-line"></i> Use
                            </button>
                            <button
                              onClick={() => { handleEditTemplate(template); setOpenMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <i className="ri-edit-line"></i> Edit
                            </button>
                            <button
                              onClick={() => { openDeleteModal(template); setOpenMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <i className="ri-delete-bin-line"></i> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center space-x-3 mt-10 mb-6">
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
        </main>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => {
          setEditingTemplate(null);
          setShowModal(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#1A2A3A] text-white rounded-full shadow-lg hover:bg-[#2F2F2F] transition-all hover:scale-110 flex items-center justify-center z-40"
      >
        <i className="ri-add-line text-2xl"></i>
      </button>

      {/* Create/Edit Template Modal */}
      {showModal && (
        <TemplateFormModal
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowModal(false);
            setEditingTemplate(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && deletingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
              <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1A2A3A] text-center mb-2">Delete Template</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-medium text-[#1A2A3A]">{deletingTemplate.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteTemplate}
                className="flex-1 px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Template Modal */}
      {showViewModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowViewModal(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1A2A3A]">{selectedTemplate.name}</h3>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <i className="ri-close-line text-lg text-gray-400"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  {selectedTemplate.description}
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedTemplate.fields?.map((field: string, index: number) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-gray-900">
                        {field}
                      </div>
                    )) || (
                      <div className="col-span-2 text-center py-4 text-gray-500">
                        No measurements defined
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="w-full px-4 py-3 bg-[#1A2A3A] text-white font-medium rounded-xl hover:bg-[#2F2F2F] transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Use Template Modal */}
      {showUseModal && selectedTemplate && (
        <UseTemplateModal
          template={selectedTemplate}
          clients={clients}
          onSave={handleSaveMeasurement}
          onCancel={() => {
            setShowUseModal(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
};

// Template Form Modal Component
const TemplateFormModal: React.FC<{
  template?: Template | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}> = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    fields: template?.fields || []
  });
  const [fieldInput, setFieldInput] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddField = () => {
    if (fieldInput.trim()) {
      setFormData({
        ...formData,
        fields: [...formData.fields, fieldInput.trim()]
      });
      setFieldInput('');
    }
  };

  const handleRemoveField = (index: number) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.fields.length === 0) {
      setError('Please add at least one measurement field');
      return;
    }
    
    console.log('Submitting template data:', formData);
    setError('');
    setSubmitting(true);
    
    try {
      await onSave(formData);
      console.log('Template saved successfully');
    } catch (err: any) {
      console.error('Failed to save template:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to save template');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onCancel}
        ></div>
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#1A2A3A]">
                {template ? 'Edit Template' : 'Create Template'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {template ? 'Update template details' : 'Define measurement fields for your template'}
              </p>
            </div>
            <button 
              onClick={onCancel}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <i className="ri-close-line text-xl text-gray-400"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Template Name</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                placeholder="e.g., Men's Shirt"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Description</label>
              <textarea 
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] resize-none"
                placeholder="Brief description of this template"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Measurement Fields</label>
              <div className="flex space-x-2 mb-3">
                <input 
                  type="text"
                  value={fieldInput}
                  onChange={(e) => setFieldInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddField())}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                  placeholder="e.g., chest, waist, sleeve"
                />
                <button 
                  type="button"
                  onClick={handleAddField}
                  className="px-4 py-2 bg-[#1A2A3A] text-white text-sm font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2">
                {formData.fields.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-500">
                    No fields added yet
                  </div>
                ) : (
                  formData.fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">{field}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <i className="ri-close-line text-lg"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
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
                  template ? 'Update Template' : 'Create Template'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Use Template Modal Component
const UseTemplateModal: React.FC<{
  template: Template;
  clients: Client[];
  onSave: (clientId: string, data: any) => Promise<void>;
  onCancel: () => void;
}> = ({ template, clients, onSave, onCancel }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [measurementName, setMeasurementName] = useState('');
  const [measurements, setMeasurements] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) {
      setError('Please select a client');
      return;
    }
    
    setError('');
    setSubmitting(true);
    
    try {
      const measurementData = {
        type: measurementName,
        data: measurements
      };
      await onSave(selectedClientId, measurementData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save measurement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onCancel}
        ></div>
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#1A2A3A]">Use Template: {template.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Select a client and enter measurements</p>
            </div>
            <button 
              onClick={onCancel}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <i className="ri-close-line text-xl text-gray-400"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Select Client</label>
                <div className="relative">
                  <i className="ri-user-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] appearance-none"
                    required
                  >
                    <option value="">Choose a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1A2A3A] mb-2">Measurement Name</label>
                <input
                  type="text"
                  value={measurementName}
                  onChange={(e) => setMeasurementName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                  placeholder={template.name}
                  required
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Measurements</h4>
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {template.fields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-700 mb-1 capitalize">{field}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={measurements[field] || ''}
                        onChange={(e) => setMeasurements(prev => ({ ...prev, [field]: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] text-sm"
                        placeholder="0.0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">in</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-[#1A2A3A] text-white font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <i className="ri-loader-4-line animate-spin text-lg"></i>
                ) : (
                  'Save Measurement'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Templates;
