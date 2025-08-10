import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import page-specific components
import GenerationControlPanel from './components/GenerationControlPanel';
import TimetableGrid from './components/TimetableGrid';
import VersionControlPanel from './components/VersionControlPanel';
import GenerationStatistics from './components/GenerationStatistics';
import ConflictResolutionPanel from './components/ConflictResolutionPanel';

const TimetableGenerator = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('class');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timetableData, setTimetableData] = useState({});
  const [statistics, setStatistics] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [violations, setViolations] = useState([]);

  const setupSteps = [
    { id: 'teachers', label: 'Teachers', description: 'Teacher profiles configured' },
    { id: 'classes', label: 'Classes', description: 'Class structure defined' },
    { id: 'rules', label: 'Rules', description: 'Constraints established' },
    { id: 'generate', label: 'Generate', description: 'Timetable creation' }
  ];

  const viewTabs = [
    { id: 'class', label: 'Class View', icon: 'BookOpen', description: 'View by class schedules' },
    { id: 'teacher', label: 'Teacher View', icon: 'Users', description: 'View by teacher schedules' }
  ];

  useEffect(() => {
    // Simulate checking setup completion
    const checkSetupStatus = () => {
      // In real app, this would check actual setup status
      return true;
    };

    if (!checkSetupStatus()) {
      navigate('/teacher-management');
    }
  }, [navigate]);

  const handleGenerate = async (parameters) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation process
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Mock generated data
          setTimetableData({
            'Grade 10A': {
              'Monday': {
                '08:00 - 08:45': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', color: 'bg-blue-100 text-blue-800' },
                '08:45 - 09:30': { subject: 'Physics', teacher: 'Prof. Johnson', room: 'Lab 1', color: 'bg-green-100 text-green-800' }
              }
            }
          });
          
          setStatistics({
            totalPeriods: 450,
            assignedPeriods: 432,
            unassignedPeriods: 18,
            constraintSatisfaction: 96,
            teacherUtilization: 87,
            roomUtilization: 92,
            generationTime: 3.2,
            iterations: 847,
            conflicts: 3
          });
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleCellEdit = (cellData) => {
    setHasChanges(true);
    // Handle cell editing logic
  };

  const handleDragDrop = (source, target) => {
    setHasChanges(true);
    // Handle drag and drop logic
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
    }, 1500);
  };

  const handleRevertChanges = () => {
    setHasChanges(false);
    // Revert to original data
  };

  const handleExport = (options) => {
    // Handle export logic
    console.log('Exporting:', options);
  };

  const handleResolveConflict = (conflictId, suggestionId) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    setHasChanges(true);
  };

  const handleApplySuggestion = (suggestionId) => {
    // Apply suggestion logic
  };

  const handleManualOverride = (conflictId) => {
    // Manual override logic
  };

  const handleParameterChange = (parameters) => {
    // Handle parameter changes
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:ml-60 pt-16">
          <div className="p-6">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Timetable Generator</h1>
                <p className="text-muted-foreground">
                  Generate optimized schedules with automated constraint solving
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/visual-rule-builder')}
                  iconName="Settings"
                >
                  Configure Rules
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/export-reports')}
                  iconName="Download"
                >
                  Export Options
                </Button>
              </div>
            </div>

            {/* Setup Progress */}
            <div className="mb-6">
              <ProgressIndicator 
                steps={setupSteps}
                currentStep={3}
                variant="horizontal"
                size="default"
              />
            </div>

            {/* Generation Control Panel */}
            <GenerationControlPanel
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              progress={generationProgress}
              onParameterChange={handleParameterChange}
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Content Area */}
              <div className="xl:col-span-3 space-y-6">
                {/* View Tabs */}
                <div className="bg-card border border-border rounded-lg">
                  <div className="border-b border-border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex space-x-1">
                        {viewTabs.map((tab) => (
                          <Button
                            key={tab.id}
                            variant={activeView === tab.id ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveView(tab.id)}
                            iconName={tab.icon}
                            iconPosition="left"
                            className="h-10"
                          >
                            {tab.label}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Info" size={16} />
                        <span>Drag periods to edit, click for details</span>
                      </div>
                    </div>
                  </div>

                  {/* Timetable Grid */}
                  <div className="p-4">
                    <TimetableGrid
                      viewMode={activeView}
                      timetableData={timetableData}
                      onCellEdit={handleCellEdit}
                      onDragDrop={handleDragDrop}
                      violations={violations}
                    />
                  </div>
                </div>

                {/* Generation Statistics */}
                <GenerationStatistics
                  statistics={statistics}
                  violations={violations}
                  isGenerating={isGenerating}
                />

                {/* Conflict Resolution */}
                <ConflictResolutionPanel
                  conflicts={conflicts}
                  onResolveConflict={handleResolveConflict}
                  onApplySuggestion={handleApplySuggestion}
                  onManualOverride={handleManualOverride}
                />
              </div>

              {/* Right Sidebar */}
              <div className="xl:col-span-1">
                <VersionControlPanel
                  hasChanges={hasChanges}
                  onSave={handleSaveChanges}
                  onRevert={handleRevertChanges}
                  onExport={handleExport}
                  isSaving={isSaving}
                />
              </div>
            </div>

            {/* Mobile View Optimization */}
            <div className="lg:hidden mt-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="Smartphone" size={20} className="text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">Mobile Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      Swipe between days, tap for period details
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" iconName="SwipeLeft">
                    Previous Day
                  </Button>
                  <Button variant="outline" size="sm" iconName="SwipeRight">
                    Next Day
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimetableGenerator;