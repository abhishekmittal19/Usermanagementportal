import React from 'react';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentView: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();

  const getViewTitle = () => {
    switch (currentView) {
      case 'overview':
        return 'Dashboard Overview';
      case 'users':
        return 'User Management Directory';
      case 'details':
        return 'User Detailed Profile';
      default:
        return 'Dashboard';
    }
    
  };


  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="menu-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="view-title">{getViewTitle()}</h1>
      </div>

      <div className="header-right">
        {/* Theme Toggle Button */}
        <button 
          className="icon-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
          style={{ transform: 'none' }}
        >
          {theme === 'dark' ? (
            <Sun size={18} style={{ transform: 'rotate(0deg)', transition: 'transform 0.5s ease' }} />
          ) : (
            <Moon size={18} style={{ transform: 'rotate(0deg)', transition: 'transform 0.5s ease' }} />
          )}
        </button>

        {/* Dummy Notification Bell */}
        <button className="icon-btn" title="View Notifications">
          <Bell size={18} />
        </button>

        {/* Mini Super Admin User Avatar Profile */}
        <div className="user-profile-summary">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256" 
            alt="Super Admin Profile Avatar" 
            className="user-avatar-mini" 
          />
          <div className="user-info-mini">
            <span className="user-name-mini">Elena Vance</span>
            <span className="user-role-mini">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
