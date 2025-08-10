import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkOperationsPanel = ({ 
  grades, 
  onBulkCopyConfiguration, 
  onBulkUpdateSubjects, 
  onBulkUpdateHours,
  isVisible,
  onClose 
}) => {
  const [selectedClasses, setSelectedClasses] = useState(new Set());
  const [sourceClass, setSourceClass] = useState('');
  const [operationType, setOperationType] = useState('copy');
  const [bulkHoursUpdate, setBulkHoursUpdate] = useState({});

  const allClasses = grades.reduce((acc, grade) => {
    acc.push(grade);
    if (grade.subclasses) {
      acc.push(...grade.subclasses);
    }
    return acc;
  }, []);

  const handleClassToggle = (classId, checked) => {
    const newSelected = new Set(selectedClasses);
    if (checked) {
      newSelected.add(classId);
    } else {
      newSelected.delete(classId);
    }
    setSelectedClasses(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClasses(new Set(allClasses.map(c => c.id)));
    } else {
      setSelectedClasses(new Set());
    }
  };

  const handleBulkOperation = () => {
    const targetClasses = Array.from(selectedClasses);
    
    switch (operationType) {
      case 'copy':
        if (sourceClass && targetClasses.length > 0) {
          onBulkCopyConfiguration(sourceClass, targetClasses);
        }
        break;
      case 'updateSubjects':
        onBulkUpdateSubjects(targetClasses);
        break;
      case 'updateHours':
        onBulkUpdateHours(targetClasses, bulkHoursUpdate);
        break;
    }
    
    // Reset form
    setSelectedClasses(new Set());
    setSourceClass('');
    setBulkHoursUpdate({});
    onClose();
  };

  const isOperationValid = () => {
    if (selectedClasses.size === 0) return false;
    
    switch (operationType) {
      case 'copy':
        return sourceClass && !selectedClasses.has(sourceClass);
      case 'updateSubjects': case'updateHours':
        return true;
      default:
        return false;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Bulk Operations</h2>
              <p className="text-sm text-muted-foreground">
                Apply changes to multiple classes simultaneously
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Operation Type */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Operation Type</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="operationType"
                    value="copy"
                    checked={operationType === 'copy'}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <p className="font-medium text-sm text-foreground">Copy Configuration</p>
                    <p className="text-xs text-muted-foreground">Copy subjects and hours from one class to others</p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="operationType"
                    value="updateSubjects"
                    checked={operationType === 'updateSubjects'}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <p className="font-medium text-sm text-foreground">Update Subjects</p>
                    <p className="text-xs text-muted-foreground">Add or remove subjects from selected classes</p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="operationType"
                    value="updateHours"
                    checked={operationType === 'updateHours'}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <p className="font-medium text-sm text-foreground">Update Hours</p>
                    <p className="text-xs text-muted-foreground">Modify weekly hours for specific subjects</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Source Class Selection (for copy operation) */}
            {operationType === 'copy' && (
              <div>
                <h3 className="font-medium text-foreground mb-3">Source Class</h3>
                <select
                  value={sourceClass}
                  onChange={(e) => setSourceClass(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Select source class...</option>
                  {allClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.type === 'grade' ? 'Grade' : 'Section'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target Classes Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">Target Classes</h3>
                <Checkbox
                  label="Select All"
                  checked={selectedClasses.size === allClasses.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                {grades.map((grade) => (
                  <div key={grade.id} className="space-y-2">
                    {/* Grade */}
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedClasses.has(grade.id)}
                        onChange={(e) => handleClassToggle(grade.id, e.target.checked)}
                        disabled={operationType === 'copy' && sourceClass === grade.id}
                      />
                      <div className="flex items-center space-x-2">
                        <Icon name="GraduationCap" size={16} className="text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">{grade.name}</span>
                      </div>
                    </div>
                    
                    {/* Subclasses */}
                    {grade.subclasses && (
                      <div className="ml-6 space-y-1">
                        {grade.subclasses.map((subclass) => (
                          <div key={subclass.id} className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedClasses.has(subclass.id)}
                              onChange={(e) => handleClassToggle(subclass.id, e.target.checked)}
                              disabled={operationType === 'copy' && sourceClass === subclass.id}
                            />
                            <div className="flex items-center space-x-2">
                              <Icon name="Users" size={14} className="text-muted-foreground" />
                              <span className="text-sm text-foreground">{subclass.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedClasses.size} classes selected
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleBulkOperation}
                disabled={!isOperationValid()}
                iconName="Zap"
                iconPosition="left"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsPanel;