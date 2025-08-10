import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClassTreeNavigation = ({ 
  grades, 
  selectedClass, 
  onClassSelect, 
  onAddGrade, 
  onAddSubclass, 
  onDeleteClass,
  onReorderClasses 
}) => {
  const [expandedGrades, setExpandedGrades] = useState(new Set(['grade-1', 'grade-2']));
  const [draggedItem, setDraggedItem] = useState(null);

  const toggleGradeExpansion = (gradeId) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(gradeId)) {
      newExpanded.delete(gradeId);
    } else {
      newExpanded.add(gradeId);
    }
    setExpandedGrades(newExpanded);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== targetItem.id) {
      onReorderClasses(draggedItem, targetItem);
    }
    setDraggedItem(null);
  };

  const isSelected = (classId) => selectedClass?.id === classId;

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Class Structure</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddGrade}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="Plus" size={16} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Drag to reorder • Click to configure
        </p>
      </div>

      {/* Tree Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {grades.map((grade) => (
            <div key={grade.id} className="select-none">
              {/* Grade Level */}
              <div
                className={`
                  flex items-center p-2 rounded-lg cursor-pointer group
                  transition-colors duration-150
                  ${isSelected(grade.id) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                `}
                draggable
                onDragStart={(e) => handleDragStart(e, grade)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, grade)}
                onClick={() => onClassSelect(grade)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGradeExpansion(grade.id);
                  }}
                  className="w-6 h-6 mr-1 text-current"
                >
                  <Icon 
                    name={expandedGrades.has(grade.id) ? "ChevronDown" : "ChevronRight"} 
                    size={14} 
                  />
                </Button>
                
                <Icon name="GraduationCap" size={16} className="mr-2 text-current" />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{grade.name}</p>
                  <p className="text-xs opacity-70">
                    {grade.subclasses?.length || 0} sections
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSubclass(grade.id);
                    }}
                    className="w-6 h-6 text-current"
                  >
                    <Icon name="Plus" size={12} />
                  </Button>
                </div>
              </div>

              {/* Subclasses */}
              {expandedGrades.has(grade.id) && grade.subclasses && (
                <div className="ml-6 mt-1 space-y-1">
                  {grade.subclasses.map((subclass) => (
                    <div
                      key={subclass.id}
                      className={`
                        flex items-center p-2 rounded-lg cursor-pointer group
                        transition-colors duration-150
                        ${isSelected(subclass.id) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      `}
                      draggable
                      onDragStart={(e) => handleDragStart(e, subclass)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, subclass)}
                      onClick={() => onClassSelect(subclass)}
                    >
                      <Icon name="Users" size={14} className="mr-2 text-current" />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{subclass.name}</p>
                        <p className="text-xs opacity-70">
                          {subclass.studentCount} students
                        </p>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClass(subclass.id);
                          }}
                          className="w-6 h-6 text-current"
                        >
                          <Icon name="Trash2" size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Total Grades:</span>
            <span className="font-medium text-foreground">{grades.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Total Sections:</span>
            <span className="font-medium text-foreground">
              {grades.reduce((total, grade) => total + (grade.subclasses?.length || 0), 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassTreeNavigation;