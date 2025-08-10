import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StatusCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  status = 'default',
  trend = null,
  action = null,
  onClick = null
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'error':
        return 'border-error/20 bg-error/5';
      case 'info':
        return 'border-primary/20 bg-primary/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === 'up') return 'TrendingUp';
    if (trend.direction === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.direction === 'up') return 'text-success';
    if (trend.direction === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className={`
      relative p-6 rounded-lg border transition-all duration-200 hover:shadow-elevation-2
      ${getStatusStyles()}
      ${onClick ? 'cursor-pointer hover:scale-105' : ''}
    `}
    onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg bg-background/50 ${getIconColor()}`}>
              <Icon name={icon} size={20} />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {trend && (
            <div className={`flex items-center space-x-1 mt-3 ${getTrendColor()}`}>
              <Icon name={getTrendIcon()} size={14} />
              <span className="text-xs font-medium">{trend.value}</span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>

        {action && (
          <Button
            variant="ghost"
            size="sm"
            iconName={action.icon}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StatusCard;