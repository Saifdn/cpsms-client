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
import { ChevronRight } from "lucide-react";
import Avatar from "react-avatar";
import { Button } from "@/components/ui/button";

import { useSidebar } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { Logo } from "@/assets/Logo";
import { APP_SIDEBAR } from "/constants-index";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

export const AppSidebar = () => {
  const { isMobile } = useSidebar();
  const { toggleSidebar, open } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem
            className={cn(
              "px-0.5 max-lg:p-2",
              "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center",
            )}
          >
            {isMobile ? (
              <Logo />
            ) : open ? (
              // Sidebar open → logo + close button (your existing layout)
              <div className="flex items-center justify-between w-full">
                <Logo />
                <Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
                  <PanelLeftClose />
                </Button>
              </div>
            ) : (
              // Sidebar collapsed → centered toggle button
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8" // make button square for perfect centering
                onClick={toggleSidebar}
              >
                <PanelLeftOpen className="h-5 w-5" />
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* {APP_SIDEBAR.primaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <a href={item.url}>
                      <item.Icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} */}
              {APP_SIDEBAR.primaryNav.map((item) =>
                item.children ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={false}
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
                              <SidebarMenuSubButton asChild>
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
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <a href={item.url}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
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
            {isMobile || open ? (
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
