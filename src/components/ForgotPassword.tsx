import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OTPVerification from './OTPVerification';
import apiService from '../services/api.service';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.post('/api/otp/send-password-reset', { email });
      setStep('otp');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.post('/api/auth/reset-password', { email, newPassword });
      setSuccess('Password reset successful! You can now login with your new password.');
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#1A2A3A]">
            {step === 'email' ? 'Reset Password' : 'Set New Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'email' 
              ? 'Enter your email to receive a reset code'
              : 'Enter your new password'
            }
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={sendResetOTP} className="space-y-6">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            {error && <div className="text-red-600 text-sm">{error}</div>}
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Button>
            
            <div className="text-center">
              <a href="/signin" className="text-sm text-[#1A2A3A] hover:underline">
                Back to Sign In
              </a>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={resetPassword} className="space-y-6">
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;