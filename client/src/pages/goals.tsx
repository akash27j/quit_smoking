import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Trophy, Star, Medal, Heart, DollarSign, Target } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Goal, Achievement } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'smoke-free-days',
    target: 7,
    duration: 7,
    unit: 'days',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setGoals(storage.getGoals());
    setAchievements(storage.getAchievements());
  };

  const createGoal = () => {
    const startDate = new Date();
    const endDate = new Date();
    
    if (newGoal.unit === 'days') {
      endDate.setDate(startDate.getDate() + newGoal.duration);
    } else if (newGoal.unit === 'weeks') {
      endDate.setDate(startDate.getDate() + (newGoal.duration * 7));
    } else if (newGoal.unit === 'months') {
      endDate.setMonth(startDate.getMonth() + newGoal.duration);
    }

    storage.addGoal({
      type: newGoal.type as 'smoke-free-days' | 'reduce-cigarettes' | 'money-target',
      target: newGoal.target,
      duration: newGoal.duration,
      unit: newGoal.unit as 'days' | 'weeks' | 'months',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      completed: false,
      progress: 0,
    });

    toast({
      title: "Goal created!",
      description: "Your new goal has been set. You can do this!",
    });

    setIsCreateModalOpen(false);
    setNewGoal({
      type: 'smoke-free-days',
      target: 7,
      duration: 7,
      unit: 'days',
    });
    loadData();
  };

  const getGoalProgress = (goal: Goal) => {
    const now = new Date();
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    
    if (goal.type === 'smoke-free-days') {
      const currentStreak = storage.getCurrentStreak();
      return Math.min(100, (currentStreak / goal.target) * 100);
    }
    
    // Time-based progress fallback
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, (elapsed / totalDuration) * 100);
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'medal': return Medal;
      case 'star': return Star;
      case 'trophy': return Trophy;
      case 'heart': return Heart;
      case 'dollar-sign': return DollarSign;
      default: return Target;
    }
  };

  const currentGoal = goals.find(g => !g.completed);
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="mobile-container pb-20">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Goals & Achievements</h2>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Goal Type</label>
                  <Select 
                    value={newGoal.type} 
                    onValueChange={(value) => setNewGoal({ ...newGoal, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smoke-free-days">Smoke-free days</SelectItem>
                      <SelectItem value="reduce-cigarettes">Reduce daily cigarettes</SelectItem>
                      <SelectItem value="money-target">Money saving target</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Target</label>
                    <Input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <Input
                      type="number"
                      value={newGoal.duration}
                      onChange={(e) => setNewGoal({ ...newGoal, duration: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <Select 
                    value={newGoal.unit} 
                    onValueChange={(value) => setNewGoal({ ...newGoal, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={createGoal} className="w-full">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Goal Progress */}
        {currentGoal && (
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Current Goal</h3>
              <p className="text-primary-100 mb-4">
                {currentGoal.target} {currentGoal.type.replace('-', ' ')}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">
                  {currentGoal.type === 'smoke-free-days' 
                    ? `${storage.getCurrentStreak()} of ${currentGoal.target} days`
                    : `${Math.round(getGoalProgress(currentGoal))}% complete`
                  }
                </span>
                <span className="text-sm">
                  {Math.round(getGoalProgress(currentGoal))}%
                </span>
              </div>
              <Progress 
                value={getGoalProgress(currentGoal)} 
                className="bg-primary-400 [&>div]:bg-white"
              />
            </CardContent>
          </Card>
        )}

        {/* Achievement Badges */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Achievements</h3>
          <div className="grid grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => {
              const Icon = getAchievementIcon(achievement.icon);
              return (
                <Card key={achievement.id} className="bg-gradient-to-br from-accent/10 to-accent/20">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="text-accent-600 w-6 h-6" />
                    </div>
                    <div className="text-xs font-medium text-gray-900 mb-1">{achievement.name}</div>
                    <Badge variant="secondary" className="text-xs">Completed</Badge>
                  </CardContent>
                </Card>
              );
            })}
            
            {lockedAchievements.slice(0, 6 - unlockedAchievements.length).map((achievement) => {
              const Icon = getAchievementIcon(achievement.icon);
              return (
                <Card key={achievement.id} className="opacity-60">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="text-gray-400 w-6 h-6" />
                    </div>
                    <div className="text-xs font-medium text-gray-500 mb-1">{achievement.name}</div>
                    <Badge variant="outline" className="text-xs">Locked</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Goal History */}
        {goals.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Goal History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goals.slice(0, 5).map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium text-sm">
                        {goal.target} {goal.type.replace('-', ' ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={goal.completed ? "default" : "secondary"}>
                      {goal.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
