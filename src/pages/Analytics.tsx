import { BarChart3 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const [subjects] = useLocalStorage<any[]>("study-subjects", []);
  const [tasks] = useLocalStorage<any[]>("daily-tasks", []);
  const [meals] = useLocalStorage<any[]>("food-meals", []);
  const [weekPlan] = useLocalStorage<any[]>("gym-week-plan", []);

  // Study data
  const studyData = subjects.map((s: any) => ({
    name: s.name.slice(0, 10),
    completed: s.topics?.filter((t: any) => t.status === "Completed").length || 0,
    total: s.topics?.length || 0,
  }));

  // Task completion
  const tasksDone = tasks.filter((t: any) => t.completed).length;
  const tasksPending = tasks.length - tasksDone;
  const taskPieData = [
    { name: "Completed", value: tasksDone },
    { name: "Pending", value: tasksPending || (tasksDone === 0 ? 1 : 0) },
  ];
  const PIE_COLORS = ["hsl(174, 72%, 40%)", "hsl(220, 15%, 80%)"];

  // Calories per meal
  const calorieData = meals.map((m: any) => ({
    name: m.type,
    calories: m.items?.reduce((s: number, i: any) => s + (i.calories || 0), 0) || 0,
  }));

  // Gym calories per day
  const gymData = weekPlan.map((d: any) => ({
    name: d.day?.slice(0, 3) || "",
    burned: d.exercises?.reduce((s: number, e: any) => s + (e.caloriesBurned || 0), 0) || 0,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" /> Analytics
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Study Progress */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">Study Progress by Subject</h3>
          {studyData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground text-center py-8">Add subjects to see data</p>}
        </div>

        {/* Task Completion */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">Task Completion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={taskPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                {taskPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>✅ Done: {tasksDone}</span>
            <span>⏳ Pending: {tasksPending}</span>
          </div>
        </div>

        {/* Calories Intake */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">Calories by Meal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={calorieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="calories" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gym Calories */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">Gym Calories Burned</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gymData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="burned" fill="hsl(var(--gym))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
