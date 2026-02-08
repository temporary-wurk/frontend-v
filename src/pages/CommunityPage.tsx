// Community page – placeholder for discussion threads
import { MessageSquare, Users } from "lucide-react";

const threads = [
  { title: "Apophis 2029 approach – should we worry?", replies: 24, category: "Discussion" },
  { title: "Best tools for amateur asteroid tracking", replies: 12, category: "Resources" },
  { title: "What would happen if 1990 MU hit Earth?", replies: 38, category: "Science" },
  { title: "New NEO discovered this week – 2024 FG3", replies: 7, category: "News" },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Users size={28} className="text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Discuss asteroids, share discoveries, and learn from fellow space enthusiasts.
        </p>

        <div className="space-y-3">
          {threads.map((thread) => (
            <div key={thread.title} className="glass rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-start gap-3">
                <MessageSquare size={18} className="text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{thread.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{thread.category}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{thread.replies} replies</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">Community features coming soon. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
}
