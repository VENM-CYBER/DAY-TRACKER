import { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;

interface FoodItem { id: string; name: string; calories: number; protein: number; carbs: number; fat: number; }
interface Meal { type: string; items: FoodItem[]; }

export default function FoodTracker() {
  const [meals, setMeals] = useLocalStorage<Meal[]>(
    "food-meals",
    MEAL_TYPES.map((type) => ({ type, items: [] }))
  );
  const [newItem, setNewItem] = useState({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });

  const addItem = (mealIndex: number) => {
    if (!newItem.name.trim()) return;
    setMeals((prev) => prev.map((m, i) =>
      i === mealIndex ? { ...m, items: [...m.items, { ...newItem, id: crypto.randomUUID() }] } : m
    ));
    setNewItem({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const removeItem = (mealIndex: number, itemId: string) => {
    setMeals((prev) => prev.map((m, i) =>
      i === mealIndex ? { ...m, items: m.items.filter((it) => it.id !== itemId) } : m
    ));
  };

  const totalCalories = meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + i.calories, 0), 0);
  const totalProtein = meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + i.protein, 0), 0);
  const totalCarbs = meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + i.carbs, 0), 0);
  const totalFat = meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + i.fat, 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UtensilsCrossed className="h-6 w-6 text-food" /> Food Tracker
      </h1>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Calories", value: totalCalories, unit: "kcal", color: "text-food" },
          { label: "Protein", value: totalProtein, unit: "g", color: "text-primary" },
          { label: "Carbs", value: totalCarbs, unit: "g", color: "text-study" },
          { label: "Fat", value: totalFat, unit: "g", color: "text-gym" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label} ({stat.unit})</p>
          </div>
        ))}
      </div>

      {/* Meals */}
      {meals.map((meal, mealIndex) => (
        <motion.div
          key={meal.type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mealIndex * 0.1 }}
          className="glass-card rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{meal.type}</h2>
            <span className="text-xs text-muted-foreground">
              {meal.items.reduce((s, i) => s + i.calories, 0)} kcal
            </span>
          </div>

          {/* Add Item */}
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Food name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="text-sm flex-1 min-w-[120px]" />
            <Input type="number" placeholder="Cal" value={newItem.calories || ""} onChange={(e) => setNewItem({ ...newItem, calories: +e.target.value })}
              className="text-sm w-16" />
            <Input type="number" placeholder="P" value={newItem.protein || ""} onChange={(e) => setNewItem({ ...newItem, protein: +e.target.value })}
              className="text-sm w-14" />
            <Input type="number" placeholder="C" value={newItem.carbs || ""} onChange={(e) => setNewItem({ ...newItem, carbs: +e.target.value })}
              className="text-sm w-14" />
            <Input type="number" placeholder="F" value={newItem.fat || ""} onChange={(e) => setNewItem({ ...newItem, fat: +e.target.value })}
              className="text-sm w-14" />
            <Button size="sm" onClick={() => addItem(mealIndex)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Items */}
          {meal.items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
              <span className="text-sm flex-1">{item.name}</span>
              <span className="text-xs text-muted-foreground">{item.calories} cal</span>
              <span className="text-xs text-muted-foreground">P:{item.protein} C:{item.carbs} F:{item.fat}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(mealIndex, item.id)}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
