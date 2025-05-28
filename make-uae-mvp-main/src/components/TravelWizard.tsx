
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const TravelWizard = ({ currentStep, onStepComplete, onItineraryGenerated, wizardData }) => {
  const [formData, setFormData] = useState({});

  const steps = [
    { title: "Trip Basics", description: "Tell us about your travel plans" },
    { title: "Interests", description: "What experiences do you love?" },
    { title: "Budget & Style", description: "How do you like to travel?" },
    { title: "Final Touches", description: "Perfect your preferences" }
  ];

  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / steps.length) * 100;

  const handleNext = (stepData) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);
    
    if (currentStep === steps.length) {
      // Generate itinerary
      generateItinerary(newFormData);
    } else {
      onStepComplete(stepData);
    }
  };

  const generateItinerary = (data) => {
    // Mock itinerary generation
    const mockItinerary = {
      duration: data.duration || "3 days",
      cities: data.cities || ["Dubai", "Abu Dhabi"],
      activities: [
        {
          id: 1,
          name: "Burj Khalifa & Dubai Mall",
          city: "Dubai",
          day: 1,
          duration: "4 hours",
          description: "Visit the world's tallest building and explore the largest mall in Dubai",
          image: "🏗️",
          budget: "$$",
          category: "Architecture"
        },
        {
          id: 2,
          name: "Desert Safari Adventure",
          city: "Dubai",
          day: 1,
          duration: "6 hours",
          description: "Experience dune bashing, camel riding, and traditional Bedouin dinner",
          image: "🐪",
          budget: "$$$",
          category: "Adventure"
        },
        {
          id: 3,
          name: "Sheikh Zayed Grand Mosque",
          city: "Abu Dhabi",
          day: 2,
          duration: "3 hours",
          description: "Marvel at one of the world's most beautiful mosques",
          image: "🕌",
          budget: "$",
          category: "Culture"
        }
      ]
    };
    
    onItineraryGenerated(mockItinerary);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={handleNext} initialData={wizardData} />;
      case 2:
        return <Step2 onNext={handleNext} initialData={wizardData} />;
      case 3:
        return <Step3 onNext={handleNext} initialData={wizardData} />;
      case 4:
        return <Step4 onNext={handleNext} initialData={wizardData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-display font-bold text-gradient mb-4">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mb-6">{currentStepData.description}</p>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="text-sm text-gray-500">Step {currentStep} of {steps.length}</span>
            <Progress value={progress} className="w-64" />
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Step Components
const Step1 = ({ onNext, initialData }) => {
  const [duration, setDuration] = useState(initialData.duration || "");
  const [cities, setCities] = useState(initialData.cities || []);
  const [travelers, setTravelers] = useState(initialData.travelers || "");

  const cityOptions = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"];

  const handleCityToggle = (city) => {
    setCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold mb-3">How long is your trip?</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["1-2 days", "3-4 days", "5-7 days", "1+ weeks"].map(option => (
            <button
              key={option}
              onClick={() => setDuration(option)}
              className={`p-4 rounded-xl border-2 transition-all ${
                duration === option
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-3">Which emirates would you like to visit?</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cityOptions.map(city => (
            <button
              key={city}
              onClick={() => handleCityToggle(city)}
              className={`p-4 rounded-xl border-2 transition-all ${
                cities.includes(city)
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-3">How many travelers?</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Solo", "Couple", "Family", "Group (5+)"].map(option => (
            <button
              key={option}
              onClick={() => setTravelers(option)}
              className={`p-4 rounded-xl border-2 transition-all ${
                travelers === option
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={() => onNext({ duration, cities, travelers })}
        disabled={!duration || cities.length === 0 || !travelers}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg rounded-xl"
      >
        Continue to Interests →
      </Button>
    </div>
  );
};

const Step2 = ({ onNext, initialData }) => {
  const [interests, setInterests] = useState(initialData.interests || []);

  const interestOptions = [
    { id: "culture", label: "Culture & Heritage", icon: "🕌" },
    { id: "adventure", label: "Adventure & Desert", icon: "🐪" },
    { id: "luxury", label: "Luxury & Shopping", icon: "💎" },
    { id: "architecture", label: "Modern Architecture", icon: "🏗️" },
    { id: "food", label: "Food & Dining", icon: "🍽️" },
    { id: "nature", label: "Nature & Beaches", icon: "🏖️" },
    { id: "family", label: "Family Activities", icon: "👨‍👩‍👧‍👦" },
    { id: "nightlife", label: "Nightlife & Entertainment", icon: "🌃" }
  ];

  const handleInterestToggle = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold mb-3">What interests you most? (Select all that apply)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interestOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleInterestToggle(option.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                interests.includes(option.id)
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={() => onNext({ interests })}
        disabled={interests.length === 0}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg rounded-xl"
      >
        Continue to Budget →
      </Button>
    </div>
  );
};

const Step3 = ({ onNext, initialData }) => {
  const [budget, setBudget] = useState(initialData.budget || "");
  const [style, setStyle] = useState(initialData.style || "");

  const budgetOptions = [
    { id: "budget", label: "Budget-Friendly", desc: "Under $100/day", icon: "💰" },
    { id: "mid", label: "Mid-Range", desc: "$100-300/day", icon: "💳" },
    { id: "luxury", label: "Luxury", desc: "$300+/day", icon: "💎" }
  ];

  const styleOptions = [
    { id: "relaxed", label: "Relaxed Pace", desc: "Take it slow, enjoy experiences", icon: "🧘" },
    { id: "balanced", label: "Balanced Mix", desc: "Mix of activities and downtime", icon: "⚖️" },
    { id: "packed", label: "Action-Packed", desc: "See and do as much as possible", icon: "⚡" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold mb-3">What's your budget range?</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {budgetOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setBudget(option.id)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                budget === option.id
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-3">What's your travel style?</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {styleOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setStyle(option.id)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                style === option.id
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={() => onNext({ budget, style })}
        disabled={!budget || !style}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg rounded-xl"
      >
        Continue to Final Step →
      </Button>
    </div>
  );
};

const Step4 = ({ onNext, initialData }) => {
  const [preferences, setPreferences] = useState(initialData.preferences || {});

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold mb-3">Any special preferences?</label>
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Accommodation Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Hotel", "Resort", "Apartment", "Villa", "Hostel", "Any"].map(option => (
                <button
                  key={option}
                  onClick={() => handlePreferenceChange('accommodation', option)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    preferences.accommodation === option
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Transportation</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Rental Car", "Taxi/Uber", "Public Transport", "Private Driver", "Walking/Metro", "Mixed"].map(option => (
                <button
                  key={option}
                  onClick={() => handlePreferenceChange('transport', option)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    preferences.transport === option
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => onNext({ preferences })}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg rounded-xl"
      >
        🎉 Generate My UAE Itinerary!
      </Button>
    </div>
  );
};

export default TravelWizard;
