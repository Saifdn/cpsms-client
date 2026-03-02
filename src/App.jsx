import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

import Dashboard from "@/pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";
import Staff from "@/pages/Staff";
import Graduate from "@/pages/Graduate";

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/graduate" element={<Graduate />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
