// Call-to-action section
import { Link } from "react-router-dom";
import { Bookmark, LogIn } from "lucide-react";

export function CTASection() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="glass rounded-2xl p-8 md:p-12 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Track Asteroids That Matter to You
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Create a watchlist, get alerts for close approaches, and stay informed about near-Earth objects.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <LogIn size={16} /> Login / Register
          </Link>
          <Link
            to="/watchlist"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-all"
          >
            <Bookmark size={16} /> Add to Watchlist
          </Link>
        </div>
      </div>
    </section>
  );
}
