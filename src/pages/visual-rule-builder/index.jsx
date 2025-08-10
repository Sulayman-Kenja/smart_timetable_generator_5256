import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RuleLibrary from './components/RuleLibrary';
import RuleCanvas from './components/RuleCanvas';
import RulePreview from './components/RulePreview';
import RuleToolbar from './components/RuleToolbar';

const VisualRuleBuilder = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Mock data for progress indicator
  const progressSteps = [
    { id: 'teachers', label: 'Teachers', description: 'Manage teacher profiles' },
    { id: 'classes', label: 'Classes', description: 'Configure class structure' },
    { id: 'rules', label: 'Rules', description: 'Build scheduling constraints' },
    { id: 'generate', label: 'Generate', description: 'Create timetable' },
    { id: 'export', label: 'Export', description: 'Download results' }
  ];

  // Save state to history for undo/redo
  const saveToHistory = useCallback(() => {
    const newState = { blocks: [...blocks], connections: [...connections] };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [blocks, connections, history, historyIndex]);

  // Block management
  const handleBlockAdd = useCallback((newBlock) => {
    setBlocks(prev => [...prev, newBlock]);
    saveToHistory();
  }, [saveToHistory]);

  const handleBlockUpdate = useCallback((updatedBlock) => {
    setBlocks(prev => prev.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  }, []);

  const handleBlockDelete = useCallback((blockId) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== blockId && conn.to !== blockId
    ));
    setSelectedBlocks(prev => prev.filter(id => id !== blockId));
    saveToHistory();
  }, [saveToHistory]);

  // Connection management
  const handleConnectionAdd = useCallback((newConnection) => {
    setConnections(prev => [...prev, newConnection]);
    saveToHistory();
  }, [saveToHistory]);

  const handleConnectionDelete = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    saveToHistory();
  }, [saveToHistory]);

  // Toolbar actions
  const handleSave = useCallback(() => {
    const ruleData = {
      blocks,
      connections,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0',
        description: 'Custom scheduling rules'
      }
    };
    
    // In real app, this would save to backend
    const dataStr = JSON.stringify(ruleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scheduling-rules-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [blocks, connections]);

  const handleLoad = useCallback(() => {
    // Mock loading - in real app, this would open file dialog or load from backend
    const mockRules = {
      blocks: [
        {
          id: 'demo-1',
          name: 'Max Daily Hours',
          type: 'time',
          position: { x: 100, y: 100 },
          parameters: [
            { label: 'Max Hours', value: '6' },
            { label: 'Apply To', value: 'All Teachers' }
          ]
        },
        {
          id: 'demo-2',
          name: 'Subject Spacing',
          type: 'subject',
          position: { x: 400, y: 200 },
          parameters: [
            { label: 'Subject', value: 'Mathematics' },
            { label: 'Min Gap', value: '2' },
            { label: 'Unit', value: 'Periods' }
          ]
        }
      ],
      connections: [
        {
          id: 'conn-1',
          from: 'demo-1',
          to: 'demo-2',
          type: 'and'
        }
      ]
    };
    
    setBlocks(mockRules.blocks);
    setConnections(mockRules.connections);
    saveToHistory();
  }, [saveToHistory]);

  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all rules? This action cannot be undone.')) {
      setBlocks([]);
      setConnections([]);
      setSelectedBlocks([]);
      saveToHistory();
    }
  }, [saveToHistory]);

  const handleExport = useCallback(() => {
    const exportData = {
      rules: blocks.map(block => ({
        name: block.name,
        type: block.type,
        parameters: block.parameters,
        description: `${block.name} constraint for scheduling`
      })),
      connections: connections.map(conn => ({
        type: conn.type,
        description: `Logical ${conn.type} connection between rules`
      })),
      summary: {
        totalRules: blocks.length,
        totalConnections: connections.length,
        exportDate: new Date().toISOString()
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rule-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [blocks, connections]);

  const handleImport = useCallback((importedData) => {
    if (importedData.blocks && importedData.connections) {
      setBlocks(importedData.blocks);
      setConnections(importedData.connections);
      saveToHistory();
    }
  }, [saveToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setBlocks(prevState.blocks);
      setConnections(prevState.connections);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setBlocks(nextState.blocks);
      setConnections(nextState.connections);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const handleQuickAction = (action) => {
    if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-60 pt-16">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <Breadcrumb />
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Visual Rule Builder
                  </h1>
                  <p className="text-muted-foreground">
                    Create complex scheduling constraints through intuitive drag-and-drop interface
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    iconName={showPreview ? "EyeOff" : "Eye"}
                    iconPosition="left"
                  >
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => navigate('/timetable-generator')}
                    iconName="Zap"
                    iconPosition="left"
                  >
                    Generate Timetable
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <ProgressIndicator 
                steps={progressSteps} 
                currentStep={2}
                size="sm"
              />
            </div>

            {/* Rule Builder Interface */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {/* Toolbar */}
              <RuleToolbar
                onSave={handleSave}
                onLoad={handleLoad}
                onClear={handleClear}
                onExport={handleExport}
                onImport={handleImport}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                ruleCount={blocks.length}
                connectionCount={connections.length}
              />

              {/* Main Workspace */}
              <div className="flex h-[600px]">
                {/* Rule Library */}
                <div className="w-80 flex-shrink-0">
                  <RuleLibrary
                    onDragStart={(rule) => console.log('Dragging rule:', rule)}
                  />
                </div>

                {/* Canvas Area */}
                <div className={`flex-1 ${showPreview ? 'w-1/2' : ''}`}>
                  <RuleCanvas
                    blocks={blocks}
                    connections={connections}
                    selectedBlocks={selectedBlocks}
                    onBlockAdd={handleBlockAdd}
                    onBlockUpdate={handleBlockUpdate}
                    onBlockDelete={handleBlockDelete}
                    onConnectionAdd={handleConnectionAdd}
                    onConnectionDelete={handleConnectionDelete}
                    onBlockSelect={setSelectedBlocks}
                  />
                </div>

                {/* Preview Panel */}
                {showPreview && (
                  <div className="w-80 flex-shrink-0">
                    <RulePreview
                      blocks={blocks}
                      connections={connections}
                      onClose={() => setShowPreview(false)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon name="Lightbulb" size={16} className="text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Getting Started</span>
                </div>
                <p className="text-sm text-blue-700">
                  Drag rule blocks from the library to the canvas. Connect them with logic operators to create complex constraints.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon name="Zap" size={16} className="text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Best Practices</span>
                </div>
                <p className="text-sm text-green-700">
                  Start with basic time and teacher constraints, then add subject-specific rules. Test rules before generating timetables.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Icon name="BookOpen" size={16} className="text-purple-600 mr-2" />
                  <span className="font-medium text-purple-800">Advanced Features</span>
                </div>
                <p className="text-sm text-purple-700">
                  Use templates for common scenarios, export rules for backup, and preview rule interpretation before applying.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisualRuleBuilder;