import React from 'react';
import Icon from '../../../components/AppIcon';

const GenerationStatistics = ({ 
  statistics = {},
  violations = [],
  isGenerating = false 
}) => {
  const defaultStats = {
    totalPeriods: 450,
    assignedPeriods: 432,
    unassignedPeriods: 18,
    constraintSatisfaction: 96,
    teacherUtilization: 87,
    roomUtilization: 92,
    generationTime: 3.2,
    iterations: 847,
    conflicts: 3
  };

  const stats = Object.keys(statistics).length > 0 ? statistics : defaultStats;

  const violationsByType = violations.reduce((acc, violation) => {
    acc[violation.type] = (acc[violation.type] || 0) + 1;
    return acc;
  }, {});

  const getStatusColor = (percentage) => {
    if (percentage >= 95) return 'text-success';
    if (percentage >= 85) return 'text-warning';
    return 'text-error';
  };

  const getStatusBg = (percentage) => {
    if (percentage >= 95) return 'bg-success/10';
    if (percentage >= 85) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const StatCard = ({ icon, label, value, unit = '', percentage = null, trend = null }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-success' : 'text-error'}`}>
            <Icon name={trend > 0 ? "TrendingUp" : "TrendingDown"} size={14} />
            <span className="text-xs">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        
        {percentage !== null && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Efficiency</span>
              <span className={getStatusColor(percentage)}>{percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  percentage >= 95 ? 'bg-success' : 
                  percentage >= 85 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isGenerating) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-lg font-semibold text-foreground">Generating Statistics...</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-muted/30 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-lg">
            <Icon name="BarChart3" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Generation Statistics</h3>
            <p className="text-sm text-muted-foreground">Performance metrics and optimization results</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Generated in {stats.generationTime}s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon="Calendar"
          label="Period Assignment"
          value={stats.assignedPeriods}
          unit={`/ ${stats.totalPeriods}`}
          percentage={Math.round((stats.assignedPeriods / stats.totalPeriods) * 100)}
          trend={2}
        />
        
        <StatCard
          icon="CheckCircle"
          label="Constraint Satisfaction"
          value={stats.constraintSatisfaction}
          unit="%"
          percentage={stats.constraintSatisfaction}
          trend={1}
        />
        
        <StatCard
          icon="Users"
          label="Teacher Utilization"
          value={stats.teacherUtilization}
          unit="%"
          percentage={stats.teacherUtilization}
          trend={-1}
        />
        
        <StatCard
          icon="Building"
          label="Room Utilization"
          value={stats.roomUtilization}
          unit="%"
          percentage={stats.roomUtilization}
          trend={3}
        />
        
        <StatCard
          icon="RotateCcw"
          label="Iterations"
          value={stats.iterations}
          unit={`/ ${stats.iterations + 153}`}
          percentage={Math.round((stats.iterations / (stats.iterations + 153)) * 100)}
        />
        
        <StatCard
          icon="AlertTriangle"
          label="Conflicts"
          value={stats.conflicts}
          unit="remaining"
          percentage={stats.conflicts === 0 ? 100 : Math.max(0, 100 - (stats.conflicts * 10))}
          trend={stats.conflicts === 0 ? 5 : -2}
        />
      </div>

      {/* Constraint Violations Breakdown */}
      {violations.length > 0 && (
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Constraint Violations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(violationsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-error/5 border border-error/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-foreground capitalize">{type.replace('_', ' ')}</span>
                </div>
                <span className="text-sm font-medium text-error">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="border-t border-border pt-6 mt-6">
        <h4 className="text-sm font-medium text-foreground mb-4">Performance Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.unassignedPeriods}</div>
            <div className="text-xs text-muted-foreground">Unassigned Periods</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{stats.generationTime}s</div>
            <div className="text-xs text-muted-foreground">Generation Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">45</div>
            <div className="text-xs text-muted-foreground">Teachers Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">120</div>
            <div className="text-xs text-muted-foreground">Classes Configured</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationStatistics;