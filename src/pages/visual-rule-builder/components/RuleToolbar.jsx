import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RuleToolbar = ({ 
  onSave, 
  onLoad, 
  onClear, 
  onExport, 
  onImport,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  ruleCount = 0,
  connectionCount = 0
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ruleTemplates = [
    { value: '', label: 'Select Template...' },
    { value: 'basic-school', label: 'Basic School Rules' },
    { value: 'advanced-constraints', label: 'Advanced Constraints' },
    { value: 'teacher-focused', label: 'Teacher-Focused Rules' },
    { value: 'subject-optimization', label: 'Subject Optimization' },
    { value: 'lab-management', label: 'Lab Management Rules' }
  ];

  const handleTemplateLoad = async (templateId) => {
    if (!templateId) return;
    
    setIsLoading(true);
    try {
      // Simulate template loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Loading template:', templateId);
      // In real app, this would load predefined rule sets
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const rules = JSON.parse(e.target.result);
          onImport(rules);
        } catch (error) {
          console.error('Error parsing rule file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card border-b border-border">
      {/* Left Section - File Operations */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          iconName="Save"
          iconPosition="left"
          disabled={ruleCount === 0}
        >
          Save
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onLoad}
          iconName="FolderOpen"
          iconPosition="left"
        >
          Load
        </Button>

        <div className="w-px h-6 bg-border" />

        <input
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="hidden"
          id="rule-import"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => document.getElementById('rule-import').click()}
          iconName="Upload"
          iconPosition="left"
        >
          Import
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          iconName="Download"
          iconPosition="left"
          disabled={ruleCount === 0}
        >
          Export
        </Button>
      </div>

      {/* Center Section - Templates and Actions */}
      <div className="flex items-center space-x-4">
        <Select
          options={ruleTemplates}
          value={selectedTemplate}
          onChange={(value) => {
            setSelectedTemplate(value);
            handleTemplateLoad(value);
          }}
          placeholder="Load Template"
          loading={isLoading}
          className="w-48"
        />

        <div className="w-px h-6 bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          iconName="Undo"
          disabled={!canUndo}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          iconName="Redo"
          disabled={!canRedo}
        />

        <div className="w-px h-6 bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          iconName="Trash2"
          disabled={ruleCount === 0}
          className="text-destructive hover:text-destructive"
        >
          Clear All
        </Button>
      </div>

      {/* Right Section - Status and Info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Puzzle" size={14} />
            <span>{ruleCount} rules</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="GitBranch" size={14} />
            <span>{connectionCount} connections</span>
          </div>
        </div>

        <div className="w-px h-6 bg-border" />

        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Auto-save enabled</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="HelpCircle" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default RuleToolbar;