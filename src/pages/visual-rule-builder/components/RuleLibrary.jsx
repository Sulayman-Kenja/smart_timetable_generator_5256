import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const RuleLibrary = ({ onDragStart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const ruleCategories = [
    { id: 'all', label: 'All Rules', icon: 'Grid3x3' },
    { id: 'time', label: 'Time Constraints', icon: 'Clock' },
    { id: 'teacher', label: 'Teacher Rules', icon: 'User' },
    { id: 'subject', label: 'Subject Rules', icon: 'BookOpen' },
    { id: 'grouping', label: 'Grouping Rules', icon: 'Users' }
  ];

  const ruleTemplates = [
    {
      id: 'max-daily-hours',
      name: 'Max Daily Hours',
      type: 'time',
      description: 'Limit maximum teaching hours per day',
      icon: 'Clock',
      parameters: [
        { label: 'Max Hours', type: 'number', default: 6 },
        { label: 'Apply To', type: 'select', options: ['All Teachers', 'Specific Teacher'] }
      ]
    },
    {
      id: 'teacher-availability',
      name: 'Teacher Availability',
      type: 'teacher',
      description: 'Define when teacher is available',
      icon: 'User',
      parameters: [
        { label: 'Teacher', type: 'select', options: ['Select Teacher'] },
        { label: 'Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
        { label: 'Time Slot', type: 'select', options: ['Period 1', 'Period 2', 'Period 3'] }
      ]
    },
    {
      id: 'subject-spacing',
      name: 'Subject Spacing',
      type: 'subject',
      description: 'Minimum gap between same subject',
      icon: 'BookOpen',
      parameters: [
        { label: 'Subject', type: 'select', options: ['Mathematics', 'Science', 'English'] },
        { label: 'Min Gap', type: 'number', default: 1 },
        { label: 'Unit', type: 'select', options: ['Periods', 'Hours'] }
      ]
    },
    {
      id: 'consecutive-periods',
      name: 'Consecutive Periods',
      type: 'grouping',
      description: 'Group periods together',
      icon: 'Users',
      parameters: [
        { label: 'Subject', type: 'select', options: ['Mathematics', 'Science', 'English'] },
        { label: 'Count', type: 'number', default: 2 },
        { label: 'Same Day', type: 'checkbox', default: true }
      ]
    },
    {
      id: 'no-first-period',
      name: 'No First Period',
      type: 'time',
      description: 'Avoid scheduling in first period',
      icon: 'Clock',
      parameters: [
        { label: 'Subject', type: 'select', options: ['Physical Education', 'Art', 'Music'] },
        { label: 'Days', type: 'multiselect', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
      ]
    },
    {
      id: 'teacher-break',
      name: 'Teacher Break',
      type: 'teacher',
      description: 'Ensure minimum break time',
      icon: 'User',
      parameters: [
        { label: 'Teacher', type: 'select', options: ['Select Teacher'] },
        { label: 'Min Break', type: 'number', default: 30 },
        { label: 'Unit', type: 'select', options: ['Minutes', 'Periods'] }
      ]
    },
    {
      id: 'lab-booking',
      name: 'Lab Booking',
      type: 'subject',
      description: 'Reserve lab for specific subjects',
      icon: 'BookOpen',
      parameters: [
        { label: 'Lab', type: 'select', options: ['Computer Lab', 'Science Lab', 'Language Lab'] },
        { label: 'Subject', type: 'select', options: ['Computer Science', 'Physics', 'Chemistry'] },
        { label: 'Duration', type: 'number', default: 2 }
      ]
    },
    {
      id: 'class-priority',
      name: 'Class Priority',
      type: 'grouping',
      description: 'Set scheduling priority for classes',
      icon: 'Users',
      parameters: [
        { label: 'Class', type: 'select', options: ['Grade 10A', 'Grade 10B', 'Grade 11A'] },
        { label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
        { label: 'Reason', type: 'text', placeholder: 'Optional reason' }
      ]
    }
  ];

  const filteredRules = ruleTemplates.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || rule.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e, rule) => {
    e.dataTransfer.setData('application/json', JSON.stringify(rule));
    onDragStart(rule);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Rule Library</h2>
        <Input
          type="search"
          placeholder="Search rules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-border">
        <div className="space-y-1">
          {ruleCategories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="w-full justify-start"
              iconName={category.icon}
              iconPosition="left"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Rule Templates */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredRules.map(rule => (
            <div
              key={rule.id}
              draggable
              onDragStart={(e) => handleDragStart(e, rule)}
              className="p-3 bg-muted rounded-lg border border-border cursor-move hover:bg-muted/80 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={rule.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground mb-1">
                    {rule.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rule.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${rule.type === 'time' ? 'bg-blue-100 text-blue-700' : ''}
                      ${rule.type === 'teacher' ? 'bg-green-100 text-green-700' : ''}
                      ${rule.type === 'subject' ? 'bg-purple-100 text-purple-700' : ''}
                      ${rule.type === 'grouping' ? 'bg-orange-100 text-orange-700' : ''}
                    `}>
                      {rule.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {rule.parameters.length} params
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRules.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No rules found matching your search</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 Drag rules to canvas to create constraints</p>
          <p>🔗 Connect rules with logic operators</p>
          <p>⚡ Rules are applied during generation</p>
        </div>
      </div>
    </div>
  );
};

export default RuleLibrary;