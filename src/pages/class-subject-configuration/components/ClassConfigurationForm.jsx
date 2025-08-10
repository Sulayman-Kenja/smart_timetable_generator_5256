import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import TeacherAssignmentPanel from './TeacherAssignmentPanel';

const ClassConfigurationForm = ({ 
  selectedClass, 
  availableSubjects, 
  availableTeachers = [],
  onUpdateClass, 
  onSaveConfiguration,
  maxWeeklyHours = 35 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    studentCount: '',
    selectedSubjects: {},
    weeklyHours: {},
    teacherAssignments: {},
    classTeacher: null
  });

  const [totalHours, setTotalHours] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' or 'teachers'

  useEffect(() => {
    if (selectedClass) {
      setFormData({
        name: selectedClass.name || '',
        studentCount: selectedClass.studentCount || '',
        selectedSubjects: selectedClass.selectedSubjects || {},
        weeklyHours: selectedClass.weeklyHours || {},
        teacherAssignments: selectedClass.teacherAssignments || {},
        classTeacher: selectedClass.classTeacher || null
      });
    }
  }, [selectedClass]);

  useEffect(() => {
    const total = Object.values(formData.weeklyHours).reduce((sum, hours) => sum + (parseInt(hours) || 0), 0);
    setTotalHours(total);
    
    // Validation
    const errors = {};
    if (total > maxWeeklyHours) {
      errors.totalHours = `Total hours (${total}) exceed maximum allowed (${maxWeeklyHours})`;
    }
    if (total < 20) {
      errors.totalHours = `Total hours (${total}) below recommended minimum (20)`;
    }
    setValidationErrors(errors);
  }, [formData.weeklyHours, maxWeeklyHours]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectToggle = (subjectId, checked) => {
    setFormData(prev => {
      const newSelectedSubjects = { ...prev.selectedSubjects };
      const newWeeklyHours = { ...prev.weeklyHours };
      const newTeacherAssignments = { ...prev.teacherAssignments };
      
      if (checked) {
        newSelectedSubjects[subjectId] = true;
        newWeeklyHours[subjectId] = availableSubjects.find(s => s.id === subjectId)?.defaultHours || 3;
      } else {
        delete newSelectedSubjects[subjectId];
        delete newWeeklyHours[subjectId];
        delete newTeacherAssignments[subjectId]; // Remove teacher assignment when subject is removed
      }
      
      return {
        ...prev,
        selectedSubjects: newSelectedSubjects,
        weeklyHours: newWeeklyHours,
        teacherAssignments: newTeacherAssignments
      };
    });
  };

  const handleHoursChange = (subjectId, hours) => {
    setFormData(prev => ({
      ...prev,
      weeklyHours: {
        ...prev.weeklyHours,
        [subjectId]: Math.max(0, Math.min(10, parseInt(hours) || 0))
      }
    }));
  };

  const handleTeacherAssignmentUpdate = (teacherAssignments) => {
    setFormData(prev => ({
      ...prev,
      teacherAssignments
    }));
  };

  const handleClassTeacherUpdate = (classTeacher) => {
    setFormData(prev => ({
      ...prev,
      classTeacher
    }));
  };

  const handleSave = () => {
    if (Object.keys(validationErrors).length === 0) {
      const updatedClass = {
        ...selectedClass,
        ...formData
      };
      onUpdateClass(updatedClass);
      onSaveConfiguration(updatedClass);
    }
  };

  const handleCopyFrom = (sourceClassId) => {
    // Mock implementation - in real app would copy from another class
    console.log('Copy configuration from:', sourceClassId);
  };

  const getHoursColor = () => {
    if (totalHours > maxWeeklyHours) return 'text-error';
    if (totalHours < 20) return 'text-warning';
    return 'text-success';
  };

  const getTeacherAssignmentProgress = () => {
    const selectedSubjects = Object.keys(formData.selectedSubjects);
    const assignedSubjects = Object.keys(formData.teacherAssignments).filter(
      subjectId => formData.teacherAssignments[subjectId]
    );
    
    return {
      total: selectedSubjects.length,
      assigned: assignedSubjects.length,
      percentage: selectedSubjects.length > 0 ? (assignedSubjects.length / selectedSubjects.length) * 100 : 0
    };
  };

  if (!selectedClass) {
    return (
      <div className="h-full bg-card flex items-center justify-center">
        <div className="text-center">
          <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No Class Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a grade or section from the navigation to configure subjects
          </p>
        </div>
      </div>
    );
  }

  const assignmentProgress = getTeacherAssignmentProgress();

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={selectedClass.type === 'grade' ? 'GraduationCap' : 'Users'} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {selectedClass.type === 'grade' ? 'Grade Configuration' : 'Section Configuration'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure subjects, weekly hours, and teacher assignments
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              iconPosition="left"
              onClick={() => handleCopyFrom('template')}
            >
              Copy From
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
              disabled={Object.keys(validationErrors).length > 0}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`
              flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === 'subjects' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon name="BookOpen" size={16} />
              <span>Subjects & Hours</span>
            </div>
          </button>
          {selectedClass.type === 'subclass' && (
            <button
              onClick={() => setActiveTab('teachers')}
              className={`
                flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === 'teachers' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Users" size={16} />
                <span>Teacher Assignments</span>
                {assignmentProgress.total > 0 && (
                  <span className={`
                    px-1.5 py-0.5 text-xs rounded-full
                    ${assignmentProgress.percentage === 100 
                      ? 'bg-success/20 text-success' :'bg-warning/20 text-warning'
                    }
                  `}>
                    {assignmentProgress.assigned}/{assignmentProgress.total}
                  </span>
                )}
              </div>
            </button>
          )}
        </div>

        {/* Hours Summary - Show on subjects tab */}
        {activeTab === 'subjects' && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mt-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total Hours</p>
                <p className={`text-lg font-bold ${getHoursColor()}`}>{totalHours}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Maximum</p>
                <p className="text-lg font-medium text-foreground">{maxWeeklyHours}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Subjects</p>
                <p className="text-lg font-medium text-foreground">
                  {Object.keys(formData.selectedSubjects).length}
                </p>
              </div>
            </div>
            
            {validationErrors.totalHours && (
              <div className="flex items-center space-x-2 text-error">
                <Icon name="AlertTriangle" size={16} />
                <span className="text-xs">{validationErrors.totalHours}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'subjects' ? (
          // Subjects Configuration Tab
          <div className="h-full overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Basic Information</h3>
                
                <Input
                  label="Class/Section Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter class name"
                  required
                />
                
                <Input
                  label="Student Count"
                  type="number"
                  value={formData.studentCount}
                  onChange={(e) => handleInputChange('studentCount', e.target.value)}
                  placeholder="Number of students"
                  min="1"
                  max="50"
                />
              </div>

              {/* Subject Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">Subject Configuration</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RotateCcw"
                    iconPosition="left"
                    onClick={() => {
                      // Reset to default configuration
                      const defaultSubjects = {};
                      const defaultHours = {};
                      availableSubjects.slice(0, 6).forEach(subject => {
                        defaultSubjects[subject.id] = true;
                        defaultHours[subject.id] = subject.defaultHours;
                      });
                      setFormData(prev => ({
                        ...prev,
                        selectedSubjects: defaultSubjects,
                        weeklyHours: defaultHours,
                        teacherAssignments: {} // Clear teacher assignments when resetting
                      }));
                    }}
                  >
                    Reset to Default
                  </Button>
                </div>

                <div className="space-y-3">
                  {availableSubjects.map((subject) => {
                    const isSelected = formData.selectedSubjects[subject.id];
                    const hours = formData.weeklyHours[subject.id] || 0;
                    
                    return (
                      <div
                        key={subject.id}
                        className={`
                          p-4 border rounded-lg transition-colors duration-150
                          ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) => handleSubjectToggle(subject.id, e.target.checked)}
                            />
                            <div>
                              <p className="font-medium text-foreground">{subject.name}</p>
                              <p className="text-xs text-muted-foreground">{subject.category}</p>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleHoursChange(subject.id, hours - 1)}
                                  disabled={hours <= 1}
                                  className="w-8 h-8"
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                
                                <div className="w-12 text-center">
                                  <span className="font-medium text-foreground">{hours}</span>
                                  <p className="text-xs text-muted-foreground">hrs/wk</p>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleHoursChange(subject.id, hours + 1)}
                                  disabled={hours >= 10}
                                  className="w-8 h-8"
                                >
                                  <Icon name="Plus" size={14} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Teacher Assignments Tab
          <TeacherAssignmentPanel
            selectedClass={selectedClass}
            availableTeachers={availableTeachers}
            availableSubjects={availableSubjects}
            onUpdateTeacherAssignments={handleTeacherAssignmentUpdate}
            onUpdateClassTeacher={handleClassTeacherUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ClassConfigurationForm;