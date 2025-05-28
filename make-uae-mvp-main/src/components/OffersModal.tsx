import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const OffersModal = ({ isOpen, onClose, place }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('perplexity_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen && place) {
      fetchOffers();
    }
  }, [isOpen, place]);

  const saveApiKey = () => {
    localStorage.setItem('perplexity_api_key', apiKey);
    setShowApiKeyInput(false);
    if (place) {
      fetchOffers();
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-offers', {
        body: {
          place: {
            name: place.name,
            city: place.city || 'UAE'
          }
        }
      });

      if (error) throw error;
      
      setOffers(data.offers || []);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to fetch offers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const parsePerplexityResponse = (content) => {
    // Simple parsing logic - in production, you might want more sophisticated parsing
    const offers = [];
    const lines = content.split('\n');
    
    let currentOffer = null;
    lines.forEach((line, index) => {
      if (line.includes('GetYourGuide') || line.includes('Viator') || line.includes('Klook') || line.includes('booking')) {
        if (currentOffer) {
          offers.push(currentOffer);
        }
        currentOffer = {
          id: offers.length + 1,
          title: `Booking Option ${offers.length + 1}`,
          provider: line.includes('GetYourGuide') ? 'GetYourGuide' : 
                   line.includes('Viator') ? 'Viator' : 
                   line.includes('Klook') ? 'Klook' : 'Direct Booking',
          price: "Check Website",
          description: line.trim(),
          link: "#",
          features: ["Real-time pricing", "Instant booking", "Customer support"],
          rating: 4.5,
          reviews: Math.floor(Math.random() * 3000) + 500
        };
      }
    });
    
    if (currentOffer) {
      offers.push(currentOffer);
    }
    
    return offers.length > 0 ? offers : [
      {
        id: 1,
        title: "Direct Booking",
        provider: "Official Website",
        price: "Best Price Guarantee",
        description: content.substring(0, 200) + "...",
        link: "#",
        features: ["Official rates", "Direct support", "No booking fees"],
        rating: 4.7,
        reviews: 1200
      }
    ];
  };

  if (!place) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{place.image}</span>
            <div>
              <h3 className="text-gradient">{place.name}</h3>
              <p className="text-sm text-gray-600 font-normal">Best offers and booking options</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {showApiKeyInput && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Key className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Perplexity API Key Required</h4>
              </div>
              <p className="text-blue-700 text-sm mb-3">
                To get real-time booking offers, please enter your Perplexity API key:
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="pplx-xxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
                  Save & Load Offers
                </Button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Your API key is stored locally and never shared.
              </p>
            </div>
          )}

          {!showApiKeyInput && (
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
              <span className="text-green-700 text-sm">✓ API key configured</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowApiKeyInput(true)}
                className="text-green-700 border-green-300"
              >
                Change Key
              </Button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Error</h4>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Finding the best deals for you...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{offer.title}</h4>
                      <p className="text-sm text-gray-600">{offer.provider}</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {offer.price}
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">{offer.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {offer.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>⭐ {offer.rating}</span>
                      <span>•</span>
                      <span>{offer.reviews} reviews</span>
                    </div>
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      onClick={() => window.open(offer.link, '_blank')}
                    >
                      View Offer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OffersModal;
