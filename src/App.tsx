import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import StudyTracker from "@/pages/StudyTracker";
import GymTracker from "@/pages/GymTracker";
import FoodTracker from "@/pages/FoodTracker";
import TaskPlanner from "@/pages/TaskPlanner";
import AIAdvisor from "@/pages/AIAdvisor";
import Analytics from "@/pages/Analytics";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study" element={<StudyTracker />} />
            <Route path="/gym" element={<GymTracker />} />
            <Route path="/food" element={<FoodTracker />} />
            <Route path="/tasks" element={<TaskPlanner />} />
            <Route path="/ai" element={<AIAdvisor />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
