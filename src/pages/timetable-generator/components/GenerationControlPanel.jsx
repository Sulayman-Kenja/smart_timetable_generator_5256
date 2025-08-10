import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const GenerationControlPanel = ({ 
  onGenerate, 
  isGenerating = false, 
  progress = 0,
  onParameterChange = () => {} 
}) => {
  const [parameters, setParameters] = useState({
    algorithm: 'backtracking',
    maxIterations: 1000,
    constraintWeight: 'balanced',
    optimizationLevel: 'standard'
  });

  const algorithmOptions = [
    { value: 'backtracking', label: 'Backtracking Algorithm', description: 'Systematic constraint satisfaction' },
    { value: 'genetic', label: 'Genetic Algorithm', description: 'Evolutionary optimization approach' },
    { value: 'simulated_annealing', label: 'Simulated Annealing', description: 'Probabilistic optimization method' },
    { value: 'constraint_programming', label: 'Constraint Programming', description: 'Advanced constraint solver' }
  ];

  const constraintWeightOptions = [
    { value: 'teacher_priority', label: 'Teacher Priority', description: 'Prioritize teacher preferences' },
    { value: 'balanced', label: 'Balanced Approach', description: 'Equal weight to all constraints' },
    { value: 'room_optimization', label: 'Room Optimization', description: 'Minimize room conflicts' },
    { value: 'time_efficiency', label: 'Time Efficiency', description: 'Optimize time slot usage' }
  ];

  const optimizationOptions = [
    { value: 'fast', label: 'Fast Generation', description: 'Quick results with basic optimization' },
    { value: 'standard', label: 'Standard Quality', description: 'Balanced speed and quality' },
    { value: 'high_quality', label: 'High Quality', description: 'Maximum optimization, slower generation' }
  ];

  const handleParameterUpdate = (key, value) => {
    const updatedParams = { ...parameters, [key]: value };
    setParameters(updatedParams);
    onParameterChange(updatedParams);
  };

  const handleGenerate = () => {
    onGenerate(parameters);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Zap" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Generation Control Panel</h2>
            <p className="text-sm text-muted-foreground">Configure parameters and start timetable generation</p>
          </div>
        </div>
        
        {isGenerating && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">Generating...</span>
            </div>
            <div className="text-sm font-medium text-primary">{progress}%</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Select
          label="Algorithm"
          description="Choose generation algorithm"
          options={algorithmOptions}
          value={parameters.algorithm}
          onChange={(value) => handleParameterUpdate('algorithm', value)}
          disabled={isGenerating}
        />

        <Input
          label="Max Iterations"
          type="number"
          description="Maximum generation attempts"
          value={parameters.maxIterations}
          onChange={(e) => handleParameterUpdate('maxIterations', parseInt(e.target.value))}
          min={100}
          max={10000}
          disabled={isGenerating}
        />

        <Select
          label="Constraint Priority"
          description="Optimization focus area"
          options={constraintWeightOptions}
          value={parameters.constraintWeight}
          onChange={(value) => handleParameterUpdate('constraintWeight', value)}
          disabled={isGenerating}
        />

        <Select
          label="Quality Level"
          description="Generation quality vs speed"
          options={optimizationOptions}
          value={parameters.optimizationLevel}
          onChange={(value) => handleParameterUpdate('optimizationLevel', value)}
          disabled={isGenerating}
        />
      </div>

      {isGenerating && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Generation Progress</span>
            <span className="text-sm text-muted-foreground">{progress}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-smooth"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Processing constraints and optimizing schedule assignments...
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Est. Time: 2-5 minutes</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Database" size={16} />
            <span>45 Teachers, 120 Classes</span>
          </div>
        </div>

        <Button
          variant="default"
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          loading={isGenerating}
          iconName="Zap"
          iconPosition="left"
          className="min-w-48"
        >
          {isGenerating ? 'Generating Timetable...' : 'Generate Timetable'}
        </Button>
      </div>
    </div>
  );
};

export default GenerationControlPanel;