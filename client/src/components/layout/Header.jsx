import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  UserCircle,
  LayoutDashboard,
  ListOrdered,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/FirebaseAuthContext";
import { useToast } from "@/components/ui/use-toast";

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/store', label: 'Store' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const activeLinkStyle = {
    color: '#373086',
    fontWeight: '600',
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <img src="/logo.png" alt="SR Medical System Logo" className="h-10 w-10 object-contain" />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-[#373086]">SR Medical System</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {window.self !== window.top && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(window.location.href, '_blank')}
                className="hidden sm:flex items-center gap-2 border-[#373086] text-[#373086] hover:bg-[#373086] hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
            )}
            <ThemeToggle />

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#373086] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="hidden md:inline text-sm font-medium">
                      {user.name || user.username || user.displayName || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name || user.username || user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(user.role === "admin" ? "/admin-dashboard" : "/profile")}>
                    {user.role === "admin" ? <LayoutDashboard className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                    {user.role === "admin" ? "Admin Dashboard" : "Edit Profile"}
                  </DropdownMenuItem>
                  {user.role !== "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      <ListOrdered className="mr-2 h-4 w-4" /> My Orders
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button>
                  <User className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-background border-t border-border"
        >
          <nav className="flex flex-col items-center gap-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-primary"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="flex flex-col items-center gap-4 mt-4 w-full px-4">
              <Link to="/cart" className="w-full">
                <Button variant="ghost" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> View Cart
                </Button>
              </Link>

              {!user ? (
                <Link to="/login" className="w-full">
                  <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" /> Login
                  </Button>
                </Link>
              ) : (
                <>
                  <div className="w-full px-4 py-2 text-center border-b">
                    <p className="text-sm font-medium">{user.name || user.username || user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button className="w-full" onClick={() => { navigate(user.role === "admin" ? "/admin-dashboard" : "/profile"); setIsMenuOpen(false); }}>
                    {user.role === "admin" ? <LayoutDashboard className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                    {user.role === "admin" ? "Admin Dashboard" : "Edit Profile"}
                  </Button>
                  {user.role !== "admin" && (
                    <Button className="w-full" onClick={() => { navigate("/orders"); setIsMenuOpen(false); }}>
                      <ListOrdered className="mr-2 h-4 w-4" /> My Orders
                    </Button>
                  )}
                  <Button className="w-full" variant="destructive" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
