import React from 'react';
import { LayoutDashboard, Users, User, X } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: 'overview' | 'users' | 'details') => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'User Directory', icon: <Users size={20} /> },
  ] as const;

  const handleNavClick = (view: 'overview' | 'users') => {
    setView(view);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(false)} 
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">U</div>
          <span className="logo-text">Pulse Admin</span>
          <button 
            className="menu-toggle" 
            style={{ marginLeft: 'auto', display: 'flex', padding: 4 }}
            onClick={() => setIsOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          
          {currentView === 'details' && (
            <button className="sidebar-item active">
              <User size={20} />
              <span>User Profile</span>
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <p>© 2026 Pulse Systems</p>
          <p style={{ fontSize: '0.75rem', marginTop: 4 }}>V1.0.0 Stable</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
