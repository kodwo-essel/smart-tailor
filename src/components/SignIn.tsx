import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { authService } from '../services';
import { useToast } from './ToastContainer';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authService.login({
        email: formData.email,
        password: formData.password
      });
      showToast('Login successful! Redirecting...', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      if ((err.response?.status === 403 || err.status === 403) && err.message.includes('not verified')) {
        showToast('Account not verified. Verification code sent to your email.', 'success');
        navigate('/verify-otp', { state: { email: formData.email, purpose: 'verification' } });
      } else if (err.response?.status === 422 || err.status === 422) {
        showToast('Account not activated. Verification code sent to your email.', 'success');
        navigate('/verify-otp', { state: { email: formData.email, purpose: 'verification' } });
      } else {
        showToast(err.message || 'Login failed. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-4xl text-[#1A2A3A] mb-3" style={{ fontFamily: '"Russo One", sans-serif' }}>Welcome Back</h1>
            <p className="text-base text-[#2F2F2F]">Sign in to continue managing your tailoring business</p>
          </div>



          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1A2A3A] mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1A2A3A] mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors pr-12"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-2 border-[#E5E5E5] text-[#1A2A3A] focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-[#2F2F2F]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors">Forgot password?</Link>
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#2F2F2F] mt-8">
            Don't have an account? <Link to="/signup" className="text-[#1A2A3A] font-medium hover:text-[#2F2F2F] transition-colors">Sign up for free</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1606501126768-b78d4569d3f9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Tailor workspace" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}