import { AppData, SmokeLog, CravingLog, Goal, Achievement, Quote, Settings, DailyStats } from '@shared/schema';

const STORAGE_KEY = 'quitwise_data';

class LocalStorage {
  private data: AppData = {
    smokeLogs: [],
    cravingLogs: [],
    goals: [],
    achievements: this.getDefaultAchievements(),
    quotes: this.getDefaultQuotes(),
    settings: {
      packCost: 12,
      cigarettesPerPack: 20,
      notificationsEnabled: true,
      darkMode: false,
    },
    dailyStats: [],
  };

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.data = { ...this.data, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  // Smoke Logs
  addSmokeLog(log: Omit<SmokeLog, 'id'>): SmokeLog {
    const newLog: SmokeLog = {
      ...log,
      id: this.generateId(),
    };
    this.data.smokeLogs.push(newLog);
    this.updateDailyStats(new Date(log.timestamp));
    this.saveData();
    return newLog;
  }

  getSmokeLogs(startDate?: Date, endDate?: Date): SmokeLog[] {
    if (!startDate && !endDate) return this.data.smokeLogs;
    
    return this.data.smokeLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > endDate) return false;
      return true;
    });
  }

  undoLastSmokeLog(): boolean {
    if (this.data.smokeLogs.length === 0) return false;
    
    const lastLog = this.data.smokeLogs.pop()!;
    this.updateDailyStats(new Date(lastLog.timestamp));
    this.saveData();
    return true;
  }

  // Craving Logs
  addCravingLog(log: Omit<CravingLog, 'id'>): CravingLog {
    const newLog: CravingLog = {
      ...log,
      id: this.generateId(),
    };
    this.data.cravingLogs.push(newLog);
    this.saveData();
    return newLog;
  }

  getCravingLogs(startDate?: Date, endDate?: Date): CravingLog[] {
    if (!startDate && !endDate) return this.data.cravingLogs;
    
    return this.data.cravingLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > endDate) return false;
      return true;
    });
  }

  // Goals
  addGoal(goal: Omit<Goal, 'id'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: this.generateId(),
    };
    this.data.goals.push(newGoal);
    this.saveData();
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const goalIndex = this.data.goals.findIndex(g => g.id === id);
    if (goalIndex === -1) return null;
    
    this.data.goals[goalIndex] = { ...this.data.goals[goalIndex], ...updates };
    this.saveData();
    return this.data.goals[goalIndex];
  }

  getGoals(): Goal[] {
    return this.data.goals;
  }

  // Achievements
  unlockAchievement(id: string): Achievement | null {
    const achievement = this.data.achievements.find(a => a.id === id);
    if (!achievement || achievement.unlockedAt) return null;
    
    achievement.unlockedAt = new Date().toISOString();
    this.saveData();
    return achievement;
  }

  getAchievements(): Achievement[] {
    return this.data.achievements;
  }

  // Quotes
  addCustomQuote(quote: Omit<Quote, 'id' | 'isCustom'>): Quote {
    const newQuote: Quote = {
      ...quote,
      id: this.generateId(),
      isCustom: true,
    };
    this.data.quotes.push(newQuote);
    this.saveData();
    return newQuote;
  }

  toggleQuoteFavorite(id: string): Quote | null {
    const quote = this.data.quotes.find(q => q.id === id);
    if (!quote) return null;
    
    quote.isFavorite = !quote.isFavorite;
    this.saveData();
    return quote;
  }

  getQuotes(): Quote[] {
    return this.data.quotes;
  }

  getDailyQuote(): Quote {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return this.data.quotes[seed % this.data.quotes.length];
  }

  // Settings
  updateSettings(updates: Partial<Settings>): Settings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
    return this.data.settings;
  }

  getSettings(): Settings {
    return this.data.settings;
  }

  // Daily Stats
  private updateDailyStats(date: Date): void {
    const dateStr = date.toISOString().split('T')[0];
    let stats = this.data.dailyStats.find(s => s.date === dateStr);
    
    if (!stats) {
      stats = {
        date: dateStr,
        cigaretteCount: 0,
        moneySaved: 0,
        cravingsResisted: 0,
      };
      this.data.dailyStats.push(stats);
    }
    
    // Recalculate stats for the day
    const daySmokeLogs = this.data.smokeLogs.filter(log => 
      log.timestamp.startsWith(dateStr)
    );
    const dayCravingLogs = this.data.cravingLogs.filter(log => 
      log.timestamp.startsWith(dateStr)
    );
    
    stats.cigaretteCount = daySmokeLogs.length;
    stats.cravingsResisted = dayCravingLogs.length;
    stats.moneySaved = this.calculateMoneySaved(stats.cigaretteCount);
  }

  getDailyStats(days: number = 30): DailyStats[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.data.dailyStats.filter(stats => {
      const statsDate = new Date(stats.date);
      return statsDate >= startDate && statsDate <= endDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Statistics
  getTodayStats(): DailyStats {
    const today = new Date().toISOString().split('T')[0];
    const stats = this.data.dailyStats.find(s => s.date === today);
    return stats || {
      date: today,
      cigaretteCount: 0,
      moneySaved: 0,
      cravingsResisted: 0,
    };
  }

  getCurrentStreak(): number {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayLogs = this.data.smokeLogs.filter(log => 
        log.timestamp.startsWith(dateStr)
      );
      
      if (dayLogs.length === 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  getTotalCigarettesAvoided(): number {
    // Calculate based on average before quit vs current consumption
    // This is a simplified calculation
    const totalDays = this.data.dailyStats.length;
    if (totalDays === 0) return 0;
    
    const averagePerDay = this.data.dailyStats.reduce((sum, stats) => 
      sum + stats.cigaretteCount, 0) / totalDays;
    
    // Assume they smoked 20 per day before (this could be made configurable)
    const beforeQuitAverage = 20;
    const dailyReduction = beforeQuitAverage - averagePerDay;
    
    return Math.max(0, dailyReduction * totalDays);
  }

  getTotalMoneySaved(): number {
    return this.data.dailyStats.reduce((total, stats) => 
      total + stats.moneySaved, 0);
  }

  private calculateMoneySaved(cigarettesAvoided: number): number {
    const costPerCigarette = this.data.settings.packCost / this.data.settings.cigarettesPerPack;
    return cigarettesAvoided * costPerCigarette;
  }

  // Trigger Analysis
  getTriggerAnalysis(): Record<string, number> {
    const triggers: Record<string, number> = {};
    
    this.data.smokeLogs.forEach(log => {
      triggers[log.trigger] = (triggers[log.trigger] || 0) + 1;
    });
    
    return triggers;
  }

  // Export/Import
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);
      this.data = { ...this.data, ...importedData };
      this.saveData();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  resetAllData(): void {
    this.data = {
      smokeLogs: [],
      cravingLogs: [],
      goals: [],
      achievements: this.getDefaultAchievements(),
      quotes: this.getDefaultQuotes(),
      settings: {
        packCost: 12,
        cigarettesPerPack: 20,
        notificationsEnabled: true,
        darkMode: false,
      },
      dailyStats: [],
    };
    this.saveData();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private getDefaultQuotes(): Quote[] {
    return [
      {
        id: 'q1',
        text: 'Every cigarette you don\'t smoke is a victory. Every day smoke-free is progress.',
        author: 'QuitWise Team',
        isFavorite: false,
        isCustom: false,
      },
      {
        id: 'q2',
        text: 'The best time to quit smoking was 20 years ago. The second best time is now.',
        author: 'Unknown',
        isFavorite: false,
        isCustom: false,
      },
      {
        id: 'q3',
        text: 'Quitting smoking is easy. I\'ve done it thousands of times.',
        author: 'Mark Twain',
        isFavorite: false,
        isCustom: false,
      },
      {
        id: 'q4',
        text: 'Your body is a temple. Don\'t let smoke cloud your vision of what you can become.',
        author: 'QuitWise Team',
        isFavorite: false,
        isCustom: false,
      },
      {
        id: 'q5',
        text: 'Every day without smoking is a gift to your future self.',
        author: 'QuitWise Team',
        isFavorite: false,
        isCustom: false,
      },
    ];
  }

  private getDefaultAchievements(): Achievement[] {
    return [
      {
        id: 'first_day',
        name: 'First Day',
        description: 'Completed your first smoke-free day',
        icon: 'medal',
        requirement: { type: 'smoke_free_days', value: 1 },
      },
      {
        id: 'three_days',
        name: '3 Day Streak',
        description: 'Three consecutive smoke-free days',
        icon: 'star',
        requirement: { type: 'consecutive_days', value: 3 },
      },
      {
        id: 'one_week',
        name: 'One Week',
        description: 'Seven consecutive smoke-free days',
        icon: 'trophy',
        requirement: { type: 'consecutive_days', value: 7 },
      },
      {
        id: 'first_craving',
        name: 'Craving Warrior',
        description: 'Logged your first craving instead of smoking',
        icon: 'heart',
        requirement: { type: 'cravings_logged', value: 1 },
      },
      {
        id: 'money_saver',
        name: 'Money Saver',
        description: 'Saved $50 by not smoking',
        icon: 'dollar-sign',
        requirement: { type: 'money_saved', value: 50 },
      },
    ];
  }
}

export const storage = new LocalStorage();
