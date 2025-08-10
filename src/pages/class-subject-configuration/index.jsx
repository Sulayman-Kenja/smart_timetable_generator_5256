import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import Button from '../../components/ui/Button';

// Import page-specific components
import ClassTreeNavigation from './components/ClassTreeNavigation';
import ClassConfigurationForm from './components/ClassConfigurationForm';
import SubjectLibrary from './components/SubjectLibrary';
import BulkOperationsPanel from './components/BulkOperationsPanel';

const ClassSubjectConfiguration = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activePanel, setActivePanel] = useState('tree'); // tree, form, library

  // Mock data for grades and subjects
  const [grades, setGrades] = useState([
    {
      id: 'grade-1',
      name: 'Grade 1',
      type: 'grade',
      selectedSubjects: {
        'math-basic': true,
        'english-basic': true,
        'science-intro': true,
        'art-creative': true
      },
      weeklyHours: {
        'math-basic': 5,
        'english-basic': 6,
        'science-intro': 3,
        'art-creative': 2
      },
      subclasses: [
        {
          id: 'grade-1-a',
          name: 'Grade 1-A',
          type: 'subclass',
          parentId: 'grade-1',
          studentCount: 28,
          selectedSubjects: {
            'math-basic': true,
            'english-basic': true,
            'science-intro': true,
            'art-creative': true,
            'physical-ed': true
          },
          weeklyHours: {
            'math-basic': 5,
            'english-basic': 6,
            'science-intro': 3,
            'art-creative': 2,
            'physical-ed': 2
          },
          teacherAssignments: {
            'math-basic': 1,
            'english-basic': 3,
            'science-intro': 2
          },
          classTeacher: 3
        },
        {
          id: 'grade-1-b',
          name: 'Grade 1-B',
          type: 'subclass',
          parentId: 'grade-1',
          studentCount: 25,
          selectedSubjects: {
            'math-basic': true,
            'english-basic': true,
            'science-intro': true,
            'art-creative': true
          },
          weeklyHours: {
            'math-basic': 5,
            'english-basic': 6,
            'science-intro': 3,
            'art-creative': 2
          },
          teacherAssignments: {
            'math-basic': 1,
            'english-basic': 3,
            'science-intro': 2,
            'art-creative': 5
          },
          classTeacher: 1
        }
      ]
    },
    {
      id: 'grade-2',
      name: 'Grade 2',
      type: 'grade',
      selectedSubjects: {
        'math-intermediate': true,
        'english-intermediate': true,
        'science-basic': true,
        'social-studies': true
      },
      weeklyHours: {
        'math-intermediate': 6,
        'english-intermediate': 6,
        'science-basic': 4,
        'social-studies': 3
      },
      subclasses: [
        {
          id: 'grade-2-a',
          name: 'Grade 2-A',
          type: 'subclass',
          parentId: 'grade-2',
          studentCount: 30,
          selectedSubjects: {
            'math-intermediate': true,
            'english-intermediate': true,
            'science-basic': true,
            'social-studies': true,
            'physical-ed': true
          },
          weeklyHours: {
            'math-intermediate': 6,
            'english-intermediate': 6,
            'science-basic': 4,
            'social-studies': 3,
            'physical-ed': 2
          }
        }
      ]
    }
  ]);

  // Mock teachers data
  const [availableTeachers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      employeeId: "TCH001",
      email: "sarah.johnson@school.edu",
      phone: "+1 (555) 123-4567",
      maxHours: 30,
      currentHours: 24,
      subjects: ["Mathematics", "Statistics", "Calculus", "Basic Mathematics"]
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      employeeId: "TCH002",
      email: "michael.chen@school.edu",
      phone: "+1 (555) 234-5678",
      maxHours: 25,
      currentHours: 25,
      subjects: ["Physics", "Chemistry", "Science", "Introduction to Science", "Basic Science"]
    },
    {
      id: 3,
      name: "Ms. Emily Rodriguez",
      employeeId: "TCH003",
      email: "emily.rodriguez@school.edu",
      phone: "+1 (555) 345-6789",
      maxHours: 28,
      currentHours: 18,
      subjects: ["English Literature", "Creative Writing", "Grammar", "Basic English", "Intermediate English"]
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      employeeId: "TCH004",
      email: "james.wilson@school.edu",
      phone: "+1 (555) 456-7890",
      maxHours: 32,
      currentHours: 20,
      subjects: ["History", "Social Studies", "Geography"]
    },
    {
      id: 5,
      name: "Ms. Lisa Thompson",
      employeeId: "TCH005",
      email: "lisa.thompson@school.edu",
      phone: "+1 (555) 567-8901",
      maxHours: 26,
      currentHours: 22,
      subjects: ["Art", "Music", "Drama", "Creative Arts"]
    },
    {
      id: 6,
      name: "Mr. David Kumar",
      employeeId: "TCH006",
      email: "david.kumar@school.edu",
      phone: "+1 (555) 678-9012",
      maxHours: 30,
      currentHours: 15,
      subjects: ["Computer Science", "Programming", "Web Development", "Computer Basics"]
    }
  ]);

  // Mock subjects data
  const [availableSubjects] = useState([
    {
      id: 'math-basic',
      name: 'Basic Mathematics',
      category: 'Core',
      defaultHours: 5,
      description: 'Fundamental mathematical concepts and operations'
    },
    {
      id: 'math-intermediate',
      name: 'Intermediate Mathematics',
      category: 'Core',
      defaultHours: 6,
      description: 'Advanced mathematical concepts including algebra and geometry'
    },
    {
      id: 'english-basic',
      name: 'Basic English',
      category: 'Core',
      defaultHours: 6,
      description: 'Reading, writing, and communication skills development'
    },
    {
      id: 'english-intermediate',
      name: 'Intermediate English',
      category: 'Core',
      defaultHours: 6,
      description: 'Literature analysis and advanced writing techniques'
    },
    {
      id: 'science-intro',
      name: 'Introduction to Science',
      category: 'Science',
      defaultHours: 3,
      description: 'Basic scientific concepts and observation skills'
    },
    {
      id: 'science-basic',
      name: 'Basic Science',
      category: 'Science',
      defaultHours: 4,
      description: 'Elementary physics, chemistry, and biology concepts'
    },
    {
      id: 'social-studies',
      name: 'Social Studies',
      category: 'Core',
      defaultHours: 3,
      description: 'History, geography, and civic education'
    },
    {
      id: 'art-creative',
      name: 'Creative Arts',
      category: 'Arts',
      defaultHours: 2,
      description: 'Visual arts, crafts, and creative expression'
    },
    {
      id: 'physical-ed',
      name: 'Physical Education',
      category: 'Physical',
      defaultHours: 2,
      description: 'Sports, fitness, and health education'
    },
    {
      id: 'music',
      name: 'Music',
      category: 'Arts',
      defaultHours: 2,
      description: 'Musical education and appreciation'
    },
    {
      id: 'computer-basics',
      name: 'Computer Basics',
      category: 'Elective',
      defaultHours: 2,
      description: 'Introduction to computers and basic digital literacy'
    },
    {
      id: 'library-skills',
      name: 'Library Skills',
      category: 'Elective',
      defaultHours: 1,
      description: 'Research skills and information literacy'
    },
    {
      id: 'environmental-science',
      name: 'Environmental Science',
      category: 'Science',
      defaultHours: 2,
      description: 'Environmental awareness and conservation'
    },
    {
      id: 'moral-education',
      name: 'Moral Education',
      category: 'Core',
      defaultHours: 1,
      description: 'Ethics, values, and character development'
    },
    {
      id: 'second-language',
      name: 'Second Language',
      category: 'Core',
      defaultHours: 3,
      description: 'Foreign language learning and communication'
    }
  ]);

  // Setup progress steps
  const setupSteps = [
    { id: 'teachers', label: 'Teachers', description: 'Manage teacher profiles' },
    { id: 'classes', label: 'Classes', description: 'Configure class structure' },
    { id: 'rules', label: 'Rules', description: 'Set scheduling constraints' },
    { id: 'generate', label: 'Generate', description: 'Create timetables' }
  ];

  // Quick actions for this page
  const quickActions = [
    {
      id: 'add-grade',
      label: 'Add Grade',
      description: 'Create new grade level',
      icon: 'GraduationCap',
      color: 'primary'
    },
    {
      id: 'bulk-operations',
      label: 'Bulk Operations',
      description: 'Apply changes to multiple classes',
      icon: 'Layers',
      color: 'secondary'
    },
    {
      id: 'import-config',
      label: 'Import Configuration',
      description: 'Load class setup from file',
      icon: 'Upload',
      color: 'accent'
    },
    {
      id: 'export-config',
      label: 'Export Configuration',
      description: 'Save current setup',
      icon: 'Download',
      color: 'success'
    }
  ];

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Event handlers
  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    if (isMobileView) {
      setActivePanel('form');
    }
  };

  const handleAddGrade = () => {
    const newGrade = {
      id: `grade-${Date.now()}`,
      name: `Grade ${grades.length + 1}`,
      type: 'grade',
      selectedSubjects: {},
      weeklyHours: {},
      subclasses: []
    };
    setGrades(prev => [...prev, newGrade]);
    setSelectedClass(newGrade);
  };

  const handleAddSubclass = (gradeId) => {
    const grade = grades.find(g => g.id === gradeId);
    if (grade) {
      const newSubclass = {
        id: `${gradeId}-${Date.now()}`,
        name: `${grade.name}-${String.fromCharCode(65 + (grade.subclasses?.length || 0))}`,
        type: 'subclass',
        parentId: gradeId,
        studentCount: 25,
        selectedSubjects: { ...grade.selectedSubjects },
        weeklyHours: { ...grade.weeklyHours }
      };

      setGrades(prev => prev.map(g => 
        g.id === gradeId 
          ? { ...g, subclasses: [...(g.subclasses || []), newSubclass] }
          : g
      ));
      setSelectedClass(newSubclass);
    }
  };

  const handleDeleteClass = (classId) => {
    setGrades(prev => prev.map(grade => ({
      ...grade,
      subclasses: grade.subclasses?.filter(sub => sub.id !== classId) || []
    })).filter(grade => grade.id !== classId));
    
    if (selectedClass?.id === classId) {
      setSelectedClass(null);
    }
  };

  const handleReorderClasses = (draggedItem, targetItem) => {
    // Implementation for drag-and-drop reordering
    console.log('Reorder:', draggedItem, targetItem);
  };

  const handleUpdateClass = (updatedClass) => {
    if (updatedClass.type === 'grade') {
      setGrades(prev => prev.map(grade => 
        grade.id === updatedClass.id ? updatedClass : grade
      ));
    } else {
      setGrades(prev => prev.map(grade => ({
        ...grade,
        subclasses: grade.subclasses?.map(sub => 
          sub.id === updatedClass.id ? updatedClass : sub
        ) || []
      })));
    }
    setSelectedClass(updatedClass);
  };

  const handleSaveConfiguration = (classData) => {
    console.log('Configuration saved:', classData);
    // In real app, this would save to backend
  };

  const handleAddSubject = (subject) => {
    console.log('Add subject:', subject);
    // In real app, this would add to subject library
  };

  const handleEditSubject = (subject) => {
    console.log('Edit subject:', subject);
  };

  const handleDeleteSubject = (subjectId) => {
    console.log('Delete subject:', subjectId);
  };

  const handleQuickAdd = (subject) => {
    if (selectedClass) {
      const updatedClass = {
        ...selectedClass,
        selectedSubjects: {
          ...selectedClass.selectedSubjects,
          [subject.id]: true
        },
        weeklyHours: {
          ...selectedClass.weeklyHours,
          [subject.id]: subject.defaultHours
        }
      };
      handleUpdateClass(updatedClass);
    }
  };

  const handleQuickAction = (action) => {
    switch (action.id) {
      case 'add-grade':
        handleAddGrade();
        break;
      case 'bulk-operations':
        setShowBulkOperations(true);
        break;
      case 'import-config': console.log('Import configuration');
        break;
      case 'export-config':
        console.log('Export configuration');
        break;
      default:
        console.log('Unknown action:', action.id);
    }
  };

  const handleBulkCopyConfiguration = (sourceClassId, targetClassIds) => {
    console.log('Bulk copy from', sourceClassId, 'to', targetClassIds);
  };

  const handleBulkUpdateSubjects = (classIds) => {
    console.log('Bulk update subjects for', classIds);
  };

  const handleBulkUpdateHours = (classIds, hoursUpdate) => {
    console.log('Bulk update hours for', classIds, hoursUpdate);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Mobile panel navigation
  const renderMobileNavigation = () => (
    <div className="lg:hidden bg-card border-b border-border p-4">
      <div className="flex space-x-2">
        <Button
          variant={activePanel === 'tree' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActivePanel('tree')}
          iconName="TreePine"
          iconPosition="left"
        >
          Structure
        </Button>
        <Button
          variant={activePanel === 'form' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActivePanel('form')}
          iconName="Settings"
          iconPosition="left"
          disabled={!selectedClass}
        >
          Configure
        </Button>
        <Button
          variant={activePanel === 'library' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActivePanel('library')}
          iconName="BookOpen"
          iconPosition="left"
        >
          Subjects
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Class & Subject Configuration
                </h1>
                <p className="text-muted-foreground">
                  Set up grade hierarchies, create sections, and configure subject requirements with weekly hour allocations
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  onClick={() => handleNavigation('/teacher-management')}
                >
                  Previous Step
                </Button>
                <Button
                  variant="default"
                  iconName="ArrowRight"
                  iconPosition="right"
                  onClick={() => handleNavigation('/visual-rule-builder')}
                >
                  Next Step
                </Button>
              </div>
            </div>

            {/* Progress Indicator */}
            <ProgressIndicator
              steps={setupSteps}
              currentStep={1}
              size="default"
              className="mb-6"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <QuickActionMenu
              actions={quickActions}
              variant="grid"
              onActionClick={handleQuickAction}
            />
          </div>

          {/* Mobile Navigation */}
          {renderMobileNavigation()}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-20rem)]">
            {/* Left Panel - Class Tree Navigation */}
            <div className={`
              lg:col-span-3
              ${isMobileView ? (activePanel === 'tree' ? 'block' : 'hidden') : 'block'}
            `}>
              <ClassTreeNavigation
                grades={grades}
                selectedClass={selectedClass}
                onClassSelect={handleClassSelect}
                onAddGrade={handleAddGrade}
                onAddSubclass={handleAddSubclass}
                onDeleteClass={handleDeleteClass}
                onReorderClasses={handleReorderClasses}
              />
            </div>

            {/* Center Panel - Configuration Form */}
            <div className={`
              lg:col-span-6
              ${isMobileView ? (activePanel === 'form' ? 'block' : 'hidden') : 'block'}
            `}>
              <ClassConfigurationForm
                selectedClass={selectedClass}
                availableSubjects={availableSubjects}
                availableTeachers={availableTeachers}
                onUpdateClass={handleUpdateClass}
                onSaveConfiguration={handleSaveConfiguration}
                maxWeeklyHours={35}
              />
            </div>

            {/* Right Panel - Subject Library */}
            <div className={`
              lg:col-span-3
              ${isMobileView ? (activePanel === 'library' ? 'block' : 'hidden') : 'block'}
            `}>
              <SubjectLibrary
                subjects={availableSubjects}
                onAddSubject={handleAddSubject}
                onEditSubject={handleEditSubject}
                onDeleteSubject={handleDeleteSubject}
                selectedSubjects={selectedClass?.selectedSubjects || {}}
                onQuickAdd={handleQuickAdd}
              />
            </div>
          </div>

          {/* Bulk Operations Modal */}
          <BulkOperationsPanel
            grades={grades}
            onBulkCopyConfiguration={handleBulkCopyConfiguration}
            onBulkUpdateSubjects={handleBulkUpdateSubjects}
            onBulkUpdateHours={handleBulkUpdateHours}
            isVisible={showBulkOperations}
            onClose={() => setShowBulkOperations(false)}
          />
        </div>
      </main>
    </div>
  );
};

export default ClassSubjectConfiguration;