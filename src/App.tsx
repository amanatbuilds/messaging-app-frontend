import LoginPage from "./pages/Login";
import { Routes, Route, Navigate } from "react-router";
import SignupPage from "./pages/Signup";
import Faltu from "./components/Faltu";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "./contexts/AuthContext";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, token } = useContext(AuthContext);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ProtectedPages({ children }: { children: ReactNode }) {
  const { user, token } = useContext(AuthContext);

  if (user || token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Faltu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedPages>
              <LoginPage />
            </ProtectedPages>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedPages>
              <SignupPage />
            </ProtectedPages>
          }
        />
      </Routes>
    </>
  );
}

export default App;
