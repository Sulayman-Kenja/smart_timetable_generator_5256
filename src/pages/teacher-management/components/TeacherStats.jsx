import React from 'react';
import Icon from '../../../components/AppIcon';

const TeacherStats = ({ teachers = [] }) => {
  const totalTeachers = teachers.length;
  
  const availableTeachers = teachers.filter(teacher => {
    const utilization = (teacher.currentHours / teacher.maxHours) * 100;
    return utilization < 80;
  }).length;

  const limitedTeachers = teachers.filter(teacher => {
    const utilization = (teacher.currentHours / teacher.maxHours) * 100;
    return utilization >= 80 && utilization < 100;
  }).length;

  const fullTeachers = teachers.filter(teacher => {
    const utilization = (teacher.currentHours / teacher.maxHours) * 100;
    return utilization >= 100;
  }).length;

  const totalMaxHours = teachers.reduce((sum, teacher) => sum + teacher.maxHours, 0);
  const totalCurrentHours = teachers.reduce((sum, teacher) => sum + teacher.currentHours, 0);
  const overallUtilization = totalMaxHours > 0 ? (totalCurrentHours / totalMaxHours) * 100 : 0;

  const allSubjects = [...new Set(teachers.flatMap(teacher => teacher.subjects))];
  const totalSubjects = allSubjects.length;

  const stats = [
    {
      label: 'Total Teachers',
      value: totalTeachers,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: null
    },
    {
      label: 'Available',
      value: availableTeachers,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: null
    },
    {
      label: 'Limited Availability',
      value: limitedTeachers,
      icon: 'AlertCircle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: null
    },
    {
      label: 'Full Capacity',
      value: fullTeachers,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: null
    },
    {
      label: 'Overall Utilization',
      value: `${Math.round(overallUtilization)}%`,
      icon: 'TrendingUp',
      color: overallUtilization >= 90 ? 'text-error' : overallUtilization >= 75 ? 'text-warning' : 'text-success',
      bgColor: overallUtilization >= 90 ? 'bg-error/10' : overallUtilization >= 75 ? 'bg-warning/10' : 'bg-success/10',
      change: null
    },
    {
      label: 'Subjects Covered',
      value: totalSubjects,
      icon: 'BookOpen',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              {stat.change && (
                <p className={`text-xs mt-1 ${stat.change.positive ? 'text-success' : 'text-error'}`}>
                  {stat.change.positive ? '+' : ''}{stat.change.value}% from last week
                </p>
              )}
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherStats;