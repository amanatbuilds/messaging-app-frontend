import LoginPage from "./pages/Login";
import { Routes, Route, Navigate } from "react-router";
import SignupPage from "./pages/Signup";
// import Faltu from "./components/Faltu";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Home from "./pages/Home";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, token } = useContext(AuthContext);

  if (!token && !user) {
    return <Navigate to="/login" replace />;
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
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;
