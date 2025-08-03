import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Cigarette, DollarSign, Target, TrendingDown } from 'lucide-react';
import { LogSmokeModal } from '@/components/modals/log-smoke-modal';
import { CravingModal } from '@/components/modals/craving-modal';
import { storage } from '@/lib/storage';
import { Quote, DailyStats } from '@shared/schema';

export default function Home() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isCravingModalOpen, setIsCravingModalOpen] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [cigarettesAvoided, setCigarettesAvoided] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDailyQuote(storage.getDailyQuote());
    setTodayStats(storage.getTodayStats());
    setCurrentStreak(storage.getCurrentStreak());
    setTotalSaved(storage.getTotalMoneySaved());
    setCigarettesAvoided(storage.getTotalCigarettesAvoided());
  };

  const handleQuoteFavorite = () => {
    if (dailyQuote) {
      storage.toggleQuoteFavorite(dailyQuote.id);
      setDailyQuote({ ...dailyQuote, isFavorite: !dailyQuote.isFavorite });
    }
  };

  const undoLastEntry = () => {
    if (storage.undoLastSmokeLog()) {
      loadData();
    }
  };

  const yesterdayCount = (() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStats = storage.getDailyStats(2);
    return yesterdayStats.find(s => s.date === yesterday.toISOString().split('T')[0])?.cigaretteCount || 0;
  })();

  const todayChange = todayStats ? todayStats.cigaretteCount - yesterdayCount : 0;

  return (
    <div className="mobile-container pb-20">
      <div className="p-4 space-y-6">
        
        {/* Daily Quote Card */}
        {dailyQuote && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="text-white w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                    "{dailyQuote.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">- {dailyQuote.author}</span>
                    <button
                      onClick={handleQuoteFavorite}
                      className={`transition-colors ${
                        dailyQuote.isFavorite 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${dailyQuote.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Progress */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Today</h3>
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <Cigarette className="text-red-500 w-3 h-3" />
                </div>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900">
                  {todayStats?.cigaretteCount || 0}
                </span>
                <span className="text-sm text-gray-500">cigarettes</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                {todayChange !== 0 && (
                  <span className={`text-xs flex items-center ${
                    todayChange < 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {Math.abs(todayChange)} from yesterday
                  </span>
                )}
                <button
                  onClick={undoLastEntry}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Undo last
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Money Saved</h3>
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
                  <DollarSign className="text-accent-600 w-3 h-3" />
                </div>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900">
                  ${totalSaved.toFixed(0)}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">This week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          
          {/* Emergency Craving Button */}
          <Button
            onClick={() => setIsCravingModalOpen(true)}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-6 h-auto shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Heart className="text-white w-5 h-5" />
              </div>
              <span className="font-semibold">I'm Having a Craving</span>
            </div>
          </Button>

          {/* Log Smoke Button */}
          <Button
            onClick={() => setIsLogModalOpen(true)}
            variant="outline"
            className="w-full p-6 h-auto border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <div className="flex items-center justify-center space-x-3">
              <Plus className="text-gray-500 w-5 h-5" />
              <span className="font-medium text-gray-700">Log a Cigarette</span>
            </div>
          </Button>
        </div>

        {/* Statistics Overview */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your Progress</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {currentStreak}
                </div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {cigarettesAvoided}
                </div>
                <div className="text-xs text-gray-600">Avoided</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {Math.min(100, Math.round((currentStreak / 30) * 100))}%
                </div>
                <div className="text-xs text-gray-600">Health Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <LogSmokeModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onLogged={loadData}
      />

      <CravingModal
        isOpen={isCravingModalOpen}
        onClose={() => setIsCravingModalOpen(false)}
        onCravingLogged={loadData}
      />
    </div>
  );
}
