import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const TeacherSelector = ({ 
  teachers = [], 
  selectedTeacherId = null, 
  onTeacherSelect, 
  subjectFilter = null,
  label = "Select Teacher",
  placeholder = "Choose a teacher...",
  showAvailability = true,
  disabled = false,
  error = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  useEffect(() => {
    let filtered = teachers;

    // Filter by subject if specified
    if (subjectFilter) {
      filtered = filtered.filter(teacher => 
        teacher.subjects?.some(subject => 
          subject.toLowerCase().includes(subjectFilter.toLowerCase())
        )
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects?.some(subject => 
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredTeachers(filtered);
  }, [teachers, subjectFilter, searchTerm]);

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

  const getUtilizationColor = (utilization) => {
    if (utilization >= 100) return 'text-error';
    if (utilization >= 80) return 'text-warning';
    return 'text-success';
  };

  const getUtilizationText = (teacher) => {
    const utilization = (teacher.currentHours / teacher.maxHours) * 100;
    return Math.round(utilization);
  };

  const handleTeacherSelect = (teacher) => {
    onTeacherSelect?.(teacher.id);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    onTeacherSelect?.(null);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      
      <div className="relative">
        {selectedTeacher ? (
          <div className={`
            flex items-center justify-between p-3 border rounded-lg bg-background
            ${error ? 'border-error' : 'border-border'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}
          `}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedTeacher.name}</p>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-muted-foreground">{selectedTeacher.employeeId}</span>
                  {showAvailability && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className={getUtilizationColor(getUtilizationText(selectedTeacher))}>
                        {getUtilizationText(selectedTeacher)}% utilized
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!disabled && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDropdown(true)}
                    className="w-8 h-8"
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSelection}
                    className="w-8 h-8"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDropdown(true)}
            disabled={disabled}
            className={`
              w-full p-3 text-left border rounded-lg bg-background transition-colors
              ${error ? 'border-error' : 'border-border hover:border-primary'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{placeholder}</span>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </div>
          </button>
        )}
        
        {error && (
          <p className="text-sm text-error mt-1">{error}</p>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b border-border">
            <Input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              iconName="Search"
              iconPosition="left"
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredTeachers.length > 0 ? (
              <div className="p-1">
                {filteredTeachers.map((teacher) => {
                  const utilization = getUtilizationText(teacher);
                  const isOverloaded = utilization >= 100;
                  
                  return (
                    <button
                      key={teacher.id}
                      type="button"
                      onClick={() => handleTeacherSelect(teacher)}
                      className={`
                        w-full p-3 text-left rounded-lg transition-colors
                        ${isOverloaded ? 'opacity-60' : 'hover:bg-muted/50'}
                      `}
                      disabled={isOverloaded}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="User" size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{teacher.name}</p>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="text-muted-foreground">{teacher.employeeId}</span>
                              {teacher.subjects?.length > 0 && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-muted-foreground">
                                    {teacher.subjects.slice(0, 2).join(', ')}
                                    {teacher.subjects.length > 2 && ` +${teacher.subjects.length - 2}`}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {showAvailability && (
                          <div className="text-right">
                            <p className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                              {utilization}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {teacher.currentHours}h / {teacher.maxHours}h
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {isOverloaded && (
                        <div className="mt-2 flex items-center space-x-1 text-xs text-error">
                          <Icon name="AlertTriangle" size={12} />
                          <span>Teacher is fully allocated</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Icon name="UserX" size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {subjectFilter 
                    ? `No teachers found for "${subjectFilter}"` 
                    : 'No teachers found'
                  }
                </p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDropdown(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSelector;