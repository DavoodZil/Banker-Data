

import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  PieChart,
  Wallet,
  Settings,
  Bell, // Add Bell icon
  KeyRound // Add KeyRound icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator, // Import separator
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/auth/LogoutButton";

const menuItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
  },
  {
    title: "Accounts",
    url: createPageUrl("Accounts"),
  },
  {
    title: "Transactions",
    url: createPageUrl("Transactions"),
  },
  {
    title: "Categories",
    url: createPageUrl("Categories"),
  },
  {
    title: "Tag",
    url: createPageUrl("Tag"),
  },
  {
    title: "Entity",
    url: createPageUrl("Entity"),
  },
  {
    title: "Group",
    url: createPageUrl("Group"),
  },
  {
    title: "Rules",
    url: createPageUrl("Rules"),
  },
  {
    title: "Merchants",
    url: createPageUrl("Merchants"),
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
  },
  {
    title: "Goals",
    url: createPageUrl("Goals"),
  },
  {
    title: "Cash Flow",
    url: createPageUrl("CashFlow"),
  },
  {
    title: "Budget",
    url: createPageUrl("Budget"),
  },
];

interface LayoutProps {
  children: ReactNode;
  currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation();

  return (
    <>
      <style>{`
        :root {
          --primary-navy: #1e293b;
          --primary-emerald: #10b981;
          --accent-teal: #0d9488;
          --surface-light: #f8fafc;
          --surface-card: #ffffff;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --border-subtle: #e2e8f0;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, var(--surface-light) 0%, #f1f5f9 100%);
        }
        
        .card-shadow {
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        }
        
        .card-shadow-lg {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        
        .transition-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <div className="min-h-screen flex flex-col w-full gradient-bg">
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              <nav className="hidden md:flex h-full items-center gap-1 overflow-x-auto">
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`h-full flex items-center px-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
                      ${
                        location.pathname === item.url
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                      }`
                    }
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* <div className="flex items-center gap-3">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
                        <Settings className="h-5 w-5" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem>
                       <Link to={createPageUrl("Preferences")} className="flex items-center w-full">
                         <Settings className="w-4 h-4 mr-2" />
                         Preferences
                       </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                       <Link to={createPageUrl("API")} className="flex items-center w-full">
                         <KeyRound className="w-4 h-4 mr-2" />
                         API & Integrations
                       </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                       <Link to={createPageUrl("Notifications")} className="flex items-center w-full">
                         <Bell className="w-4 h-4 mr-2" />
                         Notifications
                       </Link>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>
                       <LogoutButton />
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
                 <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                   U
                 </div>
              </div> */}
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}

