import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";

import Dashboard from "@/pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";
import Staff from "@/pages/Staff";

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff" element={<Staff />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
