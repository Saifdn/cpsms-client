import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";

const App = () => {
  return (
    <ThemeProvider>
      <SidebarProvider open={false}>
        <AppSidebar />

        <SidebarInset>
          <Header />

        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;
