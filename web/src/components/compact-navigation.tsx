import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router"
import { Home, Settings, User2, LogOut, Activity, Users, DollarSign, Calculator, UtensilsCrossed, MessageSquare, Moon, Sun, Menu, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { apiUrl } from "@/lib/api"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Ana Sayfa", url: "/", icon: Home },
  { title: "Danışanlar", url: "/clients", icon: Users, tourId: "sidebar-clients" },
  { title: "Finansal Kayıtlar", url: "/financial", icon: DollarSign, tourId: "sidebar-financial" },
  { title: "Hesaplayıcılar", url: "/calculator", icon: Calculator, tourId: "sidebar-calculator" },
  { title: "Besin Veritabanı", url: "/foods", icon: UtensilsCrossed, tourId: "sidebar-foods" },
  { title: "Aktivite Kayıtları", url: "/activity-logs", icon: Activity, tourId: "sidebar-activity" },
]

interface UserResponse {
  success: boolean
  message: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    [key: string]: unknown
  }
}

interface Subscription {
  plan_name: string
  plan_duration: string
  is_trial: boolean
  status: string
}

export function CompactNavigation() {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(apiUrl("api/auth/me"), {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json()
            setUser(data)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    const fetchSubscription = async () => {
      try {
        const response = await fetch(apiUrl("api/subscription/"), {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.subscription) {
            setSubscription(data.subscription)
          }
        }
      } catch (error) {
        console.error("Error fetching subscription:", error)
      }
    }

    fetchUser()
    fetchSubscription()
  }, [])

  // Mobilde sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const logout = async () => {
    try {
      await fetch(apiUrl("api/auth/logout"), {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      navigate("/sign-in")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const isActive = (url: string) => {
    if (url === "/") return location.pathname === "/"
    return location.pathname === url || location.pathname.startsWith(url + "/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const NavContent = () => (
    <div className="flex flex-col h-full p-4">
      {/* Logo & Title */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/logo.png" alt="DiyetKa" className="w-9 h-9 shrink-0" />
        <span className="text-lg font-semibold text-foreground">DiyetKa</span>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(item.url)
          return (
            <Link
              key={item.url}
              to={item.url}
              data-tour={item.tourId}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-accent",
                active 
                  ? "bg-accent text-primary font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", active && "text-primary")} />
              <span className="text-sm">{item.title}</span>
            </Link>
          )
        })}
      </div>

      {/* Spacer - pushes footer to bottom */}
      <div className="flex-1 min-h-8" />

      {/* Footer Actions */}
      <div className="flex flex-col gap-1 pt-4 mt-auto border-t border-border">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 shrink-0" />
          ) : (
            <Moon className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm">
            {theme === "dark" ? "Açık Tema" : "Koyu Tema"}
          </span>
        </button>

        {/* User Section */}
        {loading ? (
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1">
              <div className="h-3 bg-muted rounded animate-pulse mb-1 w-24" />
              <div className="h-2.5 bg-muted rounded animate-pulse w-32" />
            </div>
          </div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-accent text-left w-full"
                data-tour="user-menu"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {user.user?.first_name?.charAt(0)}{user.user?.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {user.user?.first_name} {user.user?.last_name}
                    </span>
                    {subscription && (
                      <Badge 
                        variant={subscription.is_trial ? "secondary" : subscription.plan_name === 'pro' ? "default" : "outline"}
                        className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                      >
                        {subscription.is_trial 
                          ? 'Deneme' 
                          : subscription.plan_name === 'pro' 
                            ? 'Pro' 
                            : subscription.plan_name === 'standard'
                              ? 'Standard'
                              : subscription.plan_name
                        }
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground truncate block">
                    {user.user?.email}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56 mb-2">
              <DropdownMenuItem asChild>
                <Link to="/settings/account" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Hesap Ayarları
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/feedback" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Öneri ve İstekler
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <User2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Giriş yapılmadı</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col h-screen w-64 bg-background shrink-0 border-r border-border">
        <NavContent />
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="DiyetKa" className="w-8 h-8 shrink-0" />
            <span className="text-base font-semibold text-foreground">DiyetKa</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-background border-r border-border transform transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </div>
    </>
  )
}
