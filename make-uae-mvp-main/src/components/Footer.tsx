
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-uae-gradient p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold">Make UAE</h3>
            </div>
            <p className="text-gray-300">
              Your intelligent companion for discovering the magic of the United Arab Emirates.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">f</div>
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">📷</div>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">🐦</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Dubai</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Abu Dhabi</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Sharjah</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Ras Al Khaimah</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Fujairah</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-orange-400 transition-colors">AI Travel Assistant</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Smart Itineraries</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Live Booking</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Photo Generator</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Video Guide</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">About UAE</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Make UAE. Made with ❤️ for travelers exploring the Emirates.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
