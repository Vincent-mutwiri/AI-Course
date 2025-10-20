import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard, Home, User, LogOut, Bot } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const getNavLinks = (user: any) => {
  const links = [
    { to: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { to: "/courses", label: "Courses", icon: <BookOpen className="h-4 w-4" /> },
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/ai-assistant", label: "AI Assistant", icon: <Bot className="h-4 w-4" /> },
  ];
  
  // Show admin link for admin users or admin@example.com (temporary)
  const isAdmin = user?.role === "admin" || user?.email === "admin@example.com";
  if (isAdmin) {
    links.push({ to: "/admin", label: "Admin", icon: <LayoutDashboard className="h-4 w-4" /> });
  }
  
  return links;
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-lg">Benki ya maarifa</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {getNavLinks(user).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}