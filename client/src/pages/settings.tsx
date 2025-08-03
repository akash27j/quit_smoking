import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash2, Bell, Moon, DollarSign, Leaf } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useTheme } from '@/components/theme-provider';
import { Settings as SettingsType } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    packCost: 12,
    cigarettesPerPack: 20,
    notificationsEnabled: true,
    darkMode: false,
  });
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    setSettings(storage.getSettings());
  }, []);

  const updateSetting = (key: keyof SettingsType, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.updateSettings(newSettings);

    if (key === 'darkMode') {
      setTheme(value ? 'dark' : 'light');
    }
  };

  const exportData = () => {
    try {
      const data = storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quitwise-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const resetAllData = () => {
    storage.resetAllData();
    setSettings({
      packCost: 12,
      cigarettesPerPack: 20,
      notificationsEnabled: true,
      darkMode: false,
    });
    
    toast({
      title: "Data reset complete",
      description: "All your data has been cleared. You can start fresh!",
    });
  };

  const costPerCigarette = settings.packCost / settings.cigarettesPerPack;

  return (
    <div className="mobile-container pb-20">
      <div className="p-4 space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">Customize your QuitWise experience</p>
        </div>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Daily notifications</div>
                  <div className="text-sm text-gray-500">Get motivational reminders</div>
                </div>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Dark mode</div>
                  <div className="text-sm text-gray-500">Switch to dark theme</div>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cost Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Cost Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cost per pack ($)</label>
              <Input
                type="number"
                value={settings.packCost}
                onChange={(e) => updateSetting('packCost', parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cigarettes per pack</label>
              <Input
                type="number"
                value={settings.cigarettesPerPack}
                onChange={(e) => updateSetting('cigarettesPerPack', parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">
                Cost per cigarette: ${costPerCigarette.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Used to calculate money saved
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={exportData}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-gray-500">Download your data as JSON</div>
              </div>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Reset All Data</div>
                    <div className="text-sm text-red-400">This cannot be undone</div>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your data including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Smoke logs and triggers</li>
                      <li>Craving journal entries</li>
                      <li>Goals and achievements</li>
                      <li>Saved quotes</li>
                      <li>Settings</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAllData} className="bg-red-600 hover:bg-red-700">
                    Yes, reset all data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="text-primary w-8 h-8" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">QuitWise</h3>
            <p className="text-sm text-gray-500 mb-4">Version 1.0.0</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Your journey to a smoke-free life</p>
              <p>All data is stored locally on your device</p>
              <p className="mt-3 font-medium text-primary">You've got this! 💪</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
