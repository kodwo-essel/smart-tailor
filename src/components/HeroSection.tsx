import AnimatedText from './AnimatedText';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-32 px-6 lg:px-12 bg-gradient-to-b from-[#0F1419] to-[#1A2A3A] min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto text-center">

        <AnimatedText 
          text="The Smart Way to Manage Your Tailoring Business"
          className="text-4xl lg:text-5xl text-white leading-tight mb-4 mt-16"
          style={{ fontFamily: '"Russo One", sans-serif' }}
          delay={500}
          speed={80}
        />
        <AnimatedText 
          text="Managing clients, measurements, and orders shouldn't be complicated. Our platform makes it simple to manage everything in one place; client profiles, custom measurements, order tracking, and more."
          className="text-lg lg:text-xl text-white/80 leading-relaxed mb-12 max-w-4xl mx-auto"
          delay={3000}
          speed={30}
        />
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-8 py-4 bg-[#D9C7A8] text-[#1A2A3A] text-base font-bold rounded-lg hover:bg-white transition-colors whitespace-nowrap" style={{ fontFamily: '"Russo One", sans-serif' }}>
            Get Started →
          </button>
          <button className="px-8 py-4 bg-transparent text-white text-sm font-medium rounded-lg border-2 border-white/30 hover:border-white hover:bg-white/10 transition-colors whitespace-nowrap">
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}
