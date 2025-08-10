import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = ({ alerts = [], onDismiss = () => {}, onViewAll = () => {} }) => {
  const getAlertIcon = (type) => {
    const iconMap = {
      'error': 'XCircle',
      'warning': 'AlertTriangle',
      'info': 'Info',
      'success': 'CheckCircle'
    };
    return iconMap[type] || 'AlertCircle';
  };

  const getAlertStyles = (type) => {
    const styleMap = {
      'error': 'border-error/20 bg-error/5 text-error',
      'warning': 'border-warning/20 bg-warning/5 text-warning',
      'info': 'border-primary/20 bg-primary/5 text-primary',
      'success': 'border-success/20 bg-success/5 text-success'
    };
    return styleMap[type] || 'border-border bg-muted/50 text-muted-foreground';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const displayAlerts = alerts.slice(0, 3);

  if (alerts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
        </div>
        <div className="text-center py-8">
          <Icon name="Shield" size={48} className="text-success mx-auto mb-4" />
          <p className="text-muted-foreground">All systems operational</p>
          <p className="text-xs text-muted-foreground mt-1">No alerts or warnings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
        {alerts.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-muted-foreground hover:text-foreground"
          >
            View All ({alerts.length})
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {displayAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              p-4 rounded-lg border transition-all duration-150
              ${getAlertStyles(alert.type)}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <Icon name={getAlertIcon(alert.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                  {alert.actionable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert.action?.onClick()}
                      className="text-xs h-6 px-2"
                    >
                      {alert.action?.label || 'Fix'}
                    </Button>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDismiss(alert.id)}
                className="flex-shrink-0 w-6 h-6 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={12} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;