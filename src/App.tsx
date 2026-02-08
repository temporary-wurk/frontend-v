import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAsteroidFeed } from "@/hooks/useAsteroids";
import Index from "./pages/Index";
import FeedPage from "./pages/FeedPage";
import WatchlistPage from "./pages/WatchlistPage";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  const { data } = useAsteroidFeed();
  const asteroids = data?.asteroids || [];

  return (
    <>
      <Navbar asteroidCount={asteroids.length} lastSynced={data?.last_synced || null} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
