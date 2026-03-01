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
} from "@/components/ui/sidebar";
import Avatar from "react-avatar";
import { Button } from "@/components/ui/button";

import { useSidebar } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { Logo } from "@/assets/Logo";
import { APP_SIDEBAR } from "/constants-index";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";
import { PanelLeftOpen } from "lucide-react";

export const AppSidebar = () => {
  const { isMobile } = useSidebar();

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem 
            className="px-0.5 max-lg:p-2"
          > 
            <Logo variant={isMobile ? "default" : "icon"} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_SIDEBAR.primaryNav.map((item) => (
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

        {/* Secondary Navigation */}
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

      {/* Sidebar Footer */}
      <SidebarFooter className={cn(isMobile && "border-t")}>
        <SidebarMenu>
          <SidebarMenuItem className={cn(isMobile && "p-2")}>
            {isMobile ? (
              <div className="flex items-center justify-between gap-3">
                {/* Left side */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={APP_SIDEBAR.curProfile.src}
                    size="36px"
                    round="8px"
                  />

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">
                      {APP_SIDEBAR.curProfile.name}
                    </h3>

                    <p className="text-sm text-muted-foreground truncate">
                      {APP_SIDEBAR.curProfile.email}
                    </p>
                  </div>
                </div>

                {/* Right side */}
                <Button variant="ghost" size="icon-sm" aria-label="Logout">
                  <LogOutIcon />
                </Button>
              </div>
            ) : (
              <UserMenu></UserMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
