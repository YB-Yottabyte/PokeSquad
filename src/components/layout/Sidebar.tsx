import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, Plus, Grid, ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/', name: 'Home', icon: <Home size={20} /> },
    { path: '/create', name: 'Create a Monkey', icon: <Plus size={20} /> },
    { path: '/gallery', name: 'Squad Gallery', icon: <Grid size={20} /> },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed z-50 top-4 left-4 lg:hidden p-2 rounded-full bg-slate-800 text-white shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-slate-800 text-white transition-all transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Monkey Squad</h2>
            <p className="text-slate-400 text-sm">Build your ultimate team</p>
          </div>

          <nav className="space-y-1 mb-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'}
                `}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto flex justify-center">
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="animate-float">
                <ScrollText size={36} className="text-yellow-400 mx-auto" />
              </div>
              <p className="text-center text-sm mt-2">Squad Manager</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;