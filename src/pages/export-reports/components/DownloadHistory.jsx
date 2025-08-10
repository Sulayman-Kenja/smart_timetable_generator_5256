import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DownloadHistory = () => {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const downloadHistory = [
    {
      id: 'exp-001',
      name: 'Grade 10 Class Timetables',
      type: 'timetable',
      format: 'PDF',
      size: '2.4 MB',
      generatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      downloadCount: 3,
      status: 'available',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days from now
    },
    {
      id: 'exp-002',
      name: 'Teacher Workload Analysis Report',
      type: 'report',
      format: 'Excel',
      size: '1.8 MB',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      downloadCount: 1,
      status: 'available',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6)
    },
    {
      id: 'exp-003',
      name: 'Complete System Backup',
      type: 'data',
      format: 'JSON',
      size: '0.5 MB',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      downloadCount: 0,
      status: 'available',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)
    },
    {
      id: 'exp-004',
      name: 'All Teacher Schedules',
      type: 'timetable',
      format: 'Word',
      size: '3.2 MB',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      downloadCount: 5,
      status: 'available',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4)
    },
    {
      id: 'exp-005',
      name: 'Subject Distribution Analysis',
      type: 'report',
      format: 'PDF',
      size: '1.1 MB',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      downloadCount: 2,
      status: 'expired',
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // Expired yesterday
    },
    {
      id: 'exp-006',
      name: 'Room Assignment Charts',
      type: 'timetable',
      format: 'PDF',
      size: '0.9 MB',
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      downloadCount: 4,
      status: 'available',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)
    }
  ];

  const periodOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'timetable', label: 'Timetables' },
    { value: 'report', label: 'Reports' },
    { value: 'data', label: 'Data Exports' }
  ];

  const getFilteredHistory = () => {
    return downloadHistory.filter(item => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      
      if (filterPeriod !== 'all') {
        const now = new Date();
        const itemDate = item.generatedAt;
        
        switch (filterPeriod) {
          case 'today':
            return itemDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return itemDate >= monthAgo;
          default:
            return true;
        }
      }
      
      return true;
    });
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatExpiryDate = (date) => {
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Expires today';
    } else if (diffDays === 1) {
      return 'Expires tomorrow';
    } else {
      return `Expires in ${diffDays} days`;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'timetable': return 'Calendar';
      case 'report': return 'BarChart3';
      case 'data': return 'Database';
      default: return 'FileText';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'timetable': return 'text-primary bg-primary/10';
      case 'report': return 'text-success bg-success/10';
      case 'data': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getFormatIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf': return 'FileText';
      case 'word': case'docx': return 'FileText';
      case 'excel': case'xlsx': return 'Sheet';
      case 'json': return 'Code';
      default: return 'File';
    }
  };

  const handleDownload = (item) => {
    // Simulate download
    console.log('Downloading:', item.name);
  };

  const handleRegenerate = (item) => {
    // Simulate regeneration
    console.log('Regenerating:', item.name);
  };

  const handleShare = (item) => {
    // Simulate sharing
    console.log('Sharing:', item.name);
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Download History</h3>
          <p className="text-sm text-muted-foreground">Access previously generated documents and reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select
          label="Time Period"
          options={periodOptions}
          value={filterPeriod}
          onChange={setFilterPeriod}
        />
        <Select
          label="Document Type"
          options={typeOptions}
          value={filterType}
          onChange={setFilterType}
        />
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">No downloads found</h4>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or generate some documents first.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className={`
              flex items-center space-x-4 p-4 rounded-lg border transition-all duration-150
              ${item.status === 'expired' ?'border-error/20 bg-error/5 opacity-60' :'border-border hover:bg-muted/50'
              }
            `}>
              {/* Type Icon */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getTypeColor(item.type)}`}>
                <Icon name={getTypeIcon(item.type)} size={20} />
              </div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Icon name={getFormatIcon(item.format)} size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.format}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{formatDate(item.generatedAt)}</span>
                  <span>{item.size}</span>
                  <span>{item.downloadCount} downloads</span>
                  <span className={item.status === 'expired' ? 'text-error' : ''}>
                    {formatExpiryDate(item.expiresAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {item.status === 'available' ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      onClick={() => handleDownload(item)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Share2"
                      onClick={() => handleShare(item)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="RotateCcw"
                      onClick={() => handleRegenerate(item)}
                    />
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                    onClick={() => handleRegenerate(item)}
                  >
                    Regenerate
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredHistory.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredHistory.length} of {downloadHistory.length} downloads
            </span>
            <span>
              Total size: {filteredHistory.reduce((sum, item) => sum + parseFloat(item.size), 0).toFixed(1)} MB
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadHistory;