import { User, Ruler, ShoppingBag, Image, Calendar, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: User,
    title: 'Client Management',
    description: 'Keep detailed records of all your clients with contact information, preferences, and order history in one organized place.'
  },
  {
    icon: Ruler,
    title: 'Measurement Templates',
    description: 'Pre-built templates for shirts, suits, dresses, and more. Create custom templates for unique designs.'
  },
  {
    icon: ShoppingBag,
    title: 'Order Tracking',
    description: 'Track orders from initial consultation to final delivery. Never miss a deadline or lose track of progress.'
  },
  {
    icon: Image,
    title: 'Fabric Gallery',
    description: 'Upload and organize photos of fabrics, designs, and finished garments for easy reference and client approval.'
  },
  {
    icon: Calendar,
    title: 'Appointment Scheduling',
    description: 'Manage fittings and consultations with an integrated calendar system that syncs with your workflow.'
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Track revenue, popular items, and client trends to make informed decisions about your business.'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl text-[#1A2A3A] mb-6" style={{ fontFamily: '"Russo One", sans-serif' }}>
            Everything You Need
          </h2>
          <p className="text-xl text-[#2F2F2F] max-w-3xl mx-auto">
            Professional tools designed specifically for tailors and dressmakers to manage their business efficiently.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-[#F7F6F3] rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 flex items-center justify-center bg-[#1A2A3A] rounded-lg mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2A3A] mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-base text-[#2F2F2F] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
