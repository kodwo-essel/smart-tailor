export default function MobileAppSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#1A2A3A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl text-white leading-tight" style={{ fontFamily: '"Russo One", sans-serif' }}>
              Take Your Business On The Go
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Manage your tailoring business anywhere with our mobile app. Take measurements, track orders, and stay connected with clients; all from your phone.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center bg-[#D9C7A8] rounded-full flex-shrink-0">
                  <i className="ri-check-line text-[#1A2A3A] text-sm"></i>
                </div>
                <span className="text-base">Offline measurement recording</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center bg-[#D9C7A8] rounded-full flex-shrink-0">
                  <i className="ri-check-line text-[#1A2A3A] text-sm"></i>
                </div>
                <span className="text-base">Real-time order updates</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center bg-[#D9C7A8] rounded-full flex-shrink-0">
                  <i className="ri-check-line text-[#1A2A3A] text-sm"></i>
                </div>
                <span className="text-base">Client communication tools</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="inline-block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-14" />
              </a>
              <a href="#" className="inline-block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-14" />
              </a>
            </div>
          </div>
          <div className="relative text-center">
            <div className="bg-white/10 rounded-2xl p-12 backdrop-blur-sm">
              <h3 className="text-4xl text-white mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>Coming Soon</h3>
              <p className="text-white/80 text-lg">Mobile app launching soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}