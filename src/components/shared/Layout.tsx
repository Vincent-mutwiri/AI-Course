import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useTheme } from "@/contexts/ThemeContext";

export default function Layout() {
  // Access theme context to ensure theme is available
  const theme = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background" data-site={theme.siteName}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}