import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import HallOfFameTournament from "./pages/HallOfFameTournament";
import HallOfFameCircuit from "./pages/HallOfFameCircuit";
import HallOfFamePlayer from "./pages/HallOfFamePlayer";
import CircuitDetails from "./pages/CircuitDetails";
import Tournaments from "./pages/Tournaments";
import Circuits from "./pages/Circuits";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import Showcase from "./pages/Showcase";
import TournamentDetails from "./pages/TournamentDetails";
import CreateTournament from "./pages/CreateTournament";
import CreateCircuit from "./pages/CreateCircuit";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/index" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/tournaments/:tournamentId" element={<TournamentDetails />} />
                <Route 
                  path="/tournaments/create" 
                  element={
                    <ProtectedRoute requiredRole="organizer">
                      <CreateTournament />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/tournaments/:tournamentId/hall-of-fame" element={<HallOfFameTournament />} />
                <Route path="/circuits" element={<Circuits />} />
                <Route 
                  path="/circuits/create" 
                  element={
                    <ProtectedRoute requiredRole="organizer">
                      <CreateCircuit />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/circuits/:circuitId" element={<CircuitDetails />} />
                <Route path="/circuits/:circuitId/hall-of-fame" element={<HallOfFameCircuit />} />
                <Route path="/games" element={<Games />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/players/:playerId/achievements" element={<HallOfFamePlayer />} />
                <Route path="/showcase" element={<Showcase />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
