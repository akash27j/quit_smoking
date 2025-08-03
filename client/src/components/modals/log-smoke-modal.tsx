import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Clock, RotateCcw, Coffee, Car } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface LogSmokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogged?: () => void;
}

const triggers = [
  { id: 'stress', label: 'Stress', icon: Brain },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'boredom', label: 'Boredom', icon: Clock },
  { id: 'habit', label: 'Habit', icon: RotateCcw },
  { id: 'coffee', label: 'Coffee', icon: Coffee },
  { id: 'driving', label: 'Driving', icon: Car },
];

const moods = [
  { id: 'happy', label: 'Good', emoji: '😊' },
  { id: 'neutral', label: 'Okay', emoji: '😐' },
  { id: 'sad', label: 'Low', emoji: '😔' },
  { id: 'stressed', label: 'Stressed', emoji: '😰' },
];

export function LogSmokeModal({ isOpen, onClose, onLogged }: LogSmokeModalProps) {
  const [selectedTrigger, setSelectedTrigger] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedTrigger || !selectedMood) {
      toast({
        title: "Please select trigger and mood",
        description: "Both trigger and mood are required to log a cigarette.",
        variant: "destructive",
      });
      return;
    }

    storage.addSmokeLog({
      timestamp: new Date().toISOString(),
      trigger: selectedTrigger,
      mood: selectedMood,
      notes: notes.trim() || undefined,
    });

    toast({
      title: "Cigarette logged",
      description: "We've recorded this entry. Remember, every step towards quitting counts!",
    });

    // Reset form
    setSelectedTrigger('');
    setSelectedMood('');
    setNotes('');
    
    onLogged?.();
    onClose();
  };

  const handleClose = () => {
    setSelectedTrigger('');
    setSelectedMood('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Log a Cigarette</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trigger Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What triggered this?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {triggers.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <button
                    key={trigger.id}
                    onClick={() => setSelectedTrigger(trigger.id)}
                    className={`p-3 rounded-lg border text-sm transition-colors ${
                      selectedTrigger === trigger.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1 text-gray-500" />
                    <div>{trigger.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How are you feeling?
            </label>
            <div className="flex space-x-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex-1 p-3 rounded-lg border text-center transition-colors ${
                    selectedMood === mood.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel? What happened?"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
            >
              Log Cigarette
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
