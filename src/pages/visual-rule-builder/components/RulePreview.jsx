import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RulePreview = ({ blocks = [], connections = [], onClose }) => {
  const generateRuleText = () => {
    if (blocks.length === 0) {
      return "No rules defined yet. Start by dragging rule blocks to the canvas.";
    }

    const ruleTexts = blocks.map(block => {
      const params = block.parameters || [];
      
      switch (block.type) {
        case 'time':
          if (block.id === 'max-daily-hours') {
            const maxHours = params.find(p => p.label === 'Max Hours')?.value || '6';
            const applyTo = params.find(p => p.label === 'Apply To')?.value || 'All Teachers';
            return `${applyTo} must not teach more than ${maxHours} hours per day`;
          }
          if (block.id === 'no-first-period') {
            const subject = params.find(p => p.label === 'Subject')?.value || 'Selected Subject';
            return `${subject} should not be scheduled in the first period`;
          }
          break;
          
        case 'teacher':
          if (block.id === 'teacher-availability') {
            const teacher = params.find(p => p.label === 'Teacher')?.value || 'Selected Teacher';
            const day = params.find(p => p.label === 'Day')?.value || 'Selected Day';
            const timeSlot = params.find(p => p.label === 'Time Slot')?.value || 'Selected Period';
            return `${teacher} is available on ${day} during ${timeSlot}`;
          }
          if (block.id === 'teacher-break') {
            const teacher = params.find(p => p.label === 'Teacher')?.value || 'Selected Teacher';
            const minBreak = params.find(p => p.label === 'Min Break')?.value || '30';
            const unit = params.find(p => p.label === 'Unit')?.value || 'Minutes';
            return `${teacher} must have at least ${minBreak} ${unit.toLowerCase()} break between classes`;
          }
          break;
          
        case 'subject':
          if (block.id === 'subject-spacing') {
            const subject = params.find(p => p.label === 'Subject')?.value || 'Selected Subject';
            const minGap = params.find(p => p.label === 'Min Gap')?.value || '1';
            const unit = params.find(p => p.label === 'Unit')?.value || 'Periods';
            return `${subject} classes must have at least ${minGap} ${unit.toLowerCase()} gap between them`;
          }
          if (block.id === 'lab-booking') {
            const lab = params.find(p => p.label === 'Lab')?.value || 'Selected Lab';
            const subject = params.find(p => p.label === 'Subject')?.value || 'Selected Subject';
            const duration = params.find(p => p.label === 'Duration')?.value || '2';
            return `${subject} requires ${lab} for ${duration} consecutive periods`;
          }
          break;
          
        case 'grouping':
          if (block.id === 'consecutive-periods') {
            const subject = params.find(p => p.label === 'Subject')?.value || 'Selected Subject';
            const count = params.find(p => p.label === 'Count')?.value || '2';
            const sameDay = params.find(p => p.label === 'Same Day')?.value;
            return `${subject} should have ${count} consecutive periods${sameDay ? ' on the same day' : ''}`;
          }
          if (block.id === 'class-priority') {
            const className = params.find(p => p.label === 'Class')?.value || 'Selected Class';
            const priority = params.find(p => p.label === 'Priority')?.value || 'Medium';
            return `${className} has ${priority.toLowerCase()} priority for scheduling`;
          }
          break;
          
        default:
          return `${block.name}: Custom rule configuration`;
      }
      
      return `${block.name}: Rule configuration needed`;
    });

    // Combine rules with connections
    if (connections.length === 0) {
      return ruleTexts.join('\n\n');
    }

    // For connected rules, show logical relationships
    let combinedText = "Combined Rule Set:\n\n";
    ruleTexts.forEach((text, index) => {
      combinedText += `${index + 1}. ${text}\n`;
    });

    if (connections.length > 0) {
      combinedText += "\nLogical Connections:\n";
      connections.forEach((conn, index) => {
        const fromBlock = blocks.find(b => b.id === conn.from);
        const toBlock = blocks.find(b => b.id === conn.to);
        if (fromBlock && toBlock) {
          combinedText += `• ${fromBlock.name} ${conn.type.toUpperCase()} ${toBlock.name}\n`;
        }
      });
    }

    return combinedText;
  };

  const getAffectedEntities = () => {
    const entities = {
      teachers: new Set(),
      classes: new Set(),
      subjects: new Set(),
      timeSlots: new Set()
    };

    blocks.forEach(block => {
      const params = block.parameters || [];
      
      params.forEach(param => {
        if (param.label === 'Teacher' && param.value) {
          entities.teachers.add(param.value);
        }
        if (param.label === 'Class' && param.value) {
          entities.classes.add(param.value);
        }
        if (param.label === 'Subject' && param.value) {
          entities.subjects.add(param.value);
        }
        if (param.label === 'Time Slot' && param.value) {
          entities.timeSlots.add(param.value);
        }
      });
    });

    return entities;
  };

  const affectedEntities = getAffectedEntities();
  const ruleText = generateRuleText();

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Rule Preview</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Rule Interpretation */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="FileText" size={16} className="mr-2" />
            Rule Interpretation
          </h4>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {ruleText}
            </pre>
          </div>
        </div>

        {/* Affected Entities */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Target" size={16} className="mr-2" />
            Affected Entities
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {affectedEntities.teachers.size > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Icon name="User" size={14} className="text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Teachers ({affectedEntities.teachers.size})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.from(affectedEntities.teachers).map(teacher => (
                    <span key={teacher} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {teacher}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {affectedEntities.classes.size > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Icon name="Users" size={14} className="text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Classes ({affectedEntities.classes.size})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.from(affectedEntities.classes).map(className => (
                    <span key={className} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {className}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {affectedEntities.subjects.size > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Icon name="BookOpen" size={14} className="text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">Subjects ({affectedEntities.subjects.size})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.from(affectedEntities.subjects).map(subject => (
                    <span key={subject} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rule Statistics */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Rule Statistics
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{blocks.length}</div>
              <div className="text-xs text-muted-foreground">Total Rules</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-accent">{connections.length}</div>
              <div className="text-xs text-muted-foreground">Connections</div>
            </div>
          </div>
        </div>

        {/* Validation Status */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="CheckCircle" size={16} className="mr-2" />
            Validation Status
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
              <span className="text-sm text-green-800">Syntax Check</span>
              <Icon name="Check" size={16} className="text-green-600" />
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
              <span className="text-sm text-green-800">Logic Validation</span>
              <Icon name="Check" size={16} className="text-green-600" />
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded">
              <span className="text-sm text-yellow-800">Conflict Detection</span>
              <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            className="flex-1"
          >
            Export Rules
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Play"
            iconPosition="left"
            className="flex-1"
          >
            Test Rules
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RulePreview;