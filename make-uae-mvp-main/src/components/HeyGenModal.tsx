
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const HeyGenModal = ({ isOpen, onClose }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">🎥</span>
            <div>
              <h3 className="text-gradient">Meet Aisha - Your UAE Guide</h3>
              <p className="text-sm text-gray-600 font-normal">Personal video assistant for UAE travel</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden">
            {!isVideoLoaded ? (
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">👩‍💼</div>
                  <h3 className="text-xl font-semibold mb-2">Meet Aisha</h3>
                  <p className="text-purple-200 mb-4">Your personal UAE travel expert</p>
                  <Button 
                    onClick={() => setIsVideoLoaded(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    ▶️ Start Video Chat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4 animate-pulse">🎬</div>
                  <h3 className="text-xl font-semibold mb-2">Video Agent Integration</h3>
                  <p className="text-purple-200 mb-4">HeyGen agent would appear here</p>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <p className="text-sm text-purple-200">
                      "Hello! I'm Aisha, your personal UAE travel guide. I can help you with recommendations, 
                      cultural insights, and personalized suggestions for your perfect UAE adventure!"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🎯 What Aisha Can Help With</h4>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Personalized recommendations</li>
                <li>• Cultural etiquette & tips</li>
                <li>• Real-time travel advice</li>
                <li>• Local insights & hidden gems</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">🌟 Interactive Features</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Voice conversation support</li>
                <li>• Visual recommendations</li>
                <li>• Real-time Q&A</li>
                <li>• Multilingual support</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
              disabled={!isVideoLoaded}
            >
              🎤 Voice Chat
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              disabled={!isVideoLoaded}
            >
              💬 Text Chat
            </Button>
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsVideoLoaded(false)}
            >
              🔄 Reset
            </Button>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">🚀 Coming Soon</h4>
            <p className="text-yellow-700 text-sm">
              Full HeyGen integration with live video agents, voice recognition, and AI-powered conversations 
              will be available in the next update!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeyGenModal;
