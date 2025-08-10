import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusCard from './components/StatusCard';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import SystemOverview from './components/SystemOverview';
import AlertsPanel from './components/AlertsPanel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [systemData, setSystemData] = useState({});
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Mock data initialization
  useEffect(() => {
    // System overview data
    setSystemData({
      totalTeachers: 45,
      totalClasses: 28,
      activeRules: 12,
      generationProgress: 85,
      lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      systemStatus: 'operational'
    });

    // Recent activities
    setActivities([
      {
        id: 1,
        type: 'teacher_added',
        title: 'New Teacher Added',
        description: 'Sarah Johnson has been added to Mathematics department',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        user: 'Admin User',
        status: 'completed'
      },
      {
        id: 2,
        type: 'timetable_generated',
        title: 'Timetable Generated',
        description: 'Weekly schedule generated for Grade 10-A with 98% efficiency',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        user: 'System',
        status: 'completed'
      },
      {
        id: 3,
        type: 'rule_updated',
        title: 'Constraint Rule Modified',
        description: 'Maximum daily teaching hours updated from 6 to 7',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        user: 'Admin User',
        status: 'completed'
      },
      {
        id: 4,
        type: 'class_created',
        title: 'New Class Configuration',
        description: 'Grade 11-C created with Science stream subjects',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        user: 'Admin User',
        status: 'completed'
      },
      {
        id: 5,
        type: 'export_completed',
        title: 'Schedule Export',
        description: 'Teacher timetables exported to Word documents',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        user: 'Admin User',
        status: 'completed'
      }
    ]);

    // System alerts
    setAlerts([
      {
        id: 1,
        type: 'warning',
        title: 'Teacher Workload Imbalance',
        message: 'John Smith has 32 hours assigned while recommended maximum is 30 hours',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        actionable: true,
        action: {
          label: 'Adjust',
          onClick: () => navigate('/teacher-management')
        }
      },
      {
        id: 2,
        type: 'info',
        title: 'Constraint Optimization Available',
        message: 'New rule suggestions available to improve schedule efficiency',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actionable: true,
        action: {
          label: 'Review',
          onClick: () => navigate('/visual-rule-builder')
        }
      }
    ]);
  }, [navigate]);

  const statusCards = [
    {
      title: 'Total Teachers',
      value: systemData.totalTeachers || 0,
      subtitle: '3 new this month',
      icon: 'Users',
      status: 'success',
      trend: { direction: 'up', value: '+6.7%', label: 'vs last month' },
      onClick: () => navigate('/teacher-management')
    },
    {
      title: 'Active Classes',
      value: systemData.totalClasses || 0,
      subtitle: 'Across 5 grades',
      icon: 'BookOpen',
      status: 'info',
      trend: { direction: 'up', value: '+2', label: 'new classes' },
      onClick: () => navigate('/class-subject-configuration')
    },
    {
      title: 'Scheduling Rules',
      value: systemData.activeRules || 0,
      subtitle: 'Constraints active',
      icon: 'Settings',
      status: 'default',
      action: {
        icon: 'Plus',
        label: 'Add',
        onClick: () => navigate('/visual-rule-builder')
      },
      onClick: () => navigate('/visual-rule-builder')
    },
    {
      title: 'Generation Status',
      value: `${systemData.generationProgress || 0}%`,
      subtitle: 'Schedule completion',
      icon: 'Zap',
      status: systemData.generationProgress >= 80 ? 'success' : 'warning',
      action: {
        icon: 'Play',
        label: 'Generate',
        onClick: () => navigate('/timetable-generator')
      },
      onClick: () => navigate('/timetable-generator')
    }
  ];

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleViewAllAlerts = () => {
    // In a real app, this would navigate to a dedicated alerts page
    console.log('View all alerts');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's your timetable management overview.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>

          <Breadcrumb />

          {/* Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statusCards.map((card, index) => (
              <StatusCard
                key={index}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                icon={card.icon}
                status={card.status}
                trend={card.trend}
                action={card.action}
                onClick={card.onClick}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - System Overview */}
            <div className="xl:col-span-1 space-y-6">
              <SystemOverview systemData={systemData} />
              
              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <QuickActions variant="list" />
              </div>
            </div>

            {/* Middle Column - Activity Feed */}
            <div className="xl:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                  <span className="text-xs text-muted-foreground">Last 24 hours</span>
                </div>
                <ActivityFeed activities={activities} maxItems={6} />
              </div>
            </div>

            {/* Right Column - Alerts */}
            <div className="xl:col-span-1">
              <AlertsPanel 
                alerts={alerts}
                onDismiss={handleDismissAlert}
                onViewAll={handleViewAllAlerts}
              />
            </div>
          </div>

          {/* Bottom Section - Additional Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Common Tasks</h3>
              <p className="text-sm text-muted-foreground">Frequently used actions</p>
            </div>
            <QuickActions variant="grid" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;