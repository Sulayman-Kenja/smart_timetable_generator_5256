import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const BatchExportManager = ({ onBatchExport }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [batchFormat, setBatchFormat] = useState('pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportQueue, setExportQueue] = useState([]);

  const exportableItems = [
    {
      id: 'all-class-timetables',
      category: 'timetable',
      title: 'All Class Timetables',
      description: 'Complete schedules for all grades and sections',
      estimatedSize: '2.4 MB',
      pageCount: 45
    },
    {
      id: 'all-teacher-schedules',
      category: 'timetable',
      title: 'All Teacher Schedules',
      description: 'Individual timetables for all faculty members',
      estimatedSize: '1.8 MB',
      pageCount: 32
    },
    {
      id: 'room-assignments',
      category: 'timetable',
      title: 'Room Assignment Charts',
      description: 'Classroom and lab utilization schedules',
      estimatedSize: '0.9 MB',
      pageCount: 12
    },
    {
      id: 'workload-analysis',
      category: 'report',
      title: 'Teacher Workload Analysis',
      description: 'Detailed breakdown of teaching hours and distribution',
      estimatedSize: '1.2 MB',
      pageCount: 18
    },
    {
      id: 'subject-distribution',
      category: 'report',
      title: 'Subject Distribution Report',
      description: 'Analysis of subject allocation across grades',
      estimatedSize: '0.7 MB',
      pageCount: 8
    },
    {
      id: 'constraint-compliance',
      category: 'report',
      title: 'Constraint Compliance Report',
      description: 'Verification of all scheduling rules and constraints',
      estimatedSize: '0.5 MB',
      pageCount: 6
    },
    {
      id: 'system-configuration',
      category: 'data',
      title: 'System Configuration Backup',
      description: 'Complete JSON export of all settings and data',
      estimatedSize: '0.3 MB',
      pageCount: 1
    },
    {
      id: 'csv-data-export',
      category: 'data',
      title: 'CSV Data Export',
      description: 'Raw data in spreadsheet format for analysis',
      estimatedSize: '0.8 MB',
      pageCount: 1
    }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'docx', label: 'Word Documents' },
    { value: 'xlsx', label: 'Excel Spreadsheets' },
    { value: 'mixed', label: 'Mixed Formats (Optimal)' }
  ];

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === exportableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(exportableItems.map(item => item.id));
    }
  };

  const handleBatchExport = async () => {
    if (selectedItems.length === 0) return;

    setIsProcessing(true);
    const selectedExports = exportableItems.filter(item => selectedItems.includes(item.id));
    
    // Create export queue
    const queue = selectedExports.map((item, index) => ({
      ...item,
      status: 'pending',
      progress: 0,
      order: index + 1
    }));
    
    setExportQueue(queue);

    // Simulate batch processing
    for (let i = 0; i < queue.length; i++) {
      setExportQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'processing' } : item
      ));

      // Simulate processing time
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportQueue(prev => prev.map((item, idx) => 
          idx === i ? { ...item, progress } : item
        ));
      }

      setExportQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'completed', progress: 100 } : item
      ));
    }

    setIsProcessing(false);
    if (onBatchExport) {
      onBatchExport({
        items: selectedExports,
        format: batchFormat,
        totalSize: selectedExports.reduce((sum, item) => sum + parseFloat(item.estimatedSize), 0)
      });
    }
  };

  const getTotalSize = () => {
    return exportableItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + parseFloat(item.estimatedSize), 0)
      .toFixed(1);
  };

  const getTotalPages = () => {
    return exportableItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.pageCount, 0);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'timetable': return 'Calendar';
      case 'report': return 'BarChart3';
      case 'data': return 'Database';
      default: return 'FileText';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'timetable': return 'text-primary';
      case 'report': return 'text-success';
      case 'data': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Batch Export Manager</h3>
          <p className="text-sm text-muted-foreground">Generate multiple documents simultaneously</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="CheckSquare"
            iconPosition="left"
            onClick={handleSelectAll}
          >
            {selectedItems.length === exportableItems.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <Select
          label="Batch Export Format"
          description="Choose format for all selected documents"
          options={formatOptions}
          value={batchFormat}
          onChange={setBatchFormat}
        />
      </div>

      {/* Export Items */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-foreground">Select Documents to Export</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {exportableItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onChange={() => handleItemToggle(item.id)}
              />
              <div className="flex items-center space-x-3 flex-1">
                <Icon 
                  name={getCategoryIcon(item.category)} 
                  size={20} 
                  className={getCategoryColor(item.category)} 
                />
                <div className="flex-1">
                  <h5 className="font-medium text-foreground text-sm">{item.title}</h5>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-foreground">{item.estimatedSize}</p>
                  <p className="text-xs text-muted-foreground">{item.pageCount} pages</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Summary */}
      {selectedItems.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Export Summary</h4>
              <p className="text-sm text-muted-foreground">
                {selectedItems.length} documents • {getTotalPages()} pages • {getTotalSize()} MB
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={20} className="text-primary" />
            </div>
          </div>
        </div>
      )}

      {/* Export Queue */}
      {exportQueue.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Export Progress</h4>
          <div className="space-y-2">
            {exportQueue.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                  <span className="text-xs font-medium text-primary">{item.order}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.status === 'completed' ? 'Complete' : 
                       item.status === 'processing' ? `${item.progress}%` : 'Pending'}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        item.status === 'completed' ? 'bg-success' : 'bg-primary'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                <Icon 
                  name={item.status === 'completed' ? 'CheckCircle' : 
                        item.status === 'processing' ? 'Loader2' : 'Clock'} 
                  size={16} 
                  className={`${
                    item.status === 'completed' ? 'text-success' : 
                    item.status === 'processing' ? 'text-primary animate-spin' : 'text-muted-foreground'
                  }`} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Button */}
      <Button
        variant="default"
        fullWidth
        loading={isProcessing}
        iconName="Download"
        iconPosition="left"
        onClick={handleBatchExport}
        disabled={selectedItems.length === 0}
      >
        {isProcessing ? 'Processing Exports...' : `Export ${selectedItems.length} Documents`}
      </Button>
    </div>
  );
};

export default BatchExportManager;