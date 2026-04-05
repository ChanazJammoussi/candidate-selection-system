"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  GraduationCap,
  LayoutDashboard,
  User,
  FileText,
  Award,
  Users,
  Settings,
  LogOut,
  FolderOpen,
  Search,
  ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
  children?: { href: string; label: string }[]
}

interface SidebarProps {
  role: "candidat" | "admin"
  concourId?: string
}

export function Sidebar({ role, concourId }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    )
  }

  const base = concourId ? `/candidat/${concourId}` : "/candidat"

  const candidatNavItems: NavItem[] = [
    { href: base, label: "Accueil", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: `${base}/profil`, label: "Profil", icon: <User className="h-5 w-5" /> },
    {
      href: `${base}/candidature`,
      label: "Candidature",
      icon: <FileText className="h-5 w-5" />,
      badge: 1,
      children: [
        { href: `${base}/candidature`, label: "Ma candidature" },
        { href: `${base}/suivi`, label: "Suivi" },
      ],
    },
    {
      href: `${base}/resultats`,
      label: "Resultats",
      icon: <Award className="h-5 w-5" />,
      children: [
        { href: `${base}/classement`, label: "Classement" },
        { href: `${base}/resultats`, label: "Mes resultats" },
      ],
    },
    { href: `${base}/parametres`, label: "Parametres", icon: <Settings className="h-5 w-5" /> },
  ]

  const adminNavItems: NavItem[] = [
    { href: "/admin", label: "Accueil", icon: <LayoutDashboard className="h-5 w-5" /> },
    {
      href: "/admin/candidats",
      label: "Candidats",
      icon: <Users className="h-5 w-5" />,
      badge: 12,
      children: [
        { href: "/admin/candidats", label: "Liste candidats" },
        { href: "/admin/documents", label: "Documents" },
      ],
    },
    {
      href: "/admin/concours",
      label: "Concours",
      icon: <FolderOpen className="h-5 w-5" />,
      badge: 3,
      children: [
        { href: "/admin/concours", label: "Gestion concours" },
        { href: "/admin/classement", label: "Classement" },
        { href: "/admin/resultats", label: "Resultats" },
      ],
    },
    { href: "/admin/parametres", label: "Parametres", icon: <Settings className="h-5 w-5" /> },
  ]

  const navItems = role === "candidat" ? candidatNavItems : adminNavItems
  const logoutHref = role === "candidat" ? "/candidat/login" : "/admin/login"

  return (
    <aside className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-sidebar-foreground">SGCI</span>
          <span className="text-xs text-sidebar-muted">Gestion Concours</span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-muted" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 bg-sidebar border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-muted h-10"
          />
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.children && item.children.some((child) => pathname === child.href))
          const isExpanded = expandedItems.includes(item.label)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <span className="text-sidebar-foreground">{item.icon}</span>
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-medium rounded-full bg-sidebar-border text-sidebar-foreground">
                      {item.badge}
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-sidebar-muted transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <span className="text-sidebar-foreground">{item.icon}</span>
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-medium rounded-full bg-sidebar-border text-sidebar-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}

              {hasChildren && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children?.map((child) => {
                    const isChildActive = pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          isChildActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          href={logoutHref}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Deconnexion</span>
        </Link>
      </div>
    </aside>
  )
}