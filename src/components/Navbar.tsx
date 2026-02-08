// Sticky top navbar with nav links, mobile hamburger, and login button
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Orbit, Radio, Menu, X, User, LogIn, LogOut } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/useDatabaseHook";

interface NavbarProps {
  asteroidCount: number;
  lastSynced: string | null;
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/feed", label: "Feed" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
];

export function Navbar({ asteroidCount, lastSynced }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useCurrentUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileOpen(false);
  };

  return (
    <header className="w-full border-b border-border/50 glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <Orbit className="text-primary" size={24} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-safe rounded-full animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Cosmic Watch</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest hidden sm:block">
              Asteroid Tracker
            </p>
          </div>
        </Link>

        {/* Center: Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Status + Login */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Radio size={12} className="text-safe animate-pulse-glow" />
            <span className="font-mono">{asteroidCount} tracked</span>
          </div>

          {!loading && (
            user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-all"
                >
                  <User size={14} />
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-all"
              >
                <LogIn size={14} />
                Login
              </Link>
            )
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 animate-fade-in bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-border/50 my-2" />
            
            {!loading && (
              user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all flex items-center gap-2"
                  >
                    <User size={16} /> Profile ({user.name})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-all flex items-center gap-2 justify-center"
                >
                  <LogIn size={16} /> Login / Register
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

