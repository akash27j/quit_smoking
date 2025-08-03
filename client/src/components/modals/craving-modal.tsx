import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Leaf, Gamepad2 } from 'lucide-react';
import { BreathingExercise } from '@/components/breathing-exercise';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface CravingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCravingLogged?: () => void;
}

export function CravingModal({ isOpen, onClose, onCravingLogged }: CravingModalProps) {
  const [selectedIntensity, setSelectedIntensity] = useState<number>(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const { toast } = useToast();

  const handleLogCraving = () => {
    if (selectedIntensity === 0) {
      toast({
        title: "Please rate your craving intensity",
        description: "We need to know how intense your craving is to help you better.",
        variant: "destructive",
      });
      return;
    }

    storage.addCravingLog({
      timestamp: new Date().toISOString(),
      intensity: selectedIntensity,
      mood: 'neutral', // Could be expanded to include mood selection
    });

    toast({
      title: "Craving logged successfully",
      description: "Great job! You chose to log your craving instead of smoking. That's real progress!",
    });

    setSelectedIntensity(0);
    onCravingLogged?.();
    onClose();
  };

  const handleClose = () => {
    setSelectedIntensity(0);
    setShowBreathing(false);
    onClose();
  };

  if (showBreathing) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-md mx-auto">
          <BreathingExercise onComplete={() => setShowBreathing(false)} />
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowBreathing(false)}>
              Back to Options
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-red-500 w-8 h-8 animate-bounce-gentle" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            Take a Deep Breath
          </DialogTitle>
          <p className="text-gray-600">
            This craving will pass. Let's work through it together.
          </p>
        </div>

        <div className="space-y-6">
          {/* Craving Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How intense is your craving? (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedIntensity(level)}
                  className={`flex-1 py-3 text-center rounded-lg border transition-colors font-medium ${
                    selectedIntensity === level
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            {selectedIntensity > 0 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {selectedIntensity <= 2 && "Mild craving - you've got this!"}
                {selectedIntensity === 3 && "Moderate craving - let's work through it"}
                {selectedIntensity >= 4 && "Strong craving - take it one breath at a time"}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowBreathing(true)}
              className="p-4 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Leaf className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Breathing</div>
            </button>
            <button
              onClick={() => {
                toast({
                  title: "Great idea!",
                  description: "Try going for a walk, calling a friend, or doing a quick workout to distract yourself.",
                });
              }}
              className="p-4 bg-green-50 rounded-xl text-green-700 hover:bg-green-100 transition-colors"
            >
              <Gamepad2 className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Distraction</div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleLogCraving}
              className="w-full"
              disabled={selectedIntensity === 0}
            >
              Log This Craving
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full"
            >
              I'm Feeling Better
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
