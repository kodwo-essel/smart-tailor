import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from './ToastContainer';
import { authService } from '../services';
import apiService from '../services/api.service';

interface OTPVerificationProps {
  purpose?: string;
  email?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  modal?: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ purpose: propPurpose, email: propEmail, onSuccess: propOnSuccess, onCancel, modal = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const state = location.state as { email?: string; purpose?: string } || {};
  
  const purpose = propPurpose || state.purpose || 'verification';
  const email = propEmail || state.email;
  const onSuccess = propOnSuccess || (() => {
    if (purpose === 'verification') {
      navigate('/signin');
    }
  });
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!modal && authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [modal, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showToast('Please enter all 6 digits', 'error');
      return;
    }

    setLoading(true);

    try {
      const isAuthenticated = authService.isAuthenticated();
      const payload = isAuthenticated ? { otp: otpString } : { otp: otpString, email };
      
      await apiService.post('/api/otp/verify', payload);
      showToast('Verification successful!', 'success');
      onSuccess();
    } catch (error: any) {
      showToast(error.message || 'Invalid or expired OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    
    try {
      // Unauthenticated: verification, password-reset (user not logged in)
      // Authenticated: upgrade (user is logged in)
      const isAuthenticated = authService.isAuthenticated();
      
      if (isAuthenticated) {
        await apiService.post('/api/otp/resend', {});
      } else {
        await apiService.post('/api/otp/resend', { email });
      }
      
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      showToast('New verification code sent to your email', 'success');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to resend OTP';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (modal) {
    return (
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-[#1A2A3A]">Enter Verification Code</h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a 6-digit code to {email || 'your email'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 text-center text-sm font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
              />
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <button
              onClick={resendOTP}
              disabled={loading}
              className="w-full text-sm text-[#1A2A3A] hover:underline"
            >
              Didn't receive the code? Resend
            </button>

            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#1A2A3A]">Enter Verification Code</h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a 6-digit code to {email || 'your email'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A3A] focus:border-transparent"
              />
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <button
              onClick={resendOTP}
              disabled={loading}
              className="w-full text-sm text-[#1A2A3A] hover:underline"
            >
              Didn't receive the code? Resend
            </button>

            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;