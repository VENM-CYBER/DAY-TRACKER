import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Exercise { id: string; name: string; sets: number; reps: number; weight: number; caloriesBurned: number; }
interface DayPlan { day: string; exercises: Exercise[]; }

export default function GymTracker() {
  const [weekPlan, setWeekPlan] = useLocalStorage<DayPlan[]>(
    "gym-week-plan",
    DAYS.map((day) => ({ day, exercises: [] }))
  );
  const [newExercise, setNewExercise] = useState({ name: "", sets: 3, reps: 10, weight: 0, caloriesBurned: 0 });

  const addExercise = (dayIndex: number) => {
    if (!newExercise.name.trim()) return;
    setWeekPlan((prev) => prev.map((d, i) =>
      i === dayIndex ? { ...d, exercises: [...d.exercises, { ...newExercise, id: crypto.randomUUID() }] } : d
    ));
    setNewExercise({ name: "", sets: 3, reps: 10, weight: 0, caloriesBurned: 0 });
  };

  const removeExercise = (dayIndex: number, exerciseId: string) => {
    setWeekPlan((prev) => prev.map((d, i) =>
      i === dayIndex ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) } : d
    ));
  };

  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Dumbbell className="h-6 w-6 text-gym" /> Gym Tracker
      </h1>

      <Tabs defaultValue={DAYS[todayIndex]} className="w-full">
        <TabsList className="w-full flex overflow-x-auto">
          {DAYS.map((day, i) => (
            <TabsTrigger key={day} value={day} className="flex-1 text-xs">
              {day.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAYS.map((day, dayIndex) => {
          const dayData = weekPlan[dayIndex];
          const totalCals = dayData.exercises.reduce((s, e) => s + e.caloriesBurned, 0);

          return (
            <TabsContent key={day} value={day}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{day}</h2>
                  <span className="text-sm text-muted-foreground">🔥 {totalCals} cal burned</span>
                </div>

                {/* Add Exercise Form */}
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <Input placeholder="Exercise name" value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })} className="text-sm" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Sets</label>
                      <Input type="number" value={newExercise.sets}
                        onChange={(e) => setNewExercise({ ...newExercise, sets: +e.target.value })} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Reps</label>
                      <Input type="number" value={newExercise.reps}
                        onChange={(e) => setNewExercise({ ...newExercise, reps: +e.target.value })} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Weight (kg)</label>
                      <Input type="number" value={newExercise.weight}
                        onChange={(e) => setNewExercise({ ...newExercise, weight: +e.target.value })} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Calories</label>
                      <Input type="number" value={newExercise.caloriesBurned}
                        onChange={(e) => setNewExercise({ ...newExercise, caloriesBurned: +e.target.value })} className="text-sm" />
                    </div>
                  </div>
                  <Button size="sm" onClick={() => addExercise(dayIndex)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Exercise
                  </Button>
                </div>

                {/* Exercises List */}
                <div className="space-y-2">
                  {dayData.exercises.map((ex) => (
                    <div key={ex.id} className="glass-card rounded-lg p-3 flex items-center gap-3">
                      <div className="gradient-gym w-8 h-8 rounded-md flex items-center justify-center shrink-0">
                        <Dumbbell className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{ex.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ex.sets}×{ex.reps} • {ex.weight}kg • {ex.caloriesBurned} cal
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeExercise(dayIndex, ex.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {!dayData.exercises.length && (
                    <p className="text-center py-8 text-sm text-muted-foreground">No exercises for {day}. Add one above!</p>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
