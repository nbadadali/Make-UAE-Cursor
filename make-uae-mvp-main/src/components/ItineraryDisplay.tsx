
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: number;
  name: string;
  city: string;
  day: number;
  duration: string;
  description: string;
  image: string;
  budget: string;
  category: string;
}

interface Itinerary {
  duration: string;
  cities: string[];
  activities: Activity[];
}

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onOffersClick: (activity: Activity) => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onOffersClick }) => {
  const groupActivitiesByDay = () => {
    const days: { [key: number]: Activity[] } = {};
    itinerary.activities.forEach(activity => {
      if (!days[activity.day]) {
        days[activity.day] = [];
      }
      days[activity.day].push(activity);
    });
    return days;
  };

  const dayGroups = groupActivitiesByDay();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-gradient mb-4">
            Your Perfect UAE Adventure
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            A personalized {itinerary.duration} itinerary across {itinerary.cities.join(' & ')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {itinerary.cities.map(city => (
              <Badge key={city} variant="secondary" className="px-4 py-2 text-lg bg-orange-100 text-orange-700 border border-orange-300">
                📍 {city}
              </Badge>
            ))}
          </div>
        </div>

        {/* Itinerary Days */}
        <div className="space-y-8">
          {Object.entries(dayGroups).map(([day, activities]) => (
            <div key={day} className="relative">
              {/* Day Header */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  Day {day}
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-800">Day {day}</h3>
                  <p className="text-gray-600">{activities.length} amazing experiences planned</p>
                </div>
              </div>

              {/* Activities */}
              <div className="ml-8 space-y-6">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="relative">
                    {/* Timeline connector */}
                    {index < activities.length - 1 && (
                      <div className="absolute left-6 top-24 w-0.5 h-16 bg-gradient-to-b from-orange-300 to-red-300"></div>
                    )}
                    
                    <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-6">
                          {/* Activity Icon/Image */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                              {activity.image}
                            </div>
                          </div>

                          {/* Activity Details */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                              <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-1">{activity.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {activity.duration}
                                  </span>
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {activity.city}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="border-orange-300 text-orange-700">
                                  {activity.category}
                                </Badge>
                                <Badge variant="outline" className="border-green-300 text-green-700">
                                  {activity.budget}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-gray-700 mb-4">{activity.description}</p>

                            <div className="flex flex-wrap gap-3">
                              <Button 
                                onClick={() => onOffersClick(activity)}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-6"
                              >
                                🔗 Booking & Offers
                              </Button>
                              
                              <Button 
                                variant="outline"
                                className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-full px-6"
                              >
                                📍 View on Map
                              </Button>
                              
                              <Button 
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6"
                              >
                                ℹ️ More Info
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-full">
              📧 Email Itinerary
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full">
              📱 Share on WhatsApp
            </Button>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 rounded-full">
              📄 Download PDF
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="border-2 border-orange-400 text-orange-700 hover:bg-orange-50 px-8 py-3 rounded-full font-semibold"
          >
            ✏️ Customize Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
