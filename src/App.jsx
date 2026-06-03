import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

import Dashboard from "@/pages/Dashboard";
import MainLayout from "@/components/layout/MainLayout";

import SignUp from "@/pages/auth/SignUpPage";
import SignIn from "@/pages/auth/SignInPage";
import ForgotPassword from "@/pages/auth/ForgotPasswordPage";
import ResetPassword from "@/pages/auth/ResetPasswordPage";

import Studio from "@/pages/studio/Studio";
import Package from "@/pages/studio/Package";
import Session from "@/pages/studio/Session";
import Booking from "@/pages/booking/Booking";

import RegistrationCounter from "@/pages/check-in-out/RegistrationCounter";
import StudioCounter from "@/pages/check-in-out/StudioCounter";
import LiveQueueBoard from "@/pages/queue/LiveQueueBoard";

import ShipmentManagement from "@/pages/shipment/ShipmentManagement";
import FrameShipmentManagement from "@/pages/shipment/FrameShipmentManagement";
import EasyParcelConnect from "@/pages/shipment/EasyParcelConnect";

import Staff from "@/pages/users/Staff";
import Graduate from "@/pages/users/Graduate";
import Admin from "@/pages/users/Admin";

import GraduateHome from "@/pages/graduates/GraduateHome";
import GraduateBooking from "@/pages/graduates/Booking";
import PaymentResult from "@/pages/graduates/PaymentResult";
import BookingDetails from "@/pages/graduates/BookingDetails";
import MyOrders from "@/pages/graduates/MyOrders";

import FrameShop from "@/pages/frames/FrameShop";
import GraduateFrameOrderDetail from "@/pages/frames/GraduateFrameOrderDetail";
import FrameOrderPaymentResult from "@/pages/frames/FrameOrderPaymentResult";
import FrameManagement from "@/pages/frames/FrameManagement";
import FrameOrdersList from "@/pages/frames/FrameOrdersList";
import AdminFrameOrderDetail from "@/pages/frames/AdminFrameOrderDetail";

import ProfilePage from "@/pages/profile/ProfilePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import AdminTasks from "@/pages/tasks/AdminTasks";
import MyTasks from "@/pages/tasks/MyTasks";
import Reports from "@/pages/reports/Reports";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* All Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Accessible by all authenticated roles */}
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<ProtectedRoute allowedRoles={["graduate"]} />}>
              <Route path="/" element={<GraduateHome />} />
              <Route path="/book" element={<GraduateBooking />} />
              <Route path="/booking/result" element={<PaymentResult />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/my-bookings" element={<Navigate to="/my-orders?tab=bookings" replace />} />
              <Route path="/my-bookings/:id" element={<BookingDetails />} />
              <Route path="/frames" element={<FrameShop />} />
              <Route path="/my-frame-orders" element={<Navigate to="/my-orders?tab=frame-orders" replace />} />
              <Route path="/my-frame-orders/:id" element={<GraduateFrameOrderDetail />} />
              <Route path="/frame-order/result" element={<FrameOrderPaymentResult />} />
            </Route>

            {/* Pages accessible by superadmin, admin, staff */}
            <Route element={<ProtectedRoute allowedRoles={["superadmin", "admin", "staff"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/package" element={<Package />} />
              <Route path="/session" element={<Session />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/registration-counter" element={<RegistrationCounter />} />
              <Route path="/studio-counter" element={<StudioCounter />} />
              <Route path="/live-queue" element={<LiveQueueBoard />} />
              <Route path="/shipment" element={<ShipmentManagement />} />
              <Route path="/shipment/frames" element={<FrameShipmentManagement />} />
              <Route path="/graduate" element={<Graduate />} />
              <Route path="/tasks/my" element={<MyTasks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/frame-management" element={<FrameManagement />} />
              <Route path="/frame-orders" element={<FrameOrdersList />} />
              <Route path="/frame-orders/:id" element={<AdminFrameOrderDetail />} />
            </Route>

            {/* Admin task management + settings + reports */}
            <Route element={<ProtectedRoute allowedRoles={["superadmin", "admin"]} />}>
              <Route path="/tasks" element={<AdminTasks />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/settings" element={<SettingsPage />} />             
            </Route>

            {/* Only superadmin */}
            <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;