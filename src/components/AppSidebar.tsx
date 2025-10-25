import { NavLink, useLocation } from "react-router-dom";
import { User, BookOpen, GraduationCap, FileText, Trophy, ShoppingCart, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Meu perfil", url: "/meuperfil", icon: User },
  { title: "Materiais", url: "/materiais", icon: BookOpen },
  { title: "Aulas", url: "/aulas", icon: GraduationCap },
  { title: "Exercícios", url: "/exercicios", icon: FileText },
  { title: "Desafios", url: "/desafios", icon: Target },
  { title: "Conquistas", url: "/conquistas", icon: Trophy },
  { title: "Loja", url: "/loja", icon: ShoppingCart },
];

export const AppSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border min-h-screen">
      <nav className="py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);
          
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
