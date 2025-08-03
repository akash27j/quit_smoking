import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BreathingExerciseProps {
  onComplete?: () => void;
}

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [seconds, setSeconds] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycle, setCycle] = useState(0);

  const phases = {
    inhale: { duration: 4, next: 'hold', text: 'Breathe In' },
    hold: { duration: 7, next: 'exhale', text: 'Hold' },
    exhale: { duration: 8, next: 'pause', text: 'Breathe Out' },
    pause: { duration: 1, next: 'inhale', text: 'Rest' },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      const currentPhase = phases[phase];
      const nextPhase = currentPhase.next as keyof typeof phases;
      
      setPhase(nextPhase);
      setSeconds(phases[nextPhase].duration);
      
      if (nextPhase === 'inhale') {
        const newCycle = cycle + 1;
        setCycle(newCycle);
        
        if (newCycle >= 5) {
          setIsActive(false);
          onComplete?.();
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, phase, cycle]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setSeconds(4);
    setCycle(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setSeconds(4);
    setCycle(0);
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-90';
      default:
        return 'scale-100';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className={`w-32 h-32 mx-auto relative transition-transform duration-1000 ease-in-out ${getCircleSize()}`}>
            <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary rounded-full flex items-center justify-center shadow-lg">
              <div className="text-white font-semibold text-lg">
                {phases[phase].text}
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="text-3xl font-bold text-primary">
              {seconds}
            </div>
            <div className="text-sm text-muted-foreground">
              {isActive ? `Cycle ${cycle + 1} of 5` : 'Ready to begin'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>4-7-8 Breathing Exercise</p>
            <p className="text-xs mt-1">Inhale for 4, hold for 7, exhale for 8 seconds</p>
          </div>
          
          <div className="flex gap-2">
            {!isActive ? (
              <Button onClick={startExercise} className="flex-1">
                Start Exercise
              </Button>
            ) : (
              <Button onClick={stopExercise} variant="outline" className="flex-1">
                Stop Exercise
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
