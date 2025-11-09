import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  MapPin,
  MessageCircleDashed,
  MoreVertical,
  Paperclip,
  Send,
} from "lucide-react";

import { TopHeader } from "@/components/dashboard/top-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Contact = {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  timestamp: string;
  unread?: boolean;
};

type Message = {
  id: string;
  sender: "you" | "contact" | string;
  content: string;
  timestamp: string;
  isAuthor?: boolean;
};

const messagingMock = {
  contact: {
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/96?img=47",
    status: "Available",
    statusColor: "bg-emerald-500",
  },
  contacts: [
    {
      id: "sarah-williams",
      name: "Sarah Williams",
      avatar: "https://i.pravatar.cc/96?img=47",
      preview: "Sounds good. I’ll review the updated estimate...",
      timestamp: "9:45 AM",
    },
    {
      id: "james-rodriguez",
      name: "James Rodriguez",
      avatar: "https://i.pravatar.cc/96?img=12",
      preview: "Perfect, thank you! When would you...",
      timestamp: "Yesterday",
      unread: true,
    },
    {
      id: "jane-smith",
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/96?img=5",
      preview: "Yes, that sounds good! Please include...",
      timestamp: "Yesterday",
    },
    {
      id: "darrell-brown",
      name: "Darrell Brown",
      avatar: "https://i.pravatar.cc/96?img=29",
      preview: "Hi! Thanks for reaching out through...",
      timestamp: "Tue",
    },
    {
      id: "michael-smith",
      name: "Michael Smith",
      avatar: "https://i.pravatar.cc/96?img=18",
      preview: "I will update the project documents...",
      timestamp: "Mon",
    },
    {
      id: "robert-jones",
      name: "Robert Jones",
      avatar: "https://i.pravatar.cc/96?img=36",
      preview: "Can we review the structural drawings...",
      timestamp: "Mon",
    },
  ] satisfies Contact[],
  conversation: [
    {
      id: "msg-1",
      sender: "contact",
      content:
        "Hi! Thanks for reaching out through SmartReno. I just reviewed your proposal for my kitchen remodel — it looks great!\n\nQuick question: does the estimate include backsplash installation and lighting upgrades?",
      timestamp: "Sarah · 9:18 AM",
    },
    {
      id: "msg-2",
      sender: "you",
      isAuthor: true,
      content:
        "Good morning, Sarah! 👋\n\nYes, the proposal includes backsplash installation (ceramic subway tiles as discussed) and replacing the existing ceiling lights with new recessed LED fixtures.\n\nIf you’d like, I can also quote under-cabinet lighting as an optional add-on — would you be interested?",
      timestamp: "You · 9:18 AM",
    },
    {
      id: "msg-3",
      sender: "contact",
      content:
        "Yes, that sounds good! Please include the under-cabinet lighting option. Also, will the project require me to move my appliances before the work starts?",
      timestamp: "Sarah · 9:20 AM",
    },
    {
      id: "msg-4",
      sender: "you",
      isAuthor: true,
      content:
        "We’ll handle appliance relocation for you 👍\n\nOn day one, our team will disconnect and move them safely, then reinstall everything once flooring and cabinets are complete.\n\nAlso, our estimator mentioned you’ll be home during the first two days — that’s perfect for walkthrough and approvals.",
      timestamp: "You · 9:25 AM",
    },
    {
      id: "msg-5",
      sender: "contact",
      content:
        "Perfect, thank you! When would you be able to start if I accept the bid this week?",
      timestamp: "Sarah · 9:30 AM",
    },
    {
      id: "msg-6",
      sender: "you",
      isAuthor: true,
      content: "We have an opening starting October 21st.",
      timestamp: "Alex · 9:35 AM",
    },
  ] satisfies Message[],
  project: {
    title: "Kitchen Remodel — Brownstone",
    location: "Brooklyn, NY",
    startDate: "Oct 21, 2025",
    budgetRange: "$19,000 – $24,000",
    services: ["Cabinetry", "Electrical", "Lighting", "Backsplash", "Appliance install"],
    attachments: [
      {
        id: "estimate",
        name: "Updated Estimate.pdf",
        size: "1.2 MB",
      },
      {
        id: "floor-plan",
        name: "Kitchen Floor Plan.png",
        size: "850 KB",
      },
    ] as const,
  },
};

export default async function MessagesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { contact, contacts, conversation, project } = messagingMock;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-background via-background/95 to-muted/50">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
      <TopHeader />
      <main className="mx-auto w-full max-w-[1400px] px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="flex h-full flex-col gap-6 rounded-[28px] border border-border/60 bg-background/85 p-6 shadow-sm backdrop-blur-sm dark:border-border/40 dark:bg-background/75">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-[0_12px_30px_-15px_rgba(37,99,235,0.6)]">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>SW</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">{contact.name}</h2>
                <Badge className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px] shadow-emerald-500/25" />
                  {contact.status}
                  <ChevronDown className="h-3 w-3" />
                </Badge>
              </div>
            </div>

            <div className="relative">
              <Input
                placeholder="Search chat"
                className="h-11 rounded-full border border-border/60 bg-background/70 pl-12 text-sm shadow-none focus-visible:border-primary focus-visible:ring-primary/30"
                aria-label="Search chat"
              />
              <MessageCircleDashed className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Recent Chats
                <MoreVertical className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-2">
                {contacts.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    className="group flex items-center gap-3 rounded-2xl border border-transparent bg-muted/40 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-background/70"
                  >
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>
                        {chat.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {chat.name}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {chat.timestamp}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{chat.preview}</p>
                    </div>
                    {chat.unread ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex h-full flex-col rounded-[28px] border border-border/60 bg-background/85 p-6 shadow-sm backdrop-blur-sm dark:border-border/40 dark:bg-background/75">
            <header className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Conversation with {contact.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kitchen Remodel · Proposal discussion
                </p>
              </div>
              <Button type="button" variant="outline" className="rounded-full border-border/60">
                Export Transcript
              </Button>
            </header>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
              {conversation.map((message) => {
                const isAuthor = message.isAuthor ?? message.sender === "you";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isAuthor ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-3xl border px-5 py-4 text-sm leading-relaxed shadow-sm ${
                        isAuthor
                          ? "border-primary/20 bg-primary/10 text-foreground"
                          : "border-border/50 bg-background/90 text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      <span className="mt-3 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="mt-6 flex flex-col gap-3 border-t border-border/40 pt-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2 shadow-sm focus-within:border-primary">
                <Input
                  placeholder="Type your message..."
                  className="h-10 border-none bg-transparent px-0 text-sm focus-visible:ring-0"
                />
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button type="button" className="h-12 rounded-full px-6 font-semibold sm:w-auto">
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </footer>
          </section>

          <aside className="flex h-full flex-col gap-5 rounded-[28px] border border-border/60 bg-background/85 p-6 shadow-sm backdrop-blur-sm dark:border-border/40 dark:bg-background/75">
            <div className="space-y-3 border-b border-border/40 pb-4">
              <h4 className="text-lg font-semibold text-foreground">Project</h4>
              <p className="text-sm text-muted-foreground">
                Track milestones, schedule, and documentation for this conversation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                <h5 className="text-sm font-semibold text-foreground">{project.title}</h5>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Start {project.startDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircleDashed className="h-4 w-4 text-primary" />
                    Budget {project.budgetRange}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Services
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.services.map((service) => (
                    <Badge
                      key={service}
                      variant="secondary"
                      className="rounded-full border border-border/50 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Attachments
                </p>
                <div className="mt-2 space-y-2">
                  {project.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/80 px-3 py-2 text-sm text-foreground"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{file.name}</p>
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}


