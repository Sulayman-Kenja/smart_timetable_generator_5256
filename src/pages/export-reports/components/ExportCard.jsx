import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportCard = ({ 
  title, 
  description, 
  icon, 
  formats = [], 
  previewImage, 
  onExport,
  category = 'document',
  customOptions = []
}) => {
  const [selectedFormat, setSelectedFormat] = useState(formats[0]?.value || '');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        format: selectedFormat,
        options: selectedOptions,
        title
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptionChange = (optionKey, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionKey]: value
    }));
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'timetable':
        return 'border-primary/20 bg-primary/5';
      case 'report':
        return 'border-success/20 bg-success/5';
      case 'data':
        return 'border-accent/20 bg-accent/5';
      default:
        return 'border-border bg-card';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-elevation-2 ${getCategoryColor()}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            category === 'timetable' ? 'bg-primary' :
            category === 'report'? 'bg-success' : 'bg-accent'
          }`} />
        </div>
      </div>

      {/* Preview */}
      {previewImage && (
        <div className="mb-4 rounded-lg overflow-hidden bg-muted">
          <div className="w-full h-32 bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Format Selection */}
      <div className="mb-4">
        <Select
          label="Export Format"
          options={formats}
          value={selectedFormat}
          onChange={setSelectedFormat}
          className="mb-3"
        />
      </div>

      {/* Custom Options */}
      {customOptions.length > 0 && (
        <div className="mb-4 space-y-3">
          <h4 className="text-sm font-medium text-foreground">Options</h4>
          {customOptions.map((option) => (
            <div key={option.key}>
              {option.type === 'checkbox' && (
                <Checkbox
                  label={option.label}
                  description={option.description}
                  checked={selectedOptions[option.key] || false}
                  onChange={(e) => handleOptionChange(option.key, e.target.checked)}
                />
              )}
              {option.type === 'select' && (
                <Select
                  label={option.label}
                  options={option.options}
                  value={selectedOptions[option.key] || option.options[0]?.value}
                  onChange={(value) => handleOptionChange(option.key, value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Export Button */}
      <Button
        variant="default"
        fullWidth
        loading={isExporting}
        iconName="Download"
        iconPosition="left"
        onClick={handleExport}
        disabled={!selectedFormat}
      >
        {isExporting ? 'Generating...' : 'Export Document'}
      </Button>
    </div>
  );
};

export default ExportCard;