import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import ReactMarkdown from "react-markdown";

interface Message { role: "user" | "assistant"; content: string; }

const mockResponses: Record<string, string> = {
  study: `📚 **Suggested Study Schedule:**
- **Morning (8-10 AM):** Focus on your hardest subject
- **Mid-day (11 AM-1 PM):** Practice problems & revision
- **Afternoon (3-5 PM):** Light reading & video lectures
- **Evening (7-8 PM):** Quick review & flashcards

💡 Use the Pomodoro technique: 25 min study, 5 min break!`,
  diet: `🥗 **Suggested Diet Plan:**
- **Breakfast:** Oatmeal with berries + 2 eggs (400 cal)
- **Snack:** Greek yogurt + almonds (200 cal)
- **Lunch:** Grilled chicken, rice, veggies (500 cal)
- **Snack:** Banana + peanut butter (250 cal)
- **Dinner:** Salmon, sweet potato, salad (450 cal)

Total: ~1800 cal | High protein for muscle recovery!`,
  workout: `💪 **Suggested Workout Routine:**

**Mon/Thu - Upper Body:**
- Bench Press: 4×8
- Rows: 4×10
- Shoulder Press: 3×10
- Bicep Curls: 3×12

**Tue/Fri - Lower Body:**
- Squats: 4×8
- Deadlifts: 3×6
- Lunges: 3×12
- Calf Raises: 4×15

**Wed/Sat - Cardio + Core**
Rest on Sunday! 🧘`,
  youtube: `🎥 **Recommended Learning Resources:**
- **Math:** 3Blue1Brown - Visual math explanations
- **Physics:** Walter Lewin - MIT lectures
- **CS:** freeCodeCamp - Full courses
- **Biology:** Kurzgesagt - Animated science
- **Languages:** Duolingo YouTube channel`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("study") || lower.includes("schedule")) return mockResponses.study;
  if (lower.includes("diet") || lower.includes("food") || lower.includes("meal") || lower.includes("eat")) return mockResponses.diet;
  if (lower.includes("workout") || lower.includes("gym") || lower.includes("exercise")) return mockResponses.workout;
  if (lower.includes("youtube") || lower.includes("video") || lower.includes("learn")) return mockResponses.youtube;
  return `Great question! Here are some tips:\n\n1. **Stay consistent** with your daily routine\n2. **Track your progress** using this app\n3. **Set small goals** and celebrate wins\n4. **Get enough sleep** (7-8 hours)\n5. **Stay hydrated** (8 glasses of water daily)\n\nFeel free to ask about study schedules, diet plans, workout routines, or learning resources! 🚀`;
}

export default function AIAdvisor() {
  const [messages, setMessages] = useLocalStorage<Message[]>("ai-messages", [
    { role: "assistant", content: "👋 Hi! I'm your AI Student Life Advisor. I can help with:\n\n- 📚 **Study schedules**\n- 🥗 **Diet plans**\n- 💪 **Workout routines**\n- 🎥 **YouTube recommendations**\n\nWhat would you like help with?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(userMsg.content);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Bot className="h-6 w-6 text-primary" /> AI Advisor
      </h1>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto tracker-scrollbar space-y-4 pb-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="gradient-hero w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "glass-card rounded-bl-md"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
            {msg.role === "user" && (
              <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="gradient-hero w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <Input
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={isTyping || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
