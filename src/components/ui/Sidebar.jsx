import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'System overview and quick access',
      badge: null
    },
    {
      label: 'Teachers',
      path: '/teacher-management',
      icon: 'Users',
      tooltip: 'Manage teacher profiles and assignments',
      badge: 'setup'
    },
    {
      label: 'Classes',
      path: '/class-subject-configuration',
      icon: 'BookOpen',
      tooltip: 'Grade hierarchy and subject configuration',
      badge: 'setup'
    },
    {
      label: 'Rules',
      path: '/visual-rule-builder',
      icon: 'Settings',
      tooltip: 'Visual constraint builder for scheduling',
      badge: 'config'
    },
    {
      label: 'Generate',
      path: '/timetable-generator',
      icon: 'Zap',
      tooltip: 'Automated timetable creation',
      badge: 'execute'
    },
    {
      label: 'Export',
      path: '/export-reports',
      icon: 'Download',
      tooltip: 'Document generation and reports',
      badge: 'execute'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const getCompletionStatus = (badge) => {
    // Mock completion status - in real app, this would come from context/state
    const completionMap = {
      'setup': Math.random() > 0.5,
      'config': Math.random() > 0.3,
      'execute': Math.random() > 0.7
    };
    return completionMap[badge] || false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-200 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-300 lg:hidden"
      >
        <Icon name="Menu" size={20} />
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card border-r border-border z-200
        transition-all duration-300 ease-smooth
        ${isCollapsed ? 'w-16' : 'w-60'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="Calendar" size={20} color="white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-sm font-semibold text-foreground leading-none">
                    Smart Timetable
                  </h1>
                  <span className="text-xs text-muted-foreground leading-none">
                    Generator
                  </span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="hidden lg:flex text-muted-foreground hover:text-foreground"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              const completed = getCompletionStatus(item.badge);
              
              return (
                <div key={item.path} className="relative group">
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="default"
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full justify-start h-10 px-3
                      ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                      ${isCollapsed ? 'px-2' : ''}
                    `}
                  >
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      className={isCollapsed ? 'mx-auto' : 'mr-3'} 
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.label}
                        </span>
                        {item.badge && (
                          <div className="flex items-center space-x-1">
                            {completed && (
                              <div className="w-2 h-2 bg-success rounded-full" />
                            )}
                            <div className={`
                              w-2 h-2 rounded-full
                              ${item.badge === 'setup' ? 'bg-accent' : ''}
                              ${item.badge === 'config' ? 'bg-warning' : ''}
                              ${item.badge === 'execute' ? 'bg-primary' : ''}
                            `} />
                          </div>
                        )}
                      </>
                    )}
                  </Button>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="
                      absolute left-full top-1/2 -translate-y-1/2 ml-2
                      px-2 py-1 bg-popover text-popover-foreground text-xs rounded
                      opacity-0 group-hover:opacity-100 transition-opacity duration-150
                      pointer-events-none whitespace-nowrap z-300
                      shadow-elevation-2
                    ">
                      {item.tooltip}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span>Last sync: 2 min ago</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Database" size={14} />
                  <span>Status: Connected</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <Icon name="Database" size={16} className="text-success" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;