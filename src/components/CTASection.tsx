export default function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#1A2A3A]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl text-white mb-6" style={{ fontFamily: '"Russo One", sans-serif' }}>
          Ready to Modernize Your Tailoring Business?
        </h2>
        <p className="text-xl text-white/90 mb-10">
          Join hundreds of professional tailors who have transformed their workflow with Smart Tailor.
        </p>
        <button
          className="inline-block px-10 py-5 bg-[#D9C7A8] text-[#1A2A3A] text-lg font-bold rounded-lg hover:bg-white transition-colors whitespace-nowrap"
          style={{ fontFamily: '"Russo One", sans-serif' }}
        >
          Start Free Trial
        </button>
      </div>
    </section>
  );
}
