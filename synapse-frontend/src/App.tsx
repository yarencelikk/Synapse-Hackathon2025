import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import ClassroomPage from "./pages/ClassroomPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";     // Gerçek sayfayı import et
import RegisterPage from "./pages/RegisterPage"; // Gerçek sayfayı import et
import { useAuthStore } from "./store/useAuthStore";

// Kullanıcının giriş yapıp yapmadığını kontrol eden özel bir bileşen
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    // Giriş yapmamışsa, giriş sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Asıl uygulama arayüzü artık ProtectedRoute ile korunuyor */}
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="classrooms/:classroomId" element={<ClassroomPage />} />
      </Route>
    </Routes>
  );
}

export default App;
