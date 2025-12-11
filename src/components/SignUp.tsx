import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useToast } from './ToastContainer';
import { authService } from '../services';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await authService.signup({
        name: formData.fullName,
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password,
        phoneNumber: '',
        businessAddress: ''
      });
      showToast('Registration successful! Please check your email to verify your account.', 'success');
      setTimeout(() => navigate('/verify-otp', { state: { email: formData.email, purpose: 'verification' } }), 1500);
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1626274890657-e28d5b65b04b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNld2luZ3xlbnwwfHwwfHx8MA%3D%3D" 
          alt="Sewing machine" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-scissors-cut-line text-2xl text-[#1A2A3A]"></i>
            </div>
            <span className="text-lg font-bold text-[#1A2A3A]" style={{ fontFamily: '"Russo One", sans-serif' }}>Smart Tailor</span>
          </Link>

          <div className="mb-6">
            <h1 className="text-4xl text-[#1A2A3A] mb-3" style={{ fontFamily: '"Russo One", sans-serif' }}>Create Account</h1>
            <p className="text-base text-[#2F2F2F]">Start managing your tailoring business today</p>
          </div>



          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#1A2A3A] mb-2">Full Name</label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-[#1A2A3A] mb-2">Business Name</label>
              <input
                id="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors"
                placeholder="Your Tailoring Studio"
              />
            </div>

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
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors pr-12"
                  placeholder="Create a strong password"
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1A2A3A] mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-[#1A2A3A] text-sm border-2 border-[#E5E5E5] rounded-lg focus:border-[#1A2A3A] focus:outline-none transition-colors pr-12"
                  placeholder="Confirm your password"
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

            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                required
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-2 border-[#E5E5E5] text-[#1A2A3A] focus:ring-0 focus:ring-offset-0 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-sm text-[#2F2F2F] cursor-pointer leading-relaxed">
                I agree to the <Link to="/terms" className="text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#1A2A3A] hover:text-[#2F2F2F] transition-colors underline">Privacy Policy</Link>
              </label>
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#2F2F2F] mt-6">
            Already have an account? <Link to="/signin" className="text-[#1A2A3A] font-medium hover:text-[#2F2F2F] transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}