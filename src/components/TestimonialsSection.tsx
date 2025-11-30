import { Star } from 'lucide-react';

const testimonials = [
  {
    rating: 5,
    text: "Smart Tailor has completely transformed how I manage my bridal clients. The measurement templates are incredibly detailed, and I never lose track of orders anymore. My business has grown 40% since I started using it.",
    name: 'Maria Rodriguez',
    title: 'Bridal Couture Designer',
    location: 'New York, NY'
  },
  {
    rating: 5,
    text: "As someone who handles 50+ clients, organization was my biggest challenge. Smart Tailor keeps everything in one place: measurements, fabric photos, order timelines. It's like having a personal assistant.",
    name: 'James Chen',
    title: 'Bespoke Suit Tailor',
    location: 'San Francisco, CA'
  },
  {
    rating: 5,
    text: "The custom measurement templates feature is a game-changer for my traditional garment business. I can create unique templates for each style, and my clients love how professional and organized I am now.",
    name: 'Aisha Patel',
    title: 'Traditional Wear Specialist',
    location: 'London, UK'
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6 lg:px-12 bg-[#F7F6F3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl text-[#1A2A3A] mb-6" style={{ fontFamily: '"Russo One", sans-serif' }}>
            Trusted by Professional Tailors
          </h2>
          <p className="text-xl text-[#2F2F2F] max-w-3xl mx-auto">
            See what tailors and dressmakers are saying about Smart Tailor.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#D9C7A8] fill-current" />
                ))}
              </div>
              <p className="text-base text-[#2F2F2F] leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="border-t border-[#F7F6F3] pt-6">
                <h4 className="text-base font-bold text-[#1A2A3A]" style={{ fontFamily: '"Russo One", sans-serif' }}>
                  {testimonial.name}
                </h4>
                <p className="text-sm text-[#2F2F2F]">{testimonial.title}</p>
                <p className="text-sm text-[#2F2F2F]/70">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
