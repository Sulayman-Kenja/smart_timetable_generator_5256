import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConflictResolutionPanel = ({ 
  conflicts = [],
  onResolveConflict = () => {},
  onApplySuggestion = () => {},
  onManualOverride = () => {}
}) => {
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  const mockConflicts = [
    {
      id: 'conflict-1',
      type: 'teacher_double_booking',
      severity: 'high',
      description: 'Dr. Smith is scheduled for Mathematics in Grade 10A and Physics in Grade 11B at the same time',
      entities: ['Dr. Smith', 'Grade 10A', 'Grade 11B'],
      timeSlot: 'Monday 08:00 - 08:45',
      suggestions: [
        {
          id: 'suggestion-1',
          type: 'reschedule',
          description: 'Move Physics class to Tuesday 08:00 - 08:45',
          impact: 'Low impact - No other conflicts',
          confidence: 95
        },
        {
          id: 'suggestion-2',
          type: 'substitute',
          description: 'Assign Prof. Johnson to teach Physics in Grade 11B',
          impact: 'Medium impact - Prof. Johnson has 2 free periods',
          confidence: 87
        }
      ]
    },
    {
      id: 'conflict-2',
      type: 'room_unavailable',
      severity: 'medium',
      description: 'Lab 1 is assigned to both Chemistry and Physics classes',
      entities: ['Lab 1', 'Grade 10A Chemistry', 'Grade 11A Physics'],
      timeSlot: 'Tuesday 10:30 - 11:15',
      suggestions: [
        {
          id: 'suggestion-3',
          type: 'room_change',
          description: 'Move Chemistry class to Lab 2',
          impact: 'No impact - Lab 2 is available',
          confidence: 98
        }
      ]
    },
    {
      id: 'conflict-3',
      type: 'constraint_violation',
      severity: 'low',
      description: 'Grade 9A has more than 6 periods per day',
      entities: ['Grade 9A'],
      timeSlot: 'Wednesday',
      suggestions: [
        {
          id: 'suggestion-4',
          type: 'redistribute',
          description: 'Move one period to Thursday',
          impact: 'Low impact - Thursday has capacity',
          confidence: 92
        }
      ]
    }
  ];

  const conflictData = conflicts.length > 0 ? conflicts : mockConflicts;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'AlertCircle';
    }
  };

  const handleResolveConflict = (conflictId, suggestionId) => {
    onResolveConflict(conflictId, suggestionId);
    setShowResolutionModal(false);
    setSelectedConflict(null);
  };

  const openResolutionModal = (conflict) => {
    setSelectedConflict(conflict);
    setShowResolutionModal(true);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-error/10 rounded-lg">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Conflict Resolution</h3>
              <p className="text-sm text-muted-foreground">
                {conflictData.length} conflicts detected
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="RefreshCw">
              Re-analyze
            </Button>
            <Button variant="default" size="sm" iconName="Zap">
              Auto-resolve
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {conflictData.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">No Conflicts Detected</h4>
            <p className="text-sm text-muted-foreground">
              All constraints are satisfied in the current timetable
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conflictData.map((conflict) => (
              <div 
                key={conflict.id}
                className={`border rounded-lg p-4 ${getSeverityColor(conflict.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={getSeverityIcon(conflict.severity)} 
                      size={20} 
                      className="mt-0.5" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {conflict.type.replace('_', ' ').toUpperCase()}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(conflict.severity)}`}>
                          {conflict.severity}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{conflict.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{conflict.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Users" size={12} />
                          <span>{conflict.entities.length} entities affected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openResolutionModal(conflict)}
                    iconName="Settings"
                  >
                    Resolve
                  </Button>
                </div>

                {/* Quick Suggestions */}
                {conflict.suggestions.length > 0 && (
                  <div className="border-t border-current/20 pt-3 mt-3">
                    <p className="text-xs font-medium mb-2">Quick Suggestions:</p>
                    <div className="space-y-2">
                      {conflict.suggestions.slice(0, 2).map((suggestion) => (
                        <div key={suggestion.id} className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <div className="flex-1">
                            <p className="text-xs font-medium">{suggestion.description}</p>
                            <p className="text-xs opacity-75">{suggestion.impact}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium">{suggestion.confidence}%</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResolveConflict(conflict.id, suggestion.id)}
                              className="h-6 px-2 text-xs"
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && selectedConflict && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Resolve Conflict</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowResolutionModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-2">Conflict Details</h4>
                <p className="text-sm text-muted-foreground mb-4">{selectedConflict.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Time Slot:</span>
                    <p className="text-muted-foreground">{selectedConflict.timeSlot}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Affected Entities:</span>
                    <p className="text-muted-foreground">{selectedConflict.entities.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Resolution Options</h4>
                {selectedConflict.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground mb-1">{suggestion.description}</h5>
                        <p className="text-sm text-muted-foreground mb-2">{suggestion.impact}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-16 bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-success h-1.5 rounded-full"
                                style={{ width: `${suggestion.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-success">{suggestion.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleResolveConflict(selectedConflict.id, suggestion.id)}
                      >
                        Apply Solution
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border border-border rounded-lg p-4 bg-muted/20">
                  <h5 className="font-medium text-foreground mb-2">Manual Override</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Manually resolve this conflict by editing the timetable directly
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManualOverride(selectedConflict.id)}
                    iconName="Edit"
                  >
                    Edit Manually
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictResolutionPanel;