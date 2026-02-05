import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ShoppingCart, User, LogOut, Settings, Package, LayoutDashboard, ShieldCheck, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();

  const DARK_HERO_PAGES = ['/', '/about', '/services', '/store', '/contact'];
  const HIDE_NAVBAR_PAGES = ['/login', '/register', '/forgot-password'];

  const isDarkHeroPage = DARK_HERO_PAGES.includes(location.pathname);
  const showDarkText = isScrolled || !isDarkHeroPage;


  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Store', href: '/store' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 10);
        timeoutId = null;
      }, 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (HIDE_NAVBAR_PAGES.includes(location.pathname)) {
    return null;
  }

  const activeLinkStyle = {
    color: '#373086',
    fontWeight: 600,
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled
        ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-gray-100 py-2"
        : "bg-transparent py-4"
    )}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo - Flex-1 wrapper to push nav to center */}
          <div className="flex-1 flex justify-start items-center">
            <Link to="/" className="flex items-center group">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                    "p-1.5 rounded-xl transition-all duration-500 flex items-center justify-center shadow-sm",
                    !showDarkText && "bg-white shadow-xl ring-1 ring-white/20"
                  )}
                >
                  <img
                    src="/logo.png"
                    alt="SR Medical System Logo"
                    className="h-8 w-8 object-contain"
                    fetchpriority="high"
                  />
                </motion.div>
                <span className={cn(
                  "text-xl md:text-2xl font-bold transition-colors duration-500 tracking-tight",
                  showDarkText ? "text-gray-800" : "text-white"
                )}>
                  SR Medical System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav - Mathematically Centered */}
          <div className="hidden lg:flex lg:items-center justify-center gap-8 xl:gap-10">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "text-sm font-semibold transition-all duration-300 relative py-1 px-1",
                  showDarkText
                    ? (isActive ? "text-[#373086]" : "text-gray-600 hover:text-[#373086]")
                    : (isActive ? "text-white" : "text-white/70 hover:text-white")
                )}
              >
                {({ isActive }) => (
                  <>
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className={cn(
                          "absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full shadow-sm",
                          showDarkText ? "bg-[#373086]" : "bg-white"
                        )}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Actions - Flex-1 wrapper to balance center */}
          <div className="flex-1 hidden md:flex items-center justify-end gap-3 lg:gap-6">
            <Link
              to="/cart"
              className={cn(
                "p-2.5 rounded-full transition-all duration-300 relative",
                showDarkText ? "text-gray-600 hover:text-[#373086] hover:bg-gray-100" : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {getItemCount() > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("flex items-center gap-2.5 px-3 py-2 transition-colors duration-500 rounded-xl", showDarkText ? "text-gray-800 hover:bg-gray-100" : "text-white hover:bg-white/10")}>
                    <User className="w-5 h-5" />
                    <span className="hidden xl:inline text-sm font-extrabold tracking-wide uppercase">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-58 mt-2 p-2 rounded-2xl shadow-2xl border-gray-100">
                  <DropdownMenuLabel className="text-[#373086] font-bold px-3 py-2">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5">
                    <Link to="/profile"><Settings className="mr-3 h-4 w-4" /> Profile Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5">
                    <Link to="/order-history"><Package className="mr-3 h-4 w-4" /> Order History</Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5">
                      <Link to="/admin"><LayoutDashboard className="mr-3 h-4 w-4" /> Administrative Control</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-red-600 cursor-pointer py-2.5 font-medium">
                    <LogOut className="mr-3 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className={cn(
                  "hidden xl:block font-bold text-sm tracking-wide transition-colors duration-300 px-4 py-2 hover:bg-white/10 rounded-xl",
                  showDarkText ? "text-gray-700 hover:text-[#373086]" : "text-white/80 hover:text-white"
                )}
              >
                Login
              </Link>
            )}

            <Link
              to="/quote"
              className={cn(
                "inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-xl",
                showDarkText
                  ? "bg-[#373086] text-white hover:bg-[#1e1b4b]"
                  : "bg-white text-[#373086] hover:bg-gray-100"
              )}
            >
              <FileText size={18} className="hidden xl:inline" />
              <span>Request Quote</span>
            </Link>
          </div>


          {/* Mobile Hamburger - Enhanced */}
          <div className="md:hidden flex items-center gap-1">
            <Link to="/cart" className={cn("relative p-2.5 transition-colors rounded-lg active:scale-95", showDarkText ? "text-gray-700 hover:text-[#373086] hover:bg-gray-100" : "text-white hover:bg-white/10")} aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-[#373086] text-white text-xs flex items-center justify-center font-semibold shadow-md border border-white/20">
                  {getItemCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn("p-2.5 rounded-lg active:scale-95 transition-all", showDarkText ? "hover:bg-gray-100" : "text-white hover:bg-white/10")}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu - Enhanced */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg border-t"
          >
            <div className="px-4 pt-4 pb-6 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-[#373086] hover:bg-gray-100 active:bg-gray-200 transition-all"
                  style={({ isActive }) => isActive ? { ...activeLinkStyle, backgroundColor: '#eef2ff' } : undefined}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="border-t pt-4 mt-4 space-y-1">
                {user ? (
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-[#373086] hover:bg-gray-100 active:bg-gray-200 transition-all"
                    >
                      <Settings className="mr-3 h-5 w-5" /> Profile
                    </NavLink>
                    <NavLink
                      to="/order-history"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-[#373086] hover:bg-gray-100 active:bg-gray-200 transition-all"
                    >
                      <Package className="mr-3 h-5 w-5" /> Orders
                    </NavLink>
                    {user.role === 'admin' && (
                      <NavLink
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-[#373086] hover:bg-gray-100 active:bg-gray-200 transition-all"
                      >
                        <LayoutDashboard className="mr-3 h-5 w-5" /> Admin Panel
                      </NavLink>
                    )}
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-[#373086] hover:bg-gray-100 active:bg-gray-200 transition-all"
                    >
                      <LogOut className="mr-3 h-5 w-5" /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="outline" className="w-full h-12 text-base">Login</Button>
                  </Link>
                )}
                <Link to="/quote" onClick={() => setIsOpen(false)} className="block pt-2">
                  <Button className="w-full bg-[#373086] text-white hover:bg-[#1e1b4b] h-12 text-base shadow-md">
                    <FileText className="mr-2 h-5 w-5" /> Request Quote
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
