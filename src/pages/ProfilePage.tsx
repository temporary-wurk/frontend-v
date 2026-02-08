// Profile page - user info & authentication
import { useState } from "react";
import { User, Shield, Mail, LogOut, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useCurrentUser, useLogin, useRegister, useLogout } from "@/hooks/useDatabaseHook";

export default function ProfilePage() {
  const { user, loading: authLoading } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", passwordConfirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }
        await loginMutation.mutateAsync({ email: formData.email, password: formData.password });
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.passwordConfirm) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        await registerMutation.mutateAsync({ 
          username: formData.name, 
          email: formData.email, 
          password: formData.password 
        });
      }
      setFormData({ name: "", email: "", password: "", passwordConfirm: "" });
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.response?.data?.message || (isLogin ? "Login failed" : "Registration failed") + ". Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // LOGGED IN VIEW
  if (user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-lg mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Your Profile</h1>

          <div className="glass rounded-2xl p-8 space-y-8 animate-fade-in">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <User size={40} className="text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground text-sm font-mono">{user.email}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Role</span>
                </div>
                <span className="text-sm font-mono text-foreground capitalize">{user.role || "Explorer"}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">User ID</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground/70 truncate max-w-[150px]">{user._id}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Email</span>
                </div>
                <span className="text-xs font-mono text-foreground truncate max-w-[180px]">{user.email}</span>
              </div>
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="w-full py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN / REGISTER VIEW
  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
          {isLogin ? "Welcome Back" : "Join the Watch"}
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          {isLogin ? "Login to access your watchlist and alerts" : "Create an account to track asteroids"}
        </p>

        <div className="glass rounded-2xl p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground ml-1">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || loginMutation.isPending || registerMutation.isPending}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {(loading || loginMutation.isPending || registerMutation.isPending) && <Loader2 size={16} className="animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
