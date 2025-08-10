import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionMenu = ({ 
  actions = [],
  variant = 'grid',
  size = 'default',
  onActionClick = () => {}
}) => {
  const defaultActions = [
    {
      id: 'add-teacher',
      label: 'Add Teacher',
      description: 'Create new teacher profile',
      icon: 'UserPlus',
      color: 'primary',
      path: '/teacher-management',
      category: 'setup'
    },
    {
      id: 'configure-class',
      label: 'Configure Class',
      description: 'Set up class and subjects',
      icon: 'BookOpen',
      color: 'secondary',
      path: '/class-subject-configuration',
      category: 'setup'
    },
    {
      id: 'create-rule',
      label: 'Create Rule',
      description: 'Build scheduling constraints',
      icon: 'Settings',
      color: 'accent',
      path: '/visual-rule-builder',
      category: 'config'
    },
    {
      id: 'generate-timetable',
      label: 'Generate Timetable',
      description: 'Create automated schedule',
      icon: 'Zap',
      color: 'success',
      path: '/timetable-generator',
      category: 'execute'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      description: 'Download reports and schedules',
      icon: 'Download',
      color: 'warning',
      path: '/export-reports',
      category: 'execute'
    },
    {
      id: 'view-analytics',
      label: 'View Analytics',
      description: 'System performance insights',
      icon: 'BarChart3',
      color: 'primary',
      path: '/dashboard',
      category: 'analysis'
    }
  ];

  const actionItems = actions.length > 0 ? actions : defaultActions;

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
      secondary: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20',
      accent: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
      success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
      error: 'bg-error/10 text-error border-error/20 hover:bg-error/20'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'p-3',
      default: 'p-4',
      lg: 'p-6'
    };
    return sizeMap[size] || sizeMap.default;
  };

  const handleActionClick = (action) => {
    onActionClick(action);
  };

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {actionItems.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="default"
            onClick={() => handleActionClick(action)}
            className={`
              w-full justify-start h-auto ${getSizeClasses()}
              border border-border rounded-lg
              ${getColorClasses(action.color)}
              transition-all duration-150 ease-smooth
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Icon name={action.icon} size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{action.label}</p>
                {action.description && (
                  <p className="text-xs opacity-70 mt-1">{action.description}</p>
                )}
              </div>
              <Icon name="ChevronRight" size={16} className="opacity-50" />
            </div>
          </Button>
        ))}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actionItems.map((action) => (
        <Button
          key={action.id}
          variant="ghost"
          size="default"
          onClick={() => handleActionClick(action)}
          className={`
            h-auto ${getSizeClasses()}
            border border-border rounded-lg
            ${getColorClasses(action.color)}
            transition-all duration-150 ease-smooth
            hover:scale-105 hover:shadow-elevation-2
          `}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-current/10">
              <Icon name={action.icon} size={24} />
            </div>
            <div>
              <p className="font-medium text-sm">{action.label}</p>
              {action.description && (
                <p className="text-xs opacity-70 mt-1">{action.description}</p>
              )}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActionMenu;