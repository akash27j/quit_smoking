import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Heart, Calendar } from 'lucide-react';
import { CigaretteChart } from '@/components/chart';
import { storage } from '@/lib/storage';
import { CravingLog, SmokeLog } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Journal() {
  const [cravingLogs, setCravingLogs] = useState<CravingLog[]>([]);
  const [smokeLogs, setSmokeLogs] = useState<SmokeLog[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    intensity: 3,
    notes: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCravingLogs(storage.getCravingLogs().reverse());
    setSmokeLogs(storage.getSmokeLogs().reverse());
  };

  const addCravingEntry = () => {
    storage.addCravingLog({
      timestamp: new Date().toISOString(),
      intensity: newEntry.intensity,
      mood: 'neutral',
      notes: newEntry.notes.trim() || undefined,
    });

    toast({
      title: "Journal entry added",
      description: "Great job documenting your journey!",
    });

    setIsAddModalOpen(false);
    setNewEntry({ intensity: 3, notes: '' });
    loadData();
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'bg-green-100 text-green-800';
    if (intensity === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 2) return 'Mild';
    if (intensity === 3) return 'Moderate';
    return 'Strong';
  };

  // Create chart data from craving logs
  const chartData = (() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last30Days.map(date => {
      const dayCravings = cravingLogs.filter(log => 
        log.timestamp.startsWith(date)
      );
      const avgIntensity = dayCravings.length > 0 
        ? dayCravings.reduce((sum, log) => sum + log.intensity, 0) / dayCravings.length
        : 0;
      
      return {
        date,
        cigaretteCount: Math.round(avgIntensity), // Repurpose for intensity
        moneySaved: 0,
        cravingsResisted: dayCravings.length,
      };
    });
  })();

  return (
    <div className="mobile-container pb-20">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Craving Journal</h2>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a Craving</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Intensity (1-5)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setNewEntry({ ...newEntry, intensity: level })}
                        className={`flex-1 py-2 text-center rounded-lg border transition-colors font-medium ${
                          newEntry.intensity === level
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes (optional)
                  </label>
                  <Textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="What triggered this craving? How are you feeling?"
                    rows={4}
                  />
                </div>
                
                <Button onClick={addCravingEntry} className="w-full">
                  Log Craving
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Craving Intensity Trend */}
        {cravingLogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Craving Intensity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <CigaretteChart 
                data={chartData} 
                type="line" 
                color="#F59E0B"
              />
              <p className="text-sm text-gray-500 mt-2">
                Shows average daily craving intensity over the last 30 days
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cravingLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No craving entries yet</p>
                <p className="text-sm">Start logging your cravings to track your progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cravingLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className={getIntensityColor(log.intensity)}>
                          {getIntensityLabel(log.intensity)} ({log.intensity}/5)
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {log.notes && (
                      <p className="text-sm text-gray-700 mt-2">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {cravingLogs.length}
              </div>
              <div className="text-sm text-gray-600">Total Cravings</div>
              <div className="text-xs text-gray-500">Logged</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {cravingLogs.filter(log => 
                  new Date(log.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <div className="text-sm text-gray-600">Today</div>
              <div className="text-xs text-gray-500">Resisted</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
