import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const VersionControlPanel = ({ 
  hasChanges = false,
  onSave = () => {},
  onRevert = () => {},
  onExport = () => {},
  isSaving = false
}) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const exportFormatOptions = [
    { value: 'pdf', label: 'PDF Document', description: 'Portable document format' },
    { value: 'word', label: 'Word Document', description: 'Microsoft Word format' },
    { value: 'excel', label: 'Excel Spreadsheet', description: 'Microsoft Excel format' },
    { value: 'csv', label: 'CSV File', description: 'Comma-separated values' }
  ];

  const exportTypeOptions = [
    { value: 'class_view', label: 'Class Timetables', description: 'Individual class schedules' },
    { value: 'teacher_view', label: 'Teacher Schedules', description: 'Individual teacher timetables' },
    { value: 'master_schedule', label: 'Master Schedule', description: 'Complete institutional timetable' },
    { value: 'room_utilization', label: 'Room Utilization', description: 'Room-wise schedule overview' }
  ];

  const handleExport = (type) => {
    onExport({ format: exportFormat, type });
    setShowExportOptions(false);
  };

  const versionHistory = [
    {
      id: 'v1.0',
      timestamp: '2025-07-12 15:30:00',
      description: 'Initial generation with standard constraints',
      conflicts: 2,
      satisfaction: 94
    },
    {
      id: 'v1.1',
      timestamp: '2025-07-12 16:15:00',
      description: 'Manual adjustments for teacher preferences',
      conflicts: 1,
      satisfaction: 97
    },
    {
      id: 'v1.2',
      timestamp: '2025-07-12 17:45:00',
      description: 'Room optimization and conflict resolution',
      conflicts: 0,
      satisfaction: 99
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-lg">
            <Icon name="GitBranch" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Version Control</h3>
            <p className="text-sm text-muted-foreground">Manage changes and export options</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${hasChanges ? 'bg-warning' : 'bg-success'}`}></div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {hasChanges ? 'Unsaved Changes' : 'All Changes Saved'}
              </p>
              <p className="text-xs text-muted-foreground">
                {hasChanges ? 'You have pending modifications' : 'Last saved 2 minutes ago'}
              </p>
            </div>
          </div>
          
          {hasChanges && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRevert}
                iconName="RotateCcw"
              >
                Revert
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={onSave}
                loading={isSaving}
                iconName="Save"
              >
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Export Options</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowExportOptions(!showExportOptions)}
              iconName={showExportOptions ? "ChevronUp" : "ChevronDown"}
            >
              {showExportOptions ? 'Hide' : 'Show'} Options
            </Button>
          </div>

          {showExportOptions && (
            <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
              <Select
                label="Export Format"
                options={exportFormatOptions}
                value={exportFormat}
                onChange={setExportFormat}
                className="mb-3"
              />

              <div className="grid grid-cols-1 gap-2">
                {exportTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(option.value)}
                    className="justify-start h-auto p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="Download" size={16} />
                      <div className="text-left">
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Export Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('class_view')}
            iconName="FileText"
          >
            Export Classes
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('teacher_view')}
            iconName="Users"
          >
            Export Teachers
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('master_schedule')}
            iconName="Calendar"
          >
            Master Schedule
          </Button>
        </div>

        {/* Version History */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Version History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {versionHistory.map((version, index) => (
              <div 
                key={version.id}
                className={`p-3 rounded-lg border ${
                  index === 0 ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{version.id}</span>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(version.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">{version.description}</p>
                
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <Icon name="AlertTriangle" size={12} className="text-warning" />
                    <span>{version.conflicts} conflicts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={12} className="text-success" />
                    <span>{version.satisfaction}% satisfaction</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionControlPanel;