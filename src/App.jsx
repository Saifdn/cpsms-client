import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

import Dashboard from "@/pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";

import SignUp from "@/pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";

import Studio from "@/pages/studio/Studio"
import Package from "@/pages/studio/Package"
import Session from "@/pages/studio/Session"

import RegistrationCounter from "@/pages/RegistrationCounter"
import StudioCounter from "@/pages/StudioCounter"

import QueueTest from "@/pages/QueueTest";

import Staff from "@/pages/Staff";
import Graduate from "@/pages/Graduate";
import Admin from "@/pages/Admin";

import { ProtectedRoute } from "./routes/ProtectedRoute"

const App = () => {
  return (
    <ThemeProvider>
      <Routes>

        {/* Public Routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/studio" element={<Studio />} />
            <Route path="/package" element={<Package />} />
            <Route path="/session" element={<Session />} />

            <Route path="/registration-counter" element={<RegistrationCounter />} />
            <Route path="/studio-counter" element={<StudioCounter />} />

            <Route path="/live-queue" element={<QueueTest />} />

            <Route path="/staff" element={<Staff />} />
            <Route path="/graduate" element={<Graduate />} />
            <Route path="/admin" element={<Admin />} />

          </Route>
        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App;
