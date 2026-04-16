import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

import Dashboard from "@/pages/Dashboard";
import MainLayout from "@/components/layout/MainLayout";

import SignUp from "@/pages/auth/SignUpPage";
import SignIn from "@/pages/auth/SignInPage";
import ForgotPassword from "@/pages/auth/ForgotPasswordPage";
import ResetPassword from "@/pages/auth/ResetPasswordPage";

import Studio from "@/pages/studio/Studio"
import Package from "@/pages/studio/Package"
import Session from "@/pages/studio/Session"

import Booking from "@/pages/booking/Booking";

import RegistrationCounter from "@/pages/check-in-out/RegistrationCounter"
import StudioCounter from "@/pages/check-in-out/StudioCounter"

import QueueTest from "@/pages/QueueTest";

import Staff from "@/pages/users/Staff";
import Graduate from "@/pages/users/Graduate";
import Admin from "@/pages/users/Admin";

import { ProtectedRoute } from "./routes/ProtectedRoute"

const App = () => {
  return (
    <ThemeProvider>
      <Routes>

        {/* Public Routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/studio" element={<Studio />} />
            <Route path="/package" element={<Package />} />
            <Route path="/session" element={<Session />} />
            <Route path="/booking" element={<Booking />} />

            <Route path="/registration-counter" element={<RegistrationCounter />} />
            <Route path="/studio-counter" element={<StudioCounter />} />

            <Route path="/live-queue" element={<QueueTest />} />

            <Route path="/staff" element={<Staff />} />
            <Route path="/graduate" element={<Graduate />} />
            <Route path="/admin" element={<Admin />} />

          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<MainLayout />}>
            {/* <Route path="/admin" element={<Admin />} /> */}
          </Route>
        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App;
