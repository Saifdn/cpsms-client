import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

import Dashboard from "@/pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";

import RegistrationCounter from "@/pages/RegistrationCounter"
import StudioCounter from "@/pages/StudioCounter"


import Staff from "@/pages/Staff";
import Graduate from "@/pages/Graduate";
import Admin from "@/pages/Admin";

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/registration-counter" element={<RegistrationCounter />} />
          <Route path="/studio-counter" element={<StudioCounter />} />


          <Route path="/staff" element={<Staff />} />
          <Route path="/graduate" element={<Graduate />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
