import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CigaretteChart, TriggerChart } from '@/components/chart';
import { CalendarDays, TrendingDown, DollarSign } from 'lucide-react';
import { storage } from '@/lib/storage';
import { DailyStats } from '@shared/schema';

export default function Dashboard() {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [triggerData, setTriggerData] = useState<Record<string, number>>({});
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = () => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const stats = storage.getDailyStats(days);
    setDailyStats(stats);
    setTriggerData(storage.getTriggerAnalysis());
    setLongestStreak(storage.getCurrentStreak());
    setTotalSaved(storage.getTotalMoneySaved());
  };

  const averageCigarettesPerDay = dailyStats.length > 0 
    ? dailyStats.reduce((sum, stat) => sum + stat.cigaretteCount, 0) / dailyStats.length
    : 0;

  const bestDay = dailyStats.reduce((best, current) => 
    current.cigaretteCount < best.cigaretteCount ? current : best, 
    dailyStats[0] || { cigaretteCount: Infinity, date: '', moneySaved: 0, cravingsResisted: 0 }
  );

  return (
    <div className="mobile-container pb-20">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <Button variant="ghost" size="sm">
            <CalendarDays className="w-4 h-4" />
          </Button>
        </div>

        {/* Time Period Selector */}
        <Tabs value={period} onValueChange={(value) => setPeriod(value as '7d' | '30d' | '90d')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="space-y-6">
            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Cigarettes per Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyStats.length > 0 ? (
                  <CigaretteChart data={dailyStats} type="line" />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No data available for this period</p>
                      <p className="text-sm">Start logging your cigarettes to see trends</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trigger Analysis */}
            {Object.keys(triggerData).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Triggers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Chart */}
                    <TriggerChart data={triggerData} />
                    
                    {/* List */}
                    <div className="space-y-3">
                      {Object.entries(triggerData)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([trigger, count]) => {
                          const percentage = Math.round((count / Object.values(triggerData).reduce((a, b) => a + b, 0)) * 100);
                          return (
                            <div key={trigger} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <span className="text-red-500 text-sm capitalize">{trigger[0]}</span>
                                </div>
                                <span className="font-medium text-gray-900 capitalize">{trigger}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-full bg-red-400 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {longestStreak}
                  </div>
                  <div className="text-sm text-gray-600">Longest Streak</div>
                  <div className="text-xs text-gray-500 mt-1">days smoke-free</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/10 to-accent/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-accent-600 mb-1">
                    ${totalSaved.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Saved</div>
                  <div className="text-xs text-gray-500 mt-1">this period</div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average per day:</span>
                    <span className="font-semibold">{averageCigarettesPerDay.toFixed(1)} cigarettes</span>
                  </div>
                  
                  {bestDay && bestDay.cigaretteCount !== Infinity && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Best day:</span>
                      <span className="font-semibold">
                        {bestDay.cigaretteCount} cigarettes ({new Date(bestDay.date).toLocaleDateString()})
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total entries:</span>
                    <span className="font-semibold">{dailyStats.length} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
