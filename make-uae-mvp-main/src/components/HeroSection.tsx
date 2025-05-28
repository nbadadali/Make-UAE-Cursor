
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = ({ onStartPlanning }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-uae-gradient opacity-10"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-300 rounded-full opacity-20 animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* UAE Flag Inspired Design */}
          <div className="flex justify-center mb-8">
            <div className="flex rounded-lg overflow-hidden shadow-lg">
              <div className="w-4 bg-red-500 h-20"></div>
              <div className="flex flex-col">
                <div className="w-32 h-7 bg-green-600"></div>
                <div className="w-32 h-6 bg-white"></div>
                <div className="w-32 h-7 bg-gray-900"></div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Discover the
            <span className="block text-gradient">Magic of UAE</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            From the towering heights of Burj Khalifa to the golden dunes of the desert, 
            create your perfect UAE adventure with AI-powered planning and personalized recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={onStartPlanning}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🚀 Start Your Journey
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-4 text-lg rounded-full transition-all duration-300"
            >
              ✨ Explore Features
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2">AI Travel Assistant</h3>
              <p className="text-gray-600">Get personalized recommendations powered by advanced AI</p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold mb-2">Smart Itineraries</h3>
              <p className="text-gray-600">Custom routes optimized for your time and interests</p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-lg font-semibold mb-2">Live Booking</h3>
              <p className="text-gray-600">Find the best deals and book instantly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
