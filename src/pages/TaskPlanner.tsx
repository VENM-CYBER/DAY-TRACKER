import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, Plus, Trash2, GripVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Task { id: string; title: string; time: string; completed: boolean; }

export default function TaskPlanner() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("daily-tasks", []);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title: newTask.trim(), time: newTime, completed: false }]
      .sort((a, b) => a.time.localeCompare(b.time)));
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const done = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ListTodo className="h-6 w-6 text-tasks" /> Daily Planner
        </h1>
        <span className="text-sm text-muted-foreground">{done}/{tasks.length} done</span>
      </div>

      {/* Add Task */}
      <div className="flex gap-2">
        <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-28 text-sm" />
        <Input placeholder="Add a task..." value={newTask} onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()} className="flex-1 text-sm" />
        <Button onClick={addTask} size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`glass-card rounded-lg p-3 flex items-center gap-3 transition-opacity ${task.completed ? "opacity-60" : ""}`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
              <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {task.time}
              </div>
              <span className={`text-sm flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteTask(task.id)}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {!tasks.length && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No tasks yet. Plan your day above!
          </div>
        )}
      </div>
    </div>
  );
}
