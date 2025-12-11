import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import OTPVerification from './OTPVerification';
import apiService from '../services/api.service';
import { useToast } from './ToastContainer';

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const sendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.post('/api/otp/send-password-reset', { email });
      setStep('otp');
      showToast('Reset code sent to your email', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to send reset code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      await apiService.post('/api/auth/reset-password/complete', { email, newPassword });
      showToast('Password reset successful! You can now login with your new password.', 'success');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error: any) {
      showToast(error.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <OTPVerification
        purpose="password-reset"
        email={email}
        onSuccess={() => setStep('password')}
        onCancel={() => setStep('email')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <span className="text-lg font-bold text-[#1A2A3A]" style={{ fontFamily: '"Russo One", sans-serif' }}>Smart Tailor</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl text-[#1A2A3A] mb-3" style={{ fontFamily: '"Russo One", sans-serif' }}>
              {step === 'email' ? 'Reset Password' : 'Set New Password'}
            </h1>
            <p className="text-base text-[#2F2F2F]">
              {step === 'email' 
                ? 'Enter your email address and we\'ll send you a reset code'
                : 'Enter your new password to complete the reset'
              }
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={sendResetOTP} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1A2A3A] mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-[#1A2A3A] text-white text-base font-bold rounded-lg hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ fontFamily: '"Russo One", sans-serif' }}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-xl mr-2"></i>
                    Sending...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={resetPassword} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-[#1A2A3A] mb-2">New Password</label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors pr-12"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#2F2F2F] hover:text-[#1A2A3A] transition-colors"
                  >
                    <i className={`ri-eye${showPassword ? '-off' : ''}-line text-lg`}></i>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1A2A3A] mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors pr-12"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#2F2F2F] hover:text-[#1A2A3A] transition-colors"
                  >
                    <i className={`ri-eye${showConfirmPassword ? '-off' : ''}-line text-lg`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-[#1A2A3A] text-white text-base font-bold rounded-lg hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ fontFamily: '"Russo One", sans-serif' }}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-xl mr-2"></i>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#2F2F2F] mt-8">
            Remember your password? <Link to="/signin" className="text-[#1A2A3A] font-medium hover:text-[#2F2F2F] transition-colors">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1613555612473-90cf723dfb60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNld2luZ3xlbnwwfHwwfHx8MA%3D%3D" 
          alt="Fabric and tools" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}