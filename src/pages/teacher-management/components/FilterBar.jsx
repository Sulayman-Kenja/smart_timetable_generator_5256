import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterBar = ({ 
  filters = {}, 
  onFilterChange, 
  onClearFilters, 
  availableSubjects = [],
  selectedCount = 0,
  onBulkAction
}) => {
  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    ...availableSubjects.map(subject => ({ value: subject, label: subject }))
  ];

  const availabilityOptions = [
    { value: '', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'limited', label: 'Limited' },
    { value: 'unavailable', label: 'Full' }
  ];

  const utilizationOptions = [
    { value: '', label: 'All Utilization' },
    { value: '0-25', label: '0-25%' },
    { value: '26-50', label: '26-50%' },
    { value: '51-75', label: '51-75%' },
    { value: '76-100', label: '76-100%' }
  ];

  const bulkActions = [
    { value: 'export', label: 'Export Selected', icon: 'Download' },
    { value: 'duplicate', label: 'Duplicate Selected', icon: 'Copy' },
    { value: 'delete', label: 'Delete Selected', icon: 'Trash2' }
  ];

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  const handleBulkActionSelect = (action) => {
    if (action && selectedCount > 0) {
      onBulkAction(action);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Select
              options={subjectOptions}
              value={filters.subject || ''}
              onChange={(value) => onFilterChange('subject', value)}
              placeholder="Subject Area"
              className="w-full sm:w-40"
            />
            
            <Select
              options={availabilityOptions}
              value={filters.availability || ''}
              onChange={(value) => onFilterChange('availability', value)}
              placeholder="Availability"
              className="w-full sm:w-36"
            />
            
            <Select
              options={utilizationOptions}
              value={filters.utilization || ''}
              onChange={(value) => onFilterChange('utilization', value)}
              placeholder="Utilization"
              className="w-full sm:w-36"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center space-x-3">
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              <Select
                options={[
                  { value: '', label: 'Bulk Actions' },
                  ...bulkActions
                ]}
                value=""
                onChange={handleBulkActionSelect}
                placeholder="Actions"
                className="w-32"
              />
            </div>
          )}
          
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => onBulkAction('add')}
          >
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === '') return null;
              
              let displayValue = value;
              if (key === 'subject') displayValue = `Subject: ${value}`;
              if (key === 'availability') displayValue = `Status: ${value}`;
              if (key === 'utilization') displayValue = `Utilization: ${value}%`;
              
              return (
                <div
                  key={key}
                  className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                >
                  <span>{displayValue}</span>
                  <button
                    onClick={() => onFilterChange(key, '')}
                    className="hover:bg-primary/20 rounded p-0.5"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;