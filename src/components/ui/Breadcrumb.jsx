import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/teacher-management': { label: 'Teacher Management', icon: 'Users' },
    '/class-subject-configuration': { label: 'Class & Subject Configuration', icon: 'BookOpen' },
    '/visual-rule-builder': { label: 'Visual Rule Builder', icon: 'Settings' },
    '/timetable-generator': { label: 'Timetable Generator', icon: 'Zap' },
    '/export-reports': { label: 'Export & Reports', icon: 'Download' }
  };

  const generateBreadcrumbs = () => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard', icon: 'Home' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const route = routeMap[currentPath];
      if (route) {
        breadcrumbs.push({
          label: route.label,
          path: currentPath,
          icon: route.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const isCurrentPage = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    if (path && !isCurrentPage(path)) {
      navigate(path);
    }
  };

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isCurrent = isCurrentPage(item.path);
        
        return (
          <div key={item.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="mx-2 text-border" 
              />
            )}
            
            {isLast || isCurrent ? (
              <div className="flex items-center space-x-2">
                {item.icon && (
                  <Icon 
                    name={item.icon} 
                    size={16} 
                    className="text-foreground" 
                  />
                )}
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.path)}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center space-x-2">
                  {item.icon && (
                    <Icon 
                      name={item.icon} 
                      size={16} 
                    />
                  )}
                  <span>{item.label}</span>
                </div>
              </Button>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;