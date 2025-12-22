import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Loader from './Loader';
import OTPVerification from './OTPVerification';
import { authService, userService, uploadService, User, SubscriptionPlan } from '../services';
import { useToast } from './ToastContainer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiService from '../services/api.service';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [updatingPlan, setUpdatingPlan] = useState(false);

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [months, setMonths] = useState('1');
  const [isRenewal, setIsRenewal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    businessName: '',
    businessAddress: ''
  });

  useEffect(() => {
    fetchUser();
  }, []);



  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [loading, user]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const [userData, plansData] = await Promise.all([
        userService.getMe(),
        userService.getSubscriptionPlans()
      ]);
      setUser(userData);
      setPlans(plansData);
      setFormData({
        name: userData.name || '',
        phoneNumber: userData.phoneNumber || '',
        businessName: userData.businessName || '',
        businessAddress: userData.businessAddress || ''
      });
      setProfilePhoto(userData.profileImageUrl || null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      let imageUrl = user.profileImageUrl;
      
      if (profilePhoto && profilePhoto !== user.profileImageUrl) {
        setUploading(true);
        const fileInput = document.getElementById('profile-photo') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          imageUrl = await uploadService.uploadFile(file);
        }
        setUploading(false);
      }
      
      const updateData = { ...formData, profileImageUrl: imageUrl };
      await userService.update(user.id, updateData);
      await fetchUser();
      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const tabs = [
    { key: 'Profile', icon: 'ri-user-line', label: 'Profile' },
    { key: 'Billing', icon: 'ri-bank-card-line', label: 'Billing' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('File size must be less than 2MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openPlanModal = (plan: SubscriptionPlan, renewal = false) => {
    setSelectedPlan(plan);
    setIsRenewal(renewal);
    setShowConfirmModal(true);
  };

  const openRenewalModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsRenewal(true);
    setShowConfirmModal(true);
  };

  const confirmUpgrade = () => {
    setShowConfirmModal(false);
    initiatePlanUpgrade();
    setShowOTPModal(true);
  };

  const initiatePlanUpgrade = async () => {
    setUpdatingPlan(true);
    try {
      await apiService.post('/api/subscriptions/upgrade/initiate', {});
      showToast('Upgrade OTP sent to your email', 'success');
    } catch (error: any) {
      console.error('Failed to initiate upgrade:', error);
      showToast('Failed to initiate upgrade', 'error');
    } finally {
      setUpdatingPlan(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    if (isRenewal) {
      setShowRenewalModal(true);
    } else {
      setShowPlanModal(true);
    }
  };

  const completePlanUpgrade = async () => {
    setShowPlanModal(false);
    setShowRenewalModal(false);
    setSelectedPlan(null);
    setIsRenewal(false);
    showToast(isRenewal ? 'Plan renewal completed successfully!' : 'Subscription upgrade completed successfully!', 'success');
    await fetchUser();
    
    // Update user data in localStorage for Sidebar
    try {
      const updatedUser = await userService.getMe();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Dispatch custom event to notify components
      window.dispatchEvent(new Event('userDataUpdated'));
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="settings" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen} 
          title="Settings" 
          subtitle="Manage your account and preferences"
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button 
                  key={tab.key}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key 
                      ? 'bg-[#1A2A3A] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                  data-tour={tab.key === 'Profile' ? 'profile-tab' : tab.key === 'Billing' ? 'billing-tab' : ''}
                >
                  <i className={`${tab.icon} text-lg`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="space-y-6">
              {loading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <Loader size="md" text="Loading profile..." />
                </div>
              ) : activeTab === 'Profile' && (
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <h2 className="text-lg font-bold text-[#1A2A3A] mb-6">
                    Profile Information
                  </h2>
                  
                  {/* Profile Photo */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      {uploading ? (
                        <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">
                          <i className="ri-loader-4-line animate-spin text-2xl text-gray-400"></i>
                        </div>
                      ) : profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full text-base font-bold text-gray-700">
                          {formData.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="profile-photo"
                        onChange={handlePhotoChange}
                      />
                      <label 
                        htmlFor="profile-photo"
                        className="absolute bottom-0 right-0 w-8 h-8 bg-[#1A2A3A] flex items-center justify-center rounded-full hover:bg-[#2F2F2F] transition-colors cursor-pointer border-2 border-white"
                      >
                        <i className="ri-camera-line text-xs text-white"></i>
                      </label>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-[#1A2A3A] mb-1">Profile Photo</h3>
                      <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-[#1A2A3A] mb-2">Full Name</label>
                      <input 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1A2A3A] mb-2">Email</label>
                      <input 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                        type="email"
                        value={user?.email || ''}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1A2A3A] mb-2">Phone</label>
                      <input 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1A2A3A] mb-2">Business Name</label>
                      <input 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-[#1A2A3A] mb-2">Business Address</label>
                      <input 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A3A]"
                        type="text"
                        value={formData.businessAddress}
                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-6">
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-[#1A2A3A] text-white text-xs font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <i className="ri-loader-4-line animate-spin text-lg"></i>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Billing' && user && (
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <h2 className="text-lg font-bold text-[#1A2A3A] mb-2">Subscription Plan</h2>
                  <p className="text-xs text-gray-600 mb-6">Manage your subscription and billing</p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                      const isCurrentPlan = user.subscriptionPlan?.id === plan.id;
                      const planOrder = { 'FREE': 0, 'STANDARD': 1, 'PREMIUM': 2 };
                      const currentPlanOrder = planOrder[user.subscriptionPlan?.name as keyof typeof planOrder] ?? -1;
                      const thisPlanOrder = planOrder[plan.name as keyof typeof planOrder] ?? 0;
                      const isLowerPlan = thisPlanOrder < currentPlanOrder;
                      return (
                        <div 
                          key={plan.id}
                          className={`rounded-xl p-6 transition-all relative overflow-hidden border-2 ${
                            isCurrentPlan 
                              ? 'border-[#1A2A3A] bg-gradient-to-br from-blue-50 to-slate-50' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          {isCurrentPlan && (
                            <div className="absolute top-4 right-4">
                              <div className="flex items-center space-x-1 px-2 py-1 bg-[#1A2A3A] rounded-full">
                                <i className="ri-checkbox-circle-fill text-white text-sm"></i>
                                <span className="text-xs font-semibold text-white">Active</span>
                              </div>
                            </div>
                          )}
                          <h3 className={`text-base font-bold mb-2 ${isCurrentPlan ? 'text-[#1A2A3A]' : 'text-[#1A2A3A]'}`}>{plan.name}</h3>
                          <p className={`text-sm mb-4 ${isCurrentPlan ? 'text-gray-700' : 'text-gray-600'}`}>{plan.description}</p>
                          
                          {isCurrentPlan && user.subscriptionPlan?.subscriptionEndDate && (
                            <div className="mb-4">
                              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-[#1A2A3A] text-xs font-medium rounded-md">
                                Expires {new Date(user.subscriptionPlan.subscriptionEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <div className={`flex items-center text-sm mb-2 ${isCurrentPlan ? 'text-gray-700' : 'text-gray-700'}`}>
                              <i className={`${plan.appointmentsEnabled ? 'ri-checkbox-circle-line text-green-600' : 'ri-close-circle-line text-red-600'} mr-2`}></i>
                              Appointments {plan.appointmentsEnabled ? 'Enabled' : 'Disabled'}
                            </div>
                            {plan.name === 'FREE' && (
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Up to 10 clients</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>5 orders per month</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Basic templates</div>
                              </div>
                            )}
                            {plan.name === 'STANDARD' && (
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Up to 100 clients</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Unlimited orders</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>All templates</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>50 cloth photos</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Basic analytics</div>
                              </div>
                            )}
                            {plan.name === 'PREMIUM' && (
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Unlimited clients</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Unlimited orders</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>All templates</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Unlimited photos</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Advanced analytics</div>
                                <div className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Multi-user access</div>
                              </div>
                            )}
                          </div>
                          {isCurrentPlan ? (
                            <div className="space-y-2">
                              <button 
                                onClick={() => openRenewalModal(plan)}
                                className="w-full px-4 py-2 bg-[#1A2A3A] text-white text-xs font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors"
                              >
                                Renew Plan
                              </button>
                            </div>
                          ) : isLowerPlan ? (
                            <button 
                              disabled
                              className="w-full px-4 py-2 bg-gray-200 text-gray-500 text-xs font-medium rounded-lg cursor-not-allowed"
                            >
                              Lower Plan
                            </button>
                          ) : (
                            <button 
                              onClick={() => openPlanModal(plan)}
                              className="w-full px-4 py-2 bg-[#1A2A3A] text-white text-xs font-medium rounded-lg hover:bg-[#2F2F2F] transition-colors"
                            >
                              Upgrade to {plan.name}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab !== 'Profile' && activeTab !== 'Billing' && (
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="text-center py-8">
                    <i className={`${tabs.find(t => t.key === activeTab)?.icon} text-6xl text-gray-300 mb-4`}></i>
                    <h3 className="text-lg font-bold text-[#1A2A3A] mb-2">
                      {activeTab} Settings
                    </h3>
                    <p className="text-gray-600">This section is under development.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6">
              <i className="ri-question-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <h2 className="text-lg font-bold text-[#1A2A3A] text-center mb-3">
              {isRenewal ? 'Confirm Plan Renewal' : 'Confirm Plan Upgrade'}
            </h2>
            <p className="text-xs text-gray-600 text-center mb-6">
              {isRenewal 
                ? `Are you sure you want to renew your ${selectedPlan.name} plan? An OTP will be sent to your email.`
                : `Are you sure you want to upgrade to the ${selectedPlan.name} plan? An OTP will be sent to your email.`
              }
            </p>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedPlan(null);
                  setIsRenewal(false);
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmUpgrade}
                className="flex-1 px-4 py-2 bg-[#1A2A3A] text-white text-xs font-semibold rounded-xl hover:bg-[#2F2F2F] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Renewal Modal */}
      {showRenewalModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6">
              <i className="ri-refresh-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <h2 className="text-lg font-bold text-[#1A2A3A] text-center mb-3">Renew Subscription Plan</h2>
            <p className="text-xs text-gray-600 text-center mb-4">
              Add more months to your <span className="font-semibold text-[#1A2A3A]">{selectedPlan.name}</span> plan.
            </p>
            <div className="mb-6">
              <label className="block text-xs font-medium text-[#1A2A3A] mb-2 text-left">Additional Duration</label>
              <Select value={months} onValueChange={setMonths}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  setShowRenewalModal(false);
                  setSelectedPlan(null);
                  setIsRenewal(false);
                }}
                disabled={updatingPlan}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setUpdatingPlan(true);
                  try {
                    const response = await apiService.post('/api/users/me/upgrade-plan', { 
                      planId: selectedPlan.id, 
                      months: parseInt(months) 
                    });
                    if (response.authorizationUrl) {
                      window.open(response.authorizationUrl, '_blank');
                      showToast('Payment window opened. Complete payment to renew your plan.', 'success');
                    }
                    completePlanUpgrade();
                  } catch (error: any) {
                    console.error('Failed to complete renewal:', error);
                    showToast('Failed to complete renewal', 'error');
                  } finally {
                    setUpdatingPlan(false);
                  }
                }}
                disabled={updatingPlan}
                className="flex-1 px-4 py-2 bg-[#1A2A3A] text-white text-xs font-semibold rounded-xl hover:bg-[#2F2F2F] transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center"
              >
                {updatingPlan ? (
                  <i className="ri-loader-4-line animate-spin text-lg"></i>
                ) : (
                  'Complete Renewal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Change Confirmation Modal */}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6">
              <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <h2 className="text-lg font-bold text-[#1A2A3A] text-center mb-3">Upgrade Subscription Plan</h2>
            <p className="text-xs text-gray-600 text-center mb-4">
              You are upgrading to the <span className="font-semibold text-[#1A2A3A]">{selectedPlan.name}</span> plan.
            </p>
            <div className="mb-6">
              <label className="block text-xs font-medium text-[#1A2A3A] mb-2 text-left">Subscription Duration</label>
              <Select value={months} onValueChange={setMonths}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  setShowPlanModal(false);
                  setSelectedPlan(null);
                }}
                disabled={updatingPlan}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setUpdatingPlan(true);
                  try {
                    const response = await apiService.post('/api/users/me/upgrade-plan', { 
                      planId: selectedPlan.id, 
                      months: parseInt(months) 
                    });
                    if (response.authorizationUrl) {
                      window.open(response.authorizationUrl, '_blank');
                      showToast('Payment window opened. Complete payment to activate your plan.', 'success');
                    }
                    completePlanUpgrade();
                  } catch (error: any) {
                    console.error('Failed to complete upgrade:', error);
                    showToast('Failed to complete upgrade', 'error');
                  } finally {
                    setUpdatingPlan(false);
                  }
                }}
                disabled={updatingPlan}
                className="flex-1 px-4 py-2 bg-[#1A2A3A] text-white text-xs font-semibold rounded-xl hover:bg-[#2F2F2F] transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center"
              >
                {updatingPlan ? (
                  <i className="ri-loader-4-line animate-spin text-lg"></i>
                ) : (
                  'Complete Upgrade'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <OTPVerification
              purpose="verification"
              email={user?.email}
              modal={true}
              onSuccess={handleOTPSuccess}
              onCancel={() => {
                setShowOTPModal(false);
                setSelectedPlan(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;