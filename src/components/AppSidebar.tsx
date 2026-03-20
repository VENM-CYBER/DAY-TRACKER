import {
  LayoutDashboard, BookOpen, Dumbbell, UtensilsCrossed,
  ListTodo, Bot, BarChart3, Settings, Moon, Sun, ChevronLeft, ChevronRight
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/hooks/use-theme";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Study", url: "/study", icon: BookOpen },
  { title: "Gym", url: "/gym", icon: Dumbbell },
  { title: "Food", url: "/food", icon: UtensilsCrossed },
  { title: "Tasks", url: "/tasks", icon: ListTodo },
  { title: "AI Advisor", url: "/ai", icon: Bot },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { dark, toggle } = useTheme();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        <div className={`px-4 pb-4 ${collapsed ? "text-center" : ""}`}>
          <div className="gradient-hero rounded-lg px-3 py-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary-foreground shrink-0" />
            {!collapsed && (
              <span className="font-bold text-sm text-primary-foreground tracking-tight">
                StudentLife AI
              </span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        <button
          onClick={toggle}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
