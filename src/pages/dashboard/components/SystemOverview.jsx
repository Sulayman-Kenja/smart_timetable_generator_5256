import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemOverview = ({ systemData = {} }) => {
  const {
    totalTeachers = 0,
    totalClasses = 0,
    activeRules = 0,
    generationProgress = 0,
    lastGenerated = null,
    systemStatus = 'operational'
  } = systemData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const formatLastGenerated = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">System Overview</h3>
        <div className={`flex items-center space-x-2 ${getStatusColor(systemStatus)}`}>
          <Icon name={getStatusIcon(systemStatus)} size={16} />
          <span className="text-sm font-medium capitalize">{systemStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-full mx-auto mb-2">
            <Icon name="Users" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalTeachers}</p>
          <p className="text-xs text-muted-foreground">Teachers</p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 text-secondary rounded-full mx-auto mb-2">
            <Icon name="BookOpen" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalClasses}</p>
          <p className="text-xs text-muted-foreground">Classes</p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 text-accent rounded-full mx-auto mb-2">
            <Icon name="Settings" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{activeRules}</p>
          <p className="text-xs text-muted-foreground">Active Rules</p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-success/10 text-success rounded-full mx-auto mb-2">
            <Icon name="Zap" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{generationProgress}%</p>
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Generation Progress</span>
            <span className="text-sm text-muted-foreground">{generationProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(generationProgress)}`}
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last Generated:</span>
          <span className="font-medium text-foreground">{formatLastGenerated(lastGenerated)}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;