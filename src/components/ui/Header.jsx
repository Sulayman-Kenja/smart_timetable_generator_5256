import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Calendar" size={20} color="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground leading-none">
              Smart Timetable
            </h1>
            <span className="text-xs text-muted-foreground leading-none">
              Generator
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Quick Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Zap"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Generate
            </Button>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name={isDarkMode ? "Sun" : "Moon"} size={20} />
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">School Administrator</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground"
            >
              <Icon name="User" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;