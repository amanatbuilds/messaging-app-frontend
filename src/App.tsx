import LoginPage from "./pages/Login";
import { Routes, Route } from "react-router";
import SignupPage from "./pages/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;
