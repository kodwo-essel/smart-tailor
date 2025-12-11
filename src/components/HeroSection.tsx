import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';

const images = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1626274890657-e28d5b65b04b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop&q=80'
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Image Slideshow */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image} 
              alt={`Tailoring ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        ))}
      </div>
      
      {/* Spotlight Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/80"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedText 
            text="Master Your Craft, Master Your Business"
            className="text-5xl lg:text-7xl text-white font-bold leading-tight mb-6"
            style={{ fontFamily: '"Russo One", sans-serif' }}
            delay={500}
            speed={80}
          />
          
          <AnimatedText 
            text="From measuring tape to digital mastery. Streamline your tailoring business with tools designed for craftsmen who demand perfection."
            className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-12 max-w-4xl mx-auto"
            delay={3000}
            speed={30}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signup"
              className="px-8 py-4 bg-white text-[#1A2A3A] text-lg font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-2xl"
              style={{ fontFamily: '"Russo One", sans-serif' }}
            >
              Start Crafting →
            </Link>
            <Link 
              to="/signin"
              className="px-8 py-4 bg-transparent text-white text-lg font-medium rounded-lg border-2 border-white/50 hover:border-white hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      
      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentImage ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}