import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import StatsSection from './StatsSection';
import MobileAppSection from './MobileAppSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import Footer from './Footer';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className={`ri-scissors-cut-line text-2xl ${isScrolled ? 'text-[#1A2A3A]' : 'text-white'}`}></i>
              </div>
              <span className={`text-lg font-bold ${isScrolled ? 'text-[#1A2A3A]' : 'text-white'}`} style={{ fontFamily: '"Russo One", sans-serif' }}>Smart Tailor</span>
            </Link>

            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`}>Features</a>
              <a href="#pricing" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`}>Pricing</a>
              <a href="#testimonials" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`}>Testimonials</a>
              <a href="#contact" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`}>Contact</a>
              <Link to="/signin" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`}>Sign In</Link>
            </div>

            <button
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className={`text-2xl ${isScrolled ? 'text-[#1A2A3A]' : 'text-white'}`} /> : <Menu className={`text-2xl ${isScrolled ? 'text-[#1A2A3A]' : 'text-white'}`} />}
            </button>
          </div>

        </div>
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${isScrolled ? 'bg-white border-gray-200' : 'bg-[#0F1419] border-white/20'}`}>
            <div className="px-6 lg:px-12">
              <div className="flex flex-col space-y-4">
                <a href="#features" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`} onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#pricing" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`} onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                <a href="#testimonials" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`} onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                <a href="#contact" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors`} onClick={() => setMobileMenuOpen(false)}>Contact</a>
                <Link to="/signin" className={`text-base ${isScrolled ? 'text-[#2F2F2F] hover:text-[#1A2A3A]' : 'text-white/80 hover:text-white'} transition-colors text-left`} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <StatsSection />
      <MobileAppSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}