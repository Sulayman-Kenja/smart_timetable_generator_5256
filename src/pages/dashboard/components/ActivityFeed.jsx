import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities = [], maxItems = 5 }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      'teacher_added': 'UserPlus',
      'class_created': 'BookOpen',
      'rule_updated': 'Settings',
      'timetable_generated': 'Zap',
      'export_completed': 'Download',
      'system_update': 'RefreshCw',
      'error': 'AlertTriangle',
      'warning': 'AlertCircle'
    };
    return iconMap[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'teacher_added': 'text-success',
      'class_created': 'text-primary',
      'rule_updated': 'text-accent',
      'timetable_generated': 'text-success',
      'export_completed': 'text-warning',
      'system_update': 'text-primary',
      'error': 'text-error',
      'warning': 'text-warning'
    };
    return colorMap[type] || 'text-muted-foreground';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity, index) => (
        <div key={activity.id || index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150">
          <div className={`flex-shrink-0 p-2 rounded-full bg-background ${getActivityColor(activity.type)}`}>
            <Icon name={getActivityIcon(activity.type)} size={16} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{activity.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(activity.timestamp)}
              </span>
              {activity.user && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                </>
              )}
            </div>
          </div>

          {activity.status && (
            <div className={`
              flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium
              ${activity.status === 'completed' ? 'bg-success/10 text-success' : ''}
              ${activity.status === 'pending' ? 'bg-warning/10 text-warning' : ''}
              ${activity.status === 'failed' ? 'bg-error/10 text-error' : ''}
            `}>
              {activity.status}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;