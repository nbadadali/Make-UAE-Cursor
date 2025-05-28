
import React, { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import TravelWizard from '../components/TravelWizard';
import ItineraryDisplay from '../components/ItineraryDisplay';
import ChatbotModal from '../components/ChatbotModal';
import OffersModal from '../components/OffersModal';
import PhotoGeneratorModal from '../components/PhotoGeneratorModal';
import HeyGenModal from '../components/HeyGenModal';
import PineconeSync from '../components/PineconeSync';
import Footer from '../components/Footer';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({});
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isPhotoGenOpen, setIsPhotoGenOpen] = useState(false);
  const [isHeyGenOpen, setIsHeyGenOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleStepComplete = (stepData) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handleItineraryGenerated = (itinerary) => {
    setGeneratedItinerary(itinerary);
  };

  const handleOffersClick = (place) => {
    setSelectedPlace(place);
    setIsOffersOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />
      
      {/* Pinecone Sync Component */}
      <PineconeSync />
      
      {currentStep === 0 && (
        <HeroSection onStartPlanning={() => setCurrentStep(1)} />
      )}
      
      {currentStep > 0 && currentStep <= 4 && (
        <TravelWizard
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
          onItineraryGenerated={handleItineraryGenerated}
          wizardData={wizardData}
        />
      )}
      
      {generatedItinerary && (
        <ItineraryDisplay
          itinerary={generatedItinerary}
          onOffersClick={handleOffersClick}
        />
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="AI Travel Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        
        <button
          onClick={() => setIsHeyGenOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Video Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        
        <button
          onClick={() => setIsPhotoGenOpen(true)}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="UAE Photo Generator"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Modals */}
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
      <OffersModal 
        isOpen={isOffersOpen} 
        onClose={() => setIsOffersOpen(false)} 
        place={selectedPlace}
      />
      <PhotoGeneratorModal 
        isOpen={isPhotoGenOpen} 
        onClose={() => setIsPhotoGenOpen(false)} 
      />
      <HeyGenModal 
        isOpen={isHeyGenOpen} 
        onClose={() => setIsHeyGenOpen(false)} 
      />

      <Footer />
    </div>
  );
};

export default Index;
