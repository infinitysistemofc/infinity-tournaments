import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Trophy, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();

  const navItems = [
    { label: "Torneios", href: "#tournaments" },
    { label: "Circuitos", href: "#circuits" },
    { label: "Comunidade", href: "#community" },
    { label: "Sobre", href: "#about" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Sidebar Trigger */}
          <div className="flex items-center gap-3">
            <SidebarTrigger className="border-glow-blue" />
            <motion.a
              href="/"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="h-8 w-8 text-primary animate-glow-blue" />
              <span className="text-xl font-bold font-orbitron text-gradient-fire-blue">
                Infinity Tournaments
              </span>
            </motion.a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-rajdhani font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:text-gradient-blue"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  {user?.email}
                </Button>
                <Button variant="neon" size="sm" onClick={signOut}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-card"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-rajdhani font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user?.email}
                  </Button>
                  <Button variant="neon" size="sm" onClick={signOut}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="hero" size="sm" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Cadastrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};
