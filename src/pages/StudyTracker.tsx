import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Badge } from "@/components/ui/badge";

interface Topic {
  id: string; name: string; status: "Not Started" | "In Progress" | "Completed";
  videoUrl: string; notes: string;
}
interface Subject {
  id: string; name: string; topics: Topic[];
}

export default function StudyTracker() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>("study-subjects", []);
  const [newSubject, setNewSubject] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState("");

  const addSubject = () => {
    if (!newSubject.trim()) return;
    setSubjects((prev) => [...prev, { id: crypto.randomUUID(), name: newSubject.trim(), topics: [] }]);
    setNewSubject("");
  };

  const deleteSubject = (id: string) => setSubjects((prev) => prev.filter((s) => s.id !== id));

  const addTopic = (subjectId: string) => {
    if (!newTopicName.trim()) return;
    setSubjects((prev) => prev.map((s) =>
      s.id === subjectId ? {
        ...s, topics: [...s.topics, {
          id: crypto.randomUUID(), name: newTopicName.trim(),
          status: "Not Started", videoUrl: "", notes: "",
        }],
      } : s
    ));
    setNewTopicName("");
  };

  const updateTopic = (subjectId: string, topicId: string, updates: Partial<Topic>) => {
    setSubjects((prev) => prev.map((s) =>
      s.id === subjectId ? {
        ...s, topics: s.topics.map((t) => t.id === topicId ? { ...t, ...updates } : t),
      } : s
    ));
  };

  const deleteTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) => prev.map((s) =>
      s.id === subjectId ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) } : s
    ));
  };

  const getProgress = (subject: Subject) => {
    if (!subject.topics.length) return 0;
    return Math.round((subject.topics.filter((t) => t.status === "Completed").length / subject.topics.length) * 100);
  };

  const statusColor = (status: string) => {
    if (status === "Completed") return "bg-primary/20 text-primary";
    if (status === "In Progress") return "bg-accent/20 text-accent";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-study" /> Study Tracker
        </h1>
      </div>

      {/* Add Subject */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a subject..."
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSubject()}
          className="max-w-sm"
        />
        <Button onClick={addSubject} size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>

      {/* Subjects List */}
      <div className="space-y-3">
        <AnimatePresence>
          {subjects.map((subject) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <div
                className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === subject.id ? null : subject.id)}
              >
                {expanded === subject.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{subject.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Progress value={getProgress(subject)} className="h-1.5 flex-1 max-w-40" />
                    <span className="text-xs text-muted-foreground">{getProgress(subject)}%</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{subject.topics.length} topics</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>

              <AnimatePresence>
                {expanded === subject.id && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      {/* Add Topic */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add topic..."
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addTopic(subject.id)}
                          className="text-sm"
                        />
                        <Button size="sm" variant="secondary" onClick={() => addTopic(subject.id)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {subject.topics.map((topic) => (
                        <div key={topic.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium flex-1">{topic.name}</span>
                            <Badge className={`text-xs ${statusColor(topic.status)}`}>{topic.status}</Badge>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteTopic(subject.id, topic.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                          <Select value={topic.status} onValueChange={(v) => updateTopic(subject.id, topic.id, { status: v as Topic["status"] })}>
                            <SelectTrigger className="h-8 text-xs w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="YouTube video URL..."
                            value={topic.videoUrl}
                            onChange={(e) => updateTopic(subject.id, topic.id, { videoUrl: e.target.value })}
                            className="text-xs h-8"
                          />
                          {topic.videoUrl && (
                            <a href={topic.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                              <ExternalLink className="h-3 w-3" /> Watch Video
                            </a>
                          )}
                          <Textarea
                            placeholder="Notes..."
                            value={topic.notes}
                            onChange={(e) => updateTopic(subject.id, topic.id, { notes: e.target.value })}
                            className="text-xs min-h-[60px]"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {!subjects.length && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No subjects yet. Add your first subject above!
          </div>
        )}
      </div>
    </div>
  );
}
