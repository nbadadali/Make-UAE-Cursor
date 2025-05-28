
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PhotoGeneratorModal = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateUAEBackground = async () => {
    if (!selectedImage) return;
    
    setIsGenerating(true);
    
    // Simulate ComfyUI generation
    setTimeout(() => {
      // For demo purposes, we'll show a placeholder
      setGeneratedImage('/placeholder.svg');
      setIsGenerating(false);
    }, 3000);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'uae-styled-photo.jpg';
    link.href = generatedImage;
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">🎨</span>
            <div>
              <h3 className="text-gradient">UAE Photo Magic</h3>
              <p className="text-sm text-gray-600 font-normal">Transform your photos with UAE backgrounds</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-lg font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-gray-600 mb-4">Choose a photo to add stunning UAE backgrounds</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <Button 
                onClick={() => document.getElementById('photo-upload').click()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                Choose Photo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-semibold mb-3">Your Photo Preview</h4>
                <img 
                  src={selectedImage} 
                  alt="Uploaded" 
                  className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
                />
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">✨ UAE Magic Options</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-orange-700">🏗️ Burj Khalifa backdrop</div>
                  <div className="text-orange-700">🏜️ Desert sunset scene</div>
                  <div className="text-orange-700">🕌 Mosque architecture</div>
                  <div className="text-orange-700">🌊 Dubai Marina view</div>
                </div>
              </div>

              {!generatedImage ? (
                <Button 
                  onClick={generateUAEBackground}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating UAE Magic...
                    </div>
                  ) : (
                    '🎨 Generate UAE Background'
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold mb-3 text-green-700">🎉 Your UAE Styled Photo!</h4>
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="w-full max-w-sm mx-auto rounded-xl shadow-lg border-2 border-green-200"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={downloadImage}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      📥 Download
                    </Button>
                    <Button 
                      onClick={() => {
                        setSelectedImage(null);
                        setGeneratedImage(null);
                      }}
                      variant="outline"
                      className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      🔄 Try Another
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for Best Results</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Use high-quality photos (1MB+ recommended)</li>
              <li>• Clear subject with good lighting works best</li>
              <li>• Portrait and landscape photos both supported</li>
              <li>• Processing takes 30-60 seconds</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoGeneratorModal;
