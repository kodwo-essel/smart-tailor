import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OTPVerification from './OTPVerification';
import apiService from '../services/api.service';
import { Eye, EyeOff, Lock, Shield, CheckCircle, XCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.post('/api/auth/reset-password/initiate', { email });
      setStep('otp');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 2) return { label: 'Weak', color: 'text-red-500' };
    if (strength < 4) return { label: 'Medium', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-green-500' };
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.post('/api/auth/reset-password/complete', { email, newPassword });
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

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthInfo = getStrengthLabel(passwordStrength);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {step === 'email' ? <Lock className="w-8 h-8 text-primary" /> : <Shield className="w-8 h-8 text-primary" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'email' ? 'Reset Password' : 'Set New Password'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'email' 
                ? 'Enter your email to receive a reset code'
                : 'Create a strong password for your account'
              }
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={sendResetOTP} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <XCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </Button>
              
              <div className="text-center">
                <a href="/signin" className="text-sm text-primary hover:text-primary/80 font-medium">
                  ← Back to Sign In
                </a>
              </div>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={resetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 text-base pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={`font-medium ${strengthInfo.color}`}>{strengthInfo.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full ${
                            level <= passwordStrength
                              ? passwordStrength < 2
                                ? 'bg-red-500'
                                : passwordStrength < 4
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                        {newPassword.length >= 8 ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-green-600' : ''}`}>
                        {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                        Upper & lowercase letters
                      </div>
                      <div className={`flex items-center gap-2 ${/[0-9]/.test(newPassword) ? 'text-green-600' : ''}`}>
                        {/[0-9]/.test(newPassword) ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                        At least one number
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-12 text-base pr-12 ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-300 focus-visible:ring-red-500'
                        : confirmPassword && newPassword === confirmPassword
                        ? 'border-green-300 focus-visible:ring-green-500'
                        : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {confirmPassword && newPassword !== confirmPassword && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <XCircle className="w-4 h-4" />
                    Passwords do not match
                  </div>
                )}
                
                {confirmPassword && newPassword === confirmPassword && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Passwords match
                  </div>
                )}
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <XCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={loading || newPassword !== confirmPassword || passwordStrength < 2} 
                className="w-full h-12 text-base font-semibold"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;