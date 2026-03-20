import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Dumbbell, UtensilsCrossed, ListTodo, TrendingUp, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Link } from "react-router-dom";

const quotes = [
  "The secret of getting ahead is getting started. – Mark Twain",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "Education is the most powerful weapon. – Nelson Mandela",
  "Take care of your body. It's the only place you have to live. – Jim Rohn",
  "Success is the sum of small efforts repeated day in and day out.",
  "Push yourself, because no one else is going to do it for you.",
];

const cardData = [
  { title: "Study", icon: BookOpen, gradient: "gradient-study", path: "/study", key: "study" },
  { title: "Gym", icon: Dumbbell, gradient: "gradient-gym", path: "/gym", key: "gym" },
  { title: "Food", icon: UtensilsCrossed, gradient: "gradient-food", path: "/food", key: "food" },
  { title: "Tasks", icon: ListTodo, gradient: "gradient-tasks", path: "/tasks", key: "tasks" },
];

export default function Dashboard() {
  const [quote, setQuote] = useState("");
  const [subjects] = useLocalStorage<any[]>("study-subjects", []);
  const [tasks] = useLocalStorage<any[]>("daily-tasks", []);
  const [meals] = useLocalStorage<any[]>("food-meals", []);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const studyProgress = subjects.length
    ? Math.round(subjects.reduce((acc: number, s: any) => {
        const total = s.topics?.length || 0;
        const done = s.topics?.filter((t: any) => t.status === "Completed").length || 0;
        return acc + (total ? (done / total) * 100 : 0);
      }, 0) / subjects.length)
    : 0;

  const tasksDone = tasks.filter((t: any) => t.completed).length;
  const tasksTotal = tasks.length;
  const taskProgress = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0;

  const totalCalories = meals.reduce((sum: number, m: any) => 
    sum + (m.items?.reduce((s: number, i: any) => s + (i.calories || 0), 0) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Good day! 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">{today}</p>
      </div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-4 flex items-start gap-3"
      >
        <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground italic">"{quote}"</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={card.path}>
              <div className="glass-card rounded-xl p-4 hover:border-primary/30 transition-all group cursor-pointer">
                <div className={`${card.gradient} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <card.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-sm">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.key === "study" && `${studyProgress}% complete`}
                  {card.key === "gym" && "Track workouts"}
                  {card.key === "food" && `${totalCalories} cal today`}
                  {card.key === "tasks" && `${tasksDone}/${tasksTotal} done`}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Study Progress</h3>
          </div>
          <Progress value={studyProgress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">{studyProgress}% of topics completed</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Tasks Progress</h3>
          </div>
          <Progress value={taskProgress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">{tasksDone} of {tasksTotal} tasks completed</p>
        </div>
      </div>
    </div>
  );
}
