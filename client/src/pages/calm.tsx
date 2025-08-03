import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreathingExercise } from '@/components/breathing-exercise';
import { Leaf, Heart, Brain, Music, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Calm() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const { toast } = useToast();

  const exercises = [
    {
      id: 'breathing',
      name: '4-7-8 Breathing',
      description: 'Calm your mind with controlled breathing',
      icon: Leaf,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'meditation',
      name: '5 Minute Meditation',
      description: 'Quick mindfulness session',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'visualization',
      name: 'Peaceful Visualization',
      description: 'Imagine your smoke-free future',
      icon: Heart,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'sounds',
      name: 'Calming Sounds',
      description: 'Nature sounds for relaxation',
      icon: Music,
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  const tips = [
    "Take 10 deep breaths before reaching for a cigarette",
    "Drink a glass of water to occupy your hands and mouth",
    "Go for a 5-minute walk to change your environment",
    "Call a friend or family member for support",
    "Practice the 5-4-3-2-1 grounding technique",
    "Chew gum or eat something healthy instead",
  ];

  const handleExerciseComplete = () => {
    toast({
      title: "Exercise completed!",
      description: "Great job! You've taken a positive step towards managing your cravings.",
    });
    setActiveExercise(null);
  };

  const startExercise = (exerciseId: string) => {
    if (exerciseId === 'breathing') {
      setActiveExercise('breathing');
    } else if (exerciseId === 'meditation') {
      toast({
        title: "Meditation Timer Started",
        description: "Take 5 minutes to focus on your breath and let thoughts pass by.",
      });
      // Start 5-minute timer
      setTimeout(() => {
        toast({
          title: "Meditation Complete",
          description: "Well done! You've completed your 5-minute meditation session.",
        });
      }, 5 * 60 * 1000);
    } else if (exerciseId === 'visualization') {
      toast({
        title: "Visualization Exercise",
        description: "Close your eyes and imagine yourself healthy, smoke-free, and proud of your progress.",
      });
    } else if (exerciseId === 'sounds') {
      toast({
        title: "Calming Sounds",
        description: "In a full app, this would play nature sounds like rain, ocean waves, or forest ambience.",
      });
    }
  };

  if (activeExercise === 'breathing') {
    return (
      <div className="mobile-container pb-20">
        <div className="p-4 flex items-center justify-center min-h-[80vh]">
          <div className="w-full">
            <BreathingExercise onComplete={handleExerciseComplete} />
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveExercise(null)}
              >
                Back to Calm Tools
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container pb-20">
      <div className="p-4 space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Calm Down Tools</h2>
          <p className="text-gray-600">Take a moment to center yourself</p>
        </div>

        {/* Emergency Banner */}
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-white animate-bounce-gentle" />
              <div>
                <h3 className="font-semibold">Having a strong craving?</h3>
                <p className="text-sm opacity-90">Try the breathing exercise first - it only takes 2 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Choose an Exercise</h3>
          {exercises.map((exercise) => {
            const Icon = exercise.icon;
            return (
              <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${exercise.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                        <p className="text-sm text-gray-600">{exercise.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => startExercise(exercise.id)}
                      size="sm"
                    >
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quick Craving Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 font-medium mb-2">
              "The craving will pass whether you smoke or not. Choose not to smoke and celebrate the victory."
            </p>
            <p className="text-sm text-gray-500">- QuitWise Team</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
