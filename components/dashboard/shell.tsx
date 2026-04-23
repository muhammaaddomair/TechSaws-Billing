"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  CreditCard,
  FileSpreadsheet,
  LayoutDashboard,
  Search,
  Settings,
  Users
} from "lucide-react";
import { TechSawsBrand } from "@/components/brand/logo";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { cn } from "@/lib/utils";

const tabs: Array<{ href: Route; label: string; icon: typeof Users; short: string }> = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, short: "OV" },
  { href: "/dashboard/clients", label: "Clients", icon: Users, short: "CL" },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard, short: "PY" },
  { href: "/dashboard/projects", label: "Projects", icon: BriefcaseBusiness, short: "PR" },
  { href: "/dashboard/finance", label: "Revenue & Finance", icon: ChartNoAxesColumn, short: "FI" },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileSpreadsheet, short: "IN" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, short: "SE" }
];

export function DashboardShell({
  user,
  children
}: {
  user: {
    email: string;
    name: string | null;
    permissions: string[];
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f3f0ea]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[248px_1fr]">
        <aside className="hidden bg-black px-5 py-6 lg:flex lg:flex-col lg:justify-between">
          <div className="flex flex-col gap-6">
            <TechSawsBrand inverse priority />
            <nav className="flex flex-col gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = tab.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(tab.href);

                return (
                  <Link
                    key={tab.href}
                    aria-label={tab.label}
                    className={cn(
                      "flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold text-white/70 transition",
                      active ? "bg-white text-black" : "bg-white/5 hover:bg-white/10"
                    )}
                    href={tab.href}
                    title={tab.label}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-semibold">
              {getInitials(user.name, user.email)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name ?? "TechSaws User"}</p>
              <p className="truncate text-xs text-white/60">{user.email}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-7">
          <header className="mb-6 rounded-[34px] bg-white px-5 py-4 shadow-[0_12px_50px_rgba(15,23,42,0.08)] sm:px-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4 lg:hidden">
                <TechSawsBrand logoSize={64} priority />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Control Room</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">TechSaws operations command center</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Track clients, projects, revenue, costs, invoices, and payments from one connected workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-500">Search clients, projects, invoices</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-black px-4 py-3 text-white">
                  <Bell className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-semibold">{user.name ?? "TechSaws User"}</p>
                    <p className="text-xs text-white/70">{user.email}</p>
                  </div>
                </div>
                <LogoutButton />
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string | null, email: string) {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }

  return email.slice(0, 2).toUpperCase();
}
