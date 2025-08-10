import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TemplateSelector = ({ onTemplateChange, selectedTemplate }) => {
  const [previewMode, setPreviewMode] = useState('desktop');

  const templates = [
    {
      value: 'modern',
      label: 'Modern Professional',
      description: 'Clean design with school branding',
      preview: 'modern-preview.jpg'
    },
    {
      value: 'classic',
      label: 'Classic Academic',
      description: 'Traditional institutional format',
      preview: 'classic-preview.jpg'
    },
    {
      value: 'minimal',
      label: 'Minimal Clean',
      description: 'Simple and focused layout',
      preview: 'minimal-preview.jpg'
    },
    {
      value: 'detailed',
      label: 'Detailed Report',
      description: 'Comprehensive information display',
      preview: 'detailed-preview.jpg'
    }
  ];

  const logoPositions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'header-center', label: 'Header Center' }
  ];

  const colorSchemes = [
    { value: 'blue', label: 'Professional Blue' },
    { value: 'green', label: 'Academic Green' },
    { value: 'purple', label: 'Modern Purple' },
    { value: 'gray', label: 'Classic Gray' }
  ];

  const getCurrentTemplate = () => {
    return templates.find(t => t.value === selectedTemplate) || templates[0];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Template Settings</h3>
          <p className="text-sm text-muted-foreground">Customize document appearance and branding</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            iconName="Monitor"
            onClick={() => setPreviewMode('desktop')}
          />
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            iconName="Smartphone"
            onClick={() => setPreviewMode('mobile')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <div className="space-y-4">
          <Select
            label="Document Template"
            description="Choose the overall design style"
            options={templates}
            value={selectedTemplate}
            onChange={onTemplateChange}
          />

          <Select
            label="Logo Position"
            description="Where to place your institution logo"
            options={logoPositions}
            value="top-center"
            onChange={() => {}}
          />

          <Select
            label="Color Scheme"
            description="Primary colors for headers and accents"
            options={colorSchemes}
            value="blue"
            onChange={() => {}}
          />

          {/* Template Features */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Template Features</h4>
            <div className="space-y-2">
              {[
                'School logo and branding',
                'Professional typography',
                'Responsive table layouts',
                'Print-optimized formatting',
                'Custom color schemes'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Preview</h4>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Eye" size={14} />
              <span>{getCurrentTemplate().label}</span>
            </div>
          </div>

          <div className={`
            bg-muted rounded-lg border border-border overflow-hidden
            ${previewMode === 'desktop' ? 'aspect-[4/3]' : 'aspect-[3/4] max-w-48 mx-auto'}
          `}>
            <div className="w-full h-full bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-32 h-20 bg-primary/10 rounded border-2 border-dashed border-primary/30 flex items-center justify-center mb-4">
                <Icon name="Image" size={24} className="text-primary/50" />
              </div>
              <div className="space-y-2 text-center">
                <div className="h-3 bg-foreground/20 rounded w-24 mx-auto" />
                <div className="h-2 bg-foreground/10 rounded w-32 mx-auto" />
                <div className="h-2 bg-foreground/10 rounded w-28 mx-auto" />
              </div>
              <div className="mt-4 w-full space-y-1">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((col) => (
                      <div key={col} className="flex-1 h-2 bg-foreground/5 rounded" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              iconName="Maximize2"
              iconPosition="left"
            >
              Full Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;