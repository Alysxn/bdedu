import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Exercises from "./pages/Exercises";
import ExerciseDetail from "./pages/ExerciseDetail";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import Achievements from "./pages/Achievements";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/materiais" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
            <Route path="/materiais/:id" element={<ProtectedRoute><MaterialDetail /></ProtectedRoute>} />
            <Route path="/aulas" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
            <Route path="/aulas/:id" element={<ProtectedRoute><ClassDetail /></ProtectedRoute>} />
            <Route path="/exercicios" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
            <Route path="/exercicios/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
            <Route path="/desafios" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
            <Route path="/desafios/:id" element={<ProtectedRoute><ChallengeDetail /></ProtectedRoute>} />
            <Route path="/conquistas" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            <Route path="/loja" element={<ProtectedRoute><Store /></ProtectedRoute>} />
            <Route path="/meuperfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
