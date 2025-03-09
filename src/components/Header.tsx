
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? 'py-2 glass card-shadow' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-xl">M</span>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -inset-1 rounded-full border border-blue-300 opacity-70"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl font-semibold tracking-tight"
          >
            MTG Companion
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/">Search</NavLink>
          <NavLink to="/decks">Decks</NavLink>
          <NavLink to="/rules">Rules</NavLink>
          <NavLink to="/saved">Saved</NavLink>
        </nav>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="py-1.5 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm transition-colors hover:bg-primary/90"
          >
            Login
          </motion.button>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="relative px-1 py-2 text-foreground/80 hover:text-foreground transition-colors"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform origin-left hover:scale-x-100" />
    </Link>
  );
};

export default Header;
