import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Candidates from "./pages/Candidates";


function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app">

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <main className="main-content">

        <Topbar
          setIsOpen={setIsOpen}
        />

        <Dashboard />

      </main>

      {isOpen && (
        <div
          className="overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        />

        {/* Candidates */}
        <Route
          path="/candidates"
          element={<Candidates />}
        />

        {/* Default */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;