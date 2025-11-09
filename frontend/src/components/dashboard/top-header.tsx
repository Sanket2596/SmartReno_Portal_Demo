"use client";

import * as React from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Search,
  Briefcase,
} from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import type { Transition } from "framer-motion";

import { NotificationsModal } from "@/components/dashboard/notifications-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  href?: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "projects", label: "Projects", icon: Briefcase, href: "/projects" },
  { id: "bids", label: "Bids", icon: FileText, href: "/bids" },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
];

const navHighlightTransition: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
};

const navAccent: Record<string, string> = {
  dashboard: "text-sky-500 dark:text-sky-300",
  projects: "text-emerald-500 dark:text-emerald-300",
  bids: "text-amber-500 dark:text-amber-300",
  calendar: "text-violet-500 dark:text-violet-300",
};

const navHighlightBackground: Record<string, string> = {
  dashboard: "bg-sky-500/15 dark:bg-sky-500/20",
  projects: "bg-emerald-500/15 dark:bg-emerald-500/20",
  bids: "bg-amber-500/15 dark:bg-amber-500/25",
  calendar: "bg-violet-500/15 dark:bg-violet-500/20",
};

const navGlowRing: Record<string, string> = {
  dashboard: "shadow-[0_10px_30px_-12px_rgba(14,165,233,0.65)]",
  projects: "shadow-[0_10px_30px_-12px_rgba(16,185,129,0.6)]",
  bids: "shadow-[0_10px_30px_-12px_rgba(245,158,11,0.6)]",
  calendar: "shadow-[0_10px_30px_-12px_rgba(139,92,246,0.6)]",
};

export function TopHeader() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [activeNav, setActiveNav] = React.useState("dashboard");
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const userInitials = React.useMemo(() => {
    if (!user) {
      return "SR";
    }

    if (user.firstName || user.lastName) {
      return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` || "SR";
    }

    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }

    return "SR";
  }, [user]);

  React.useEffect(() => {
    const matchedNav = navItems.find((item) => {
      if (!item.href) {
        return false;
      }

      if (item.href === "/") {
        return pathname === item.href;
      }

      return pathname.startsWith(item.href);
    });

    if (matchedNav) {
      setActiveNav(matchedNav.id);
    } else {
      setActiveNav("dashboard");
    }
  }, [pathname]);

  const handleNavClick = React.useCallback(
    (item: NavItem) => {
      if (item.href) {
        router.push(item.href);
      }
      setActiveNav(item.id);
    },
    [router],
  );

  const openNotifications = React.useCallback(() => {
    setNotificationsOpen(true);
  }, []);

  const closeNotifications = React.useCallback(() => {
    setNotificationsOpen(false);
  }, []);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="sticky top-0 z-30 w-full backdrop-blur">
      <div className="mx-auto flex min-h-[84px] w-full max-w-[1400px] items-center justify-between gap-6 rounded-3xl border border-border/60 bg-background/80 px-6 py-4 shadow-lg shadow-background/30 dark:border-border/40 dark:bg-background/70">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            <span className="-mb-[2px] inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px] shadow-primary/20" />
            SmartReno
          </div>

          <LayoutGroup>
            <nav className="relative flex items-center rounded-full border border-border/60 bg-muted/40 p-1 text-sm font-medium uppercase tracking-wide text-muted-foreground dark:bg-muted/30">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;

                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all",
                      isActive
                        ? navAccent[item.id] ?? "text-primary dark:text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <motion.span
                      className="relative flex h-5 w-5 items-center justify-center"
                      animate={{ scale: isActive ? 1.05 : 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </motion.span>
                    <span>{item.label}</span>
                    {isActive ? (
                      <>
                        <motion.span
                          layoutId="nav-highlight"
                          transition={navHighlightTransition}
                          className={cn(
                            "absolute inset-0 -z-1 rounded-full border border-border/70 backdrop-blur-sm",
                            navHighlightBackground[item.id] ?? "bg-primary/10",
                          )}
                        />
                        <motion.span
                          layoutId="nav-glow"
                          transition={navHighlightTransition}
                          className={cn(
                            "pointer-events-none absolute inset-0 -z-2 rounded-full blur-lg",
                            navGlowRing[item.id] ?? "shadow-[0_10px_30px_-12px_rgba(59,130,246,0.6)]",
                          )}
                        />
                      </>
                    ) : null}
                  </Button>
                );
              })}
            </nav>
          </LayoutGroup>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-sm text-muted-foreground transition-all focus-within:border-primary focus-within:bg-background focus-within:text-foreground md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search SmartReno..."
              className="h-auto border-none bg-transparent px-0 text-sm focus-visible:ring-0"
            />
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground md:inline-flex"
            >
              /
            </motion.span>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-full border border-border/50"
                  onClick={() => router.push("/messages")}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-primary">
                    <span className="absolute inset-0 rounded-full bg-primary/60 animate-ping" />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>Messages</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-full border border-border/50"
                  onClick={openNotifications}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-amber-500">
                    <span className="absolute inset-0 rounded-full bg-amber-500/60 animate-ping" />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>Notifications</TooltipContent>
            </Tooltip>

            <ThemeToggle />

            <Separator orientation="vertical" className="mx-1 h-8" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-full border border-border/50 px-2 py-1"
                >
                  <Avatar className="h-9 w-9 border border-border/70">
                    <AvatarImage
                      src={user?.imageUrl ?? undefined}
                      alt={user?.fullName ?? user?.username ?? "User"}
                    />
                    <AvatarFallback>
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden min-w-[120px] flex-col items-start text-left text-xs font-medium leading-tight md:flex">
                    <span className="text-foreground">
                      {user?.fullName ?? user?.username ?? "Account"}
                    </span>
                    <span className="text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress ?? "Team member"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <SignOutButton signOutOptions={{ redirectUrl: "/sign-in" }} redirectUrl="/sign-in">
                  <DropdownMenuItem className="text-destructive">
                    Sign out
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      </div>
      <NotificationsModal open={notificationsOpen} onCloseAction={closeNotifications} />
    </TooltipProvider>
  );
}

