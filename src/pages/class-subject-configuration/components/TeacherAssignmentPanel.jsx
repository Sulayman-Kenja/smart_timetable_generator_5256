import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import TeacherSelector from '../../../components/ui/TeacherSelector';

const TeacherAssignmentPanel = ({
  selectedClass,
  availableTeachers = [],
  availableSubjects = [],
  onUpdateTeacherAssignments,
  onUpdateClassTeacher
}) => {
  const [teacherAssignments, setTeacherAssignments] = useState({});
  const [classTeacher, setClassTeacher] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedClass) {
      setTeacherAssignments(selectedClass.teacherAssignments || {});
      setClassTeacher(selectedClass.classTeacher || null);
    }
  }, [selectedClass]);

  const handleSubjectTeacherChange = (subjectId, teacherId) => {
    const newAssignments = {
      ...teacherAssignments,
      [subjectId]: teacherId
    };
    
    if (!teacherId) {
      delete newAssignments[subjectId];
    }

    setTeacherAssignments(newAssignments);
    onUpdateTeacherAssignments?.(newAssignments);
  };

  const handleClassTeacherChange = (teacherId) => {
    setClassTeacher(teacherId);
    onUpdateClassTeacher?.(teacherId);
  };

  const getSubjectName = (subjectId) => {
    return availableSubjects.find(s => s.id === subjectId)?.name || subjectId;
  };

  const getTeacherSubjects = (teacherId) => {
    const teacher = availableTeachers.find(t => t.id === teacherId);
    return teacher?.subjects || [];
  };

  const validateTeacherAssignment = (subjectId, teacherId) => {
    if (!teacherId) return null;
    
    const teacher = availableTeachers.find(t => t.id === teacherId);
    if (!teacher) return 'Teacher not found';
    
    const subject = availableSubjects.find(s => s.id === subjectId);
    if (!subject) return 'Subject not found';
    
    // Check if teacher can teach this subject
    const canTeachSubject = teacher.subjects?.some(teacherSubject => 
      teacherSubject.toLowerCase().includes(subject.name.toLowerCase()) ||
      subject.name.toLowerCase().includes(teacherSubject.toLowerCase())
    );
    
    if (!canTeachSubject) {
      return `Teacher doesn't specialize in ${subject.name}`;
    }
    
    // Check teacher availability (basic check)
    const utilization = (teacher.currentHours / teacher.maxHours) * 100;
    if (utilization >= 100) {
      return 'Teacher is fully allocated';
    }
    
    return null;
  };

  const getAssignmentStats = () => {
    const selectedSubjects = Object.keys(selectedClass?.selectedSubjects || {});
    const assignedSubjects = Object.keys(teacherAssignments);
    const unassignedCount = selectedSubjects.length - assignedSubjects.length;
    
    return {
      total: selectedSubjects.length,
      assigned: assignedSubjects.length,
      unassigned: unassignedCount
    };
  };

  const getTeacherWorkload = () => {
    const workload = {};
    
    Object.entries(teacherAssignments).forEach(([subjectId, teacherId]) => {
      if (teacherId) {
        const subject = availableSubjects.find(s => s.id === subjectId);
        const weeklyHours = selectedClass?.weeklyHours?.[subjectId] || 0;
        
        if (!workload[teacherId]) {
          workload[teacherId] = {
            teacher: availableTeachers.find(t => t.id === teacherId),
            subjects: [],
            totalHours: 0
          };
        }
        
        workload[teacherId].subjects.push({
          id: subjectId,
          name: subject?.name || subjectId,
          hours: weeklyHours
        });
        workload[teacherId].totalHours += weeklyHours;
      }
    });

    return workload;
  };

  if (!selectedClass || selectedClass.type !== 'subclass') {
    return (
      <div className="h-full bg-card flex items-center justify-center">
        <div className="text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Select a Subclass</h3>
          <p className="text-sm text-muted-foreground">
            Teacher assignments can only be configured for individual subclasses
          </p>
        </div>
      </div>
    );
  }

  const stats = getAssignmentStats();
  const workload = getTeacherWorkload();
  const selectedSubjects = Object.keys(selectedClass.selectedSubjects || {});

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="UserCheck" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Teacher Assignments</h2>
              <p className="text-sm text-muted-foreground">
                Assign teachers to subjects for {selectedClass.name}
              </p>
            </div>
          </div>
        </div>

        {/* Assignment Summary */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Subjects</p>
            <p className="text-lg font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Assigned</p>
            <p className="text-lg font-bold text-success">{stats.assigned}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Unassigned</p>
            <p className="text-lg font-bold text-warning">{stats.unassigned}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Class Teacher Assignment */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Class Teacher</h3>
            <TeacherSelector
              teachers={availableTeachers}
              selectedTeacherId={classTeacher}
              onTeacherSelect={handleClassTeacherChange}
              label="Assign Class Teacher"
              placeholder="Select the main class teacher..."
              showAvailability={true}
            />
          </div>

          {/* Subject Teacher Assignments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">Subject Teachers</h3>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => {
                  setTeacherAssignments({});
                  onUpdateTeacherAssignments?.({});
                }}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-4">
              {selectedSubjects.map((subjectId) => {
                const subject = availableSubjects.find(s => s.id === subjectId);
                const assignedTeacherId = teacherAssignments[subjectId];
                const weeklyHours = selectedClass.weeklyHours?.[subjectId] || 0;
                const validationError = validateTeacherAssignment(subjectId, assignedTeacherId);
                
                return (
                  <div
                    key={subjectId}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{subject?.name || subjectId}</h4>
                        <p className="text-sm text-muted-foreground">
                          {weeklyHours} hours per week • {subject?.category || 'Unknown'}
                        </p>
                      </div>
                      
                      {validationError && (
                        <div className="flex items-center space-x-1 text-warning">
                          <Icon name="AlertTriangle" size={16} />
                          <span className="text-xs">{validationError}</span>
                        </div>
                      )}
                    </div>
                    
                    <TeacherSelector
                      teachers={availableTeachers}
                      selectedTeacherId={assignedTeacherId}
                      onTeacherSelect={(teacherId) => handleSubjectTeacherChange(subjectId, teacherId)}
                      subjectFilter={subject?.name}
                      label={`Teacher for ${subject?.name || subjectId}`}
                      placeholder="Select a teacher for this subject..."
                      showAvailability={true}
                      error={validationError}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Workload Summary */}
          {Object.keys(workload).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Teacher Workload Summary</h3>
              <div className="space-y-3">
                {Object.entries(workload).map(([teacherId, data]) => {
                  const utilization = ((data.teacher?.currentHours || 0) + data.totalHours) / (data.teacher?.maxHours || 1) * 100;
                  
                  return (
                    <div
                      key={teacherId}
                      className="p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="User" size={12} className="text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{data.teacher?.name}</span>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            utilization > 100 ? 'text-error' : 
                            utilization > 80 ? 'text-warning' : 'text-success'
                          }`}>
                            {Math.round(utilization)}% utilized
                          </p>
                          <p className="text-xs text-muted-foreground">
                            +{data.totalHours}h in this class
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {data.subjects.map((subject) => (
                          <span
                            key={subject.id}
                            className="px-2 py-1 text-xs bg-muted rounded text-muted-foreground"
                          >
                            {subject.name} ({subject.hours}h)
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentPanel;