import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ExportCard from './components/ExportCard';
import TemplateSelector from './components/TemplateSelector';
import BatchExportManager from './components/BatchExportManager';
import DownloadHistory from './components/DownloadHistory';
import ExportFilters from './components/ExportFilters';

const ExportReports = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [exportFilters, setExportFilters] = useState(null);

  const workflowSteps = [
    { id: 'setup', label: 'Setup', description: 'Configure teachers and classes' },
    { id: 'rules', label: 'Rules', description: 'Define scheduling constraints' },
    { id: 'generate', label: 'Generate', description: 'Create timetables' },
    { id: 'export', label: 'Export', description: 'Download documents' }
  ];

  const quickActions = [
    {
      id: 'quick-class-export',
      label: 'Quick Class Export',
      description: 'Export all class timetables',
      icon: 'Calendar',
      color: 'primary',
      category: 'execute'
    },
    {
      id: 'teacher-schedules',
      label: 'Teacher Schedules',
      description: 'Generate individual teacher timetables',
      icon: 'Users',
      color: 'success',
      category: 'execute'
    },
    {
      id: 'workload-report',
      label: 'Workload Report',
      description: 'Analyze teacher hour distribution',
      icon: 'BarChart3',
      color: 'accent',
      category: 'analysis'
    },
    {
      id: 'system-backup',
      label: 'System Backup',
      description: 'Export complete configuration',
      icon: 'Database',
      color: 'warning',
      category: 'data'
    }
  ];

  const timetableExports = [
    {
      title: 'Class Timetables',
      description: 'Complete schedules for all grades and sections',
      icon: 'Calendar',
      formats: [
        { value: 'pdf', label: 'PDF Document' },
        { value: 'docx', label: 'Word Document' },
        { value: 'xlsx', label: 'Excel Spreadsheet' }
      ],
      previewImage: 'class-timetable-preview.jpg',
      category: 'timetable',
      customOptions: [
        {
          key: 'includeBreaks',
          type: 'checkbox',
          label: 'Include Break Times',
          description: 'Show lunch and break periods in schedule'
        },
        {
          key: 'groupByGrade',
          type: 'checkbox',
          label: 'Group by Grade',
          description: 'Organize classes by grade level'
        },
        {
          key: 'pageLayout',
          type: 'select',
          label: 'Page Layout',
          options: [
            { value: 'portrait', label: 'Portrait' },
            { value: 'landscape', label: 'Landscape' }
          ]
        }
      ]
    },
    {
      title: 'Teacher Schedules',
      description: 'Individual timetables for all faculty members',
      icon: 'Users',
      formats: [
        { value: 'pdf', label: 'PDF Document' },
        { value: 'docx', label: 'Word Document' }
      ],
      previewImage: 'teacher-schedule-preview.jpg',
      category: 'timetable',
      customOptions: [
        {
          key: 'includePhotos',
          type: 'checkbox',
          label: 'Include Teacher Photos',
          description: 'Add profile pictures to schedules'
        },
        {
          key: 'showWorkload',
          type: 'checkbox',
          label: 'Show Weekly Workload',
          description: 'Display total teaching hours'
        }
      ]
    },
    {
      title: 'Room Assignments',
      description: 'Classroom and lab utilization schedules',
      icon: 'MapPin',
      formats: [
        { value: 'pdf', label: 'PDF Document' },
        { value: 'xlsx', label: 'Excel Spreadsheet' }
      ],
      previewImage: 'room-assignment-preview.jpg',
      category: 'timetable',
      customOptions: [
        {
          key: 'includeCapacity',
          type: 'checkbox',
          label: 'Include Room Capacity',
          description: 'Show maximum occupancy for each room'
        },
        {
          key: 'highlightConflicts',
          type: 'checkbox',
          label: 'Highlight Conflicts',
          description: 'Mark overlapping room assignments'
        }
      ]
    }
  ];

  const reportExports = [
    {
      title: 'Teacher Workload Analysis',
      description: 'Detailed breakdown of teaching hours and distribution',
      icon: 'BarChart3',
      formats: [
        { value: 'pdf', label: 'PDF Report' },
        { value: 'xlsx', label: 'Excel Analysis' }
      ],
      previewImage: 'workload-analysis-preview.jpg',
      category: 'report',
      customOptions: [
        {
          key: 'includeCharts',
          type: 'checkbox',
          label: 'Include Charts',
          description: 'Add visual graphs and charts'
        },
        {
          key: 'compareTargets',
          type: 'checkbox',
          label: 'Compare with Targets',
          description: 'Show variance from target hours'
        }
      ]
    },
    {
      title: 'Subject Distribution Report',
      description: 'Analysis of subject allocation across grades',
      icon: 'PieChart',
      formats: [
        { value: 'pdf', label: 'PDF Report' },
        { value: 'xlsx', label: 'Excel Analysis' }
      ],
      previewImage: 'subject-distribution-preview.jpg',
      category: 'report',
      customOptions: [
        {
          key: 'includePercentages',
          type: 'checkbox',
          label: 'Include Percentages',
          description: 'Show percentage distribution'
        }
      ]
    },
    {
      title: 'Constraint Compliance Report',
      description: 'Verification of all scheduling rules and constraints',
      icon: 'CheckCircle',
      formats: [
        { value: 'pdf', label: 'PDF Report' }
      ],
      previewImage: 'compliance-report-preview.jpg',
      category: 'report',
      customOptions: [
        {
          key: 'detailedViolations',
          type: 'checkbox',
          label: 'Detailed Violations',
          description: 'Show specific constraint violations'
        }
      ]
    }
  ];

  const dataExports = [
    {
      title: 'System Configuration Backup',
      description: 'Complete JSON export of all settings and data',
      icon: 'Database',
      formats: [
        { value: 'json', label: 'JSON File' },
        { value: 'zip', label: 'ZIP Archive' }
      ],
      previewImage: 'config-backup-preview.jpg',
      category: 'data',
      customOptions: [
        {
          key: 'includeHistory',
          type: 'checkbox',
          label: 'Include History',
          description: 'Export historical data and changes'
        },
        {
          key: 'compressData',
          type: 'checkbox',
          label: 'Compress Data',
          description: 'Reduce file size with compression'
        }
      ]
    },
    {
      title: 'CSV Data Export',
      description: 'Raw data in spreadsheet format for analysis',
      icon: 'Sheet',
      formats: [
        { value: 'csv', label: 'CSV Files' },
        { value: 'xlsx', label: 'Excel Workbook' }
      ],
      previewImage: 'csv-export-preview.jpg',
      category: 'data',
      customOptions: [
        {
          key: 'separateFiles',
          type: 'checkbox',
          label: 'Separate Files',
          description: 'Create individual files for each data type'
        }
      ]
    }
  ];

  const tabs = [
    { id: 'documents', label: 'Timetable Documents', icon: 'Calendar', count: timetableExports.length },
    { id: 'reports', label: 'Administrative Reports', icon: 'BarChart3', count: reportExports.length },
    { id: 'data', label: 'Data Exports', icon: 'Database', count: dataExports.length },
    { id: 'batch', label: 'Batch Export', icon: 'Package', count: null },
    { id: 'history', label: 'Download History', icon: 'History', count: null }
  ];

  const handleExport = async (exportData) => {
    console.log('Exporting:', exportData);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, downloadUrl: '#' };
  };

  const handleBatchExport = (batchData) => {
    console.log('Batch export:', batchData);
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    if (action.path) {
      navigate(action.path);
    }
  };

  const handleFiltersChange = (filters) => {
    setExportFilters(filters);
    console.log('Filters changed:', filters);
  };

  const handleFiltersReset = () => {
    setExportFilters(null);
    console.log('Filters reset');
  };

  const getCurrentExports = () => {
    switch (activeTab) {
      case 'documents': return timetableExports;
      case 'reports': return reportExports;
      case 'data': return dataExports;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Export & Reports</h1>
              <p className="text-muted-foreground mt-2">
                Generate and download timetables, reports, and data exports
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
              >
                Export Settings
              </Button>
              <Button
                variant="default"
                iconName="Download"
                iconPosition="left"
              >
                Quick Export
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <ProgressIndicator
              steps={workflowSteps}
              currentStep={3}
              size="default"
              showLabels={true}
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <QuickActionMenu
              actions={quickActions}
              variant="grid"
              onActionClick={handleQuickAction}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Export Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Template Selector */}
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />

              {/* Export Tabs */}
              <div className="bg-card rounded-lg border border-border">
                {/* Tab Navigation */}
                <div className="border-b border-border">
                  <nav className="flex space-x-8 px-6" aria-label="Export tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors
                          ${activeTab === tab.id
                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                          }
                        `}
                      >
                        <Icon name={tab.icon} size={16} />
                        <span>{tab.label}</span>
                        {tab.count !== null && (
                          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {(activeTab === 'documents' || activeTab === 'reports' || activeTab === 'data') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {getCurrentExports().map((exportItem, index) => (
                        <ExportCard
                          key={index}
                          {...exportItem}
                          onExport={handleExport}
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === 'batch' && (
                    <BatchExportManager onBatchExport={handleBatchExport} />
                  )}

                  {activeTab === 'history' && (
                    <DownloadHistory />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className="xl:col-span-1">
              <ExportFilters
                onFiltersChange={handleFiltersChange}
                onReset={handleFiltersReset}
              />
            </div>
          </div>

          {/* Export Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documents Generated</p>
                  <p className="text-2xl font-bold text-foreground">247</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
                  <Icon name="Download" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold text-foreground">1,432</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
                  <Icon name="HardDrive" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold text-foreground">2.4 GB</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
                  <Icon name="Clock" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Export</p>
                  <p className="text-2xl font-bold text-foreground">2h ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExportReports;