// components/layout/AppSidebar.jsx
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronRight, LogOutIcon, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import Avatar from "react-avatar";
import { Button } from "@/components/ui/button";

import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/useAuth";
import { LogoutAlertDialog } from "@/components/auth/SignOutDialog";
import { Logo } from "@/assets/Logo";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";
import { APP_SIDEBAR } from "/constants-index";

export const AppSidebar = () => {
  const { isMobile, toggleSidebar, open } = useSidebar();
  const { logout, user } = useAuth();
  const location = useLocation();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Filter menu items based on user role (including children)
  const filteredNav = useMemo(() => {
    if (!user?.role) return [];

    return APP_SIDEBAR.primaryNav
      .map((item) => {
        // Clone to avoid mutation
        const filteredItem = { ...item };

        // If item has children → filter children
        if (item.children && item.children.length > 0) {
          filteredItem.children = item.children.filter((child) => {
            if (!child.allowedRoles || child.allowedRoles.length === 0) return true;
            return child.allowedRoles.includes(user.role);
          });

          // Hide parent if all children are filtered out
          if (filteredItem.children.length === 0) {
            return null;
          }
        } 
        // If no children (leaf item) → check its own allowedRoles
        else if (item.allowedRoles && item.allowedRoles.length > 0) {
          if (!item.allowedRoles.includes(user.role)) {
            return null;
          }
        }

        return filteredItem;
      })
      .filter(Boolean);
  }, [user]);

  // Calculate open sections
  const sectionsToOpen = useMemo(() => {
    const result = {};

    filteredNav.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some(
          (child) =>
            location.pathname === child.url ||
            location.pathname.startsWith(child.url)
        );
        if (isActive) {
          result[item.title] = true;
        }
      }
    });

    return result;
  }, [filteredNav, location.pathname]);

  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    setOpenSections((prev) => ({
      ...prev,
      ...sectionsToOpen,
    }));
  }, [sectionsToOpen]);

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleLogout = async () => {
    await logout();
    setShowLogoutDialog(false);
  };

  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon">
        {/* Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem
              className={cn(
                "px-0.5 max-lg:p-2",
                "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
              )}
            >
              {isMobile ? (
                <Logo />
              ) : open ? (
                <div className="flex items-center justify-between w-full">
                  <Logo />
                  <Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
                    <PanelLeftClose />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar}>
                  <PanelLeftOpen className="h-5 w-5" />
                </Button>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNav.map((item) =>
                  item.children && item.children.length > 0 ? (
                    <Collapsible
                      key={item.title}
                      asChild
                      open={!!openSections[item.title]}
                      onOpenChange={() => toggleSection(item.title)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.Icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location.pathname === child.url}
                                >
                                  <a href={child.url}>
                                    <span>{child.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <a href={item.url}>
                          <item.Icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Mobile Secondary Nav */}
          {isMobile && (
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  {APP_SIDEBAR.secondaryNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton tooltip={item.title} asChild>
                        <a href={item.url}>
                          <item.Icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className={cn(isMobile && "border-t")}>
          <SidebarMenu>
            <SidebarMenuItem className={cn(isMobile && "p-2")}>
              {isMobile || open ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      name={user?.fullName || user?.email || "User"}
                      size="36px"
                      round="8px"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold">
                        {user?.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowLogoutDialog(true)}
                    variant="ghost"
                    size="icon-sm"
                  >
                    <LogOutIcon />
                  </Button>
                </div>
              ) : (
                <UserMenu />
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <LogoutAlertDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirmLogout={handleLogout}
      />
    </>
  );
};