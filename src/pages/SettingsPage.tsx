import { Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";

interface UserSettings {
  name: string; email: string;
  dailyStudyGoal: number; dailyCalorieGoal: number; dailyWorkoutGoal: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<UserSettings>("user-settings", {
    name: "", email: "", dailyStudyGoal: 4, dailyCalorieGoal: 2000, dailyWorkoutGoal: 300,
  });

  const save = () => {
    toast.success("Settings saved!");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-primary" /> Settings
      </h1>

      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Profile</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Name</Label>
            <Input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Daily Goals</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Study Hours Goal</Label>
            <Input type="number" value={settings.dailyStudyGoal}
              onChange={(e) => setSettings({ ...settings, dailyStudyGoal: +e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Calorie Intake Goal (kcal)</Label>
            <Input type="number" value={settings.dailyCalorieGoal}
              onChange={(e) => setSettings({ ...settings, dailyCalorieGoal: +e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Workout Calories Goal</Label>
            <Input type="number" value={settings.dailyWorkoutGoal}
              onChange={(e) => setSettings({ ...settings, dailyWorkoutGoal: +e.target.value })} />
          </div>
        </div>
      </div>

      <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save Settings</Button>
    </div>
  );
}
