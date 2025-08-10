import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import RuleBlock from './RuleBlock';
import ConnectionLine from './ConnectionLine';

const RuleCanvas = ({ 
  blocks = [], 
  connections = [], 
  onBlockAdd, 
  onBlockUpdate, 
  onBlockDelete,
  onConnectionAdd,
  onConnectionDelete,
  selectedBlocks = [],
  onBlockSelect
}) => {
  const canvasRef = useRef(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / zoom;
    const y = (e.clientY - rect.top - canvasOffset.y) / zoom;

    try {
      const ruleData = JSON.parse(e.dataTransfer.getData('application/json'));
      const newBlock = {
        id: Date.now().toString(),
        ...ruleData,
        position: { x, y },
        parameters: ruleData.parameters?.map(param => ({
          ...param,
          value: param.default || ''
        })) || []
      };
      onBlockAdd(newBlock);
    } catch (error) {
      console.error('Error parsing dropped rule:', error);
    }
  }, [canvasOffset, zoom, onBlockAdd]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleBlockDragStart = useCallback((block, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedBlock(block);
  }, []);

  const handleBlockDrag = useCallback((e) => {
    if (!draggedBlock || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - dragOffset.x - canvasOffset.x) / zoom;
    const y = (e.clientY - rect.top - dragOffset.y - canvasOffset.y) / zoom;

    const updatedBlock = {
      ...draggedBlock,
      position: { x: Math.max(0, x), y: Math.max(0, y) }
    };

    onBlockUpdate(updatedBlock);
  }, [draggedBlock, dragOffset, canvasOffset, zoom, onBlockUpdate]);

  const handleBlockDragEnd = useCallback(() => {
    setDraggedBlock(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleConnection = useCallback((blockId, type) => {
    if (!isConnecting) {
      setIsConnecting(true);
      setConnectionStart({ blockId, type });
    } else {
      if (connectionStart && connectionStart.blockId !== blockId) {
        const newConnection = {
          id: Date.now().toString(),
          from: connectionStart.type === 'output' ? connectionStart.blockId : blockId,
          to: connectionStart.type === 'output' ? blockId : connectionStart.blockId,
          type: 'and' // Default logic type
        };
        onConnectionAdd(newConnection);
      }
      setIsConnecting(false);
      setConnectionStart(null);
    }
  }, [isConnecting, connectionStart, onConnectionAdd]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      onBlockSelect([]);
      setIsConnecting(false);
      setConnectionStart(null);
    }
  }, [onBlockSelect]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleCanvasPan = useCallback((e) => {
    if (e.buttons === 1 && e.target === canvasRef.current) {
      setCanvasOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBlockSelect([])}
            iconName="MousePointer"
            iconPosition="left"
          >
            Select
          </Button>
          <Button
            variant={isConnecting ? "default" : "outline"}
            size="sm"
            onClick={() => setIsConnecting(!isConnecting)}
            iconName="GitBranch"
            iconPosition="left"
          >
            Connect
          </Button>
          <div className="w-px h-6 bg-border" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            iconName="ZoomOut"
          />
          <span className="text-sm text-muted-foreground min-w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            iconName="ZoomIn"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            iconName="RotateCcw"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {blocks.length} blocks, {connections.length} connections
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="Save"
            iconPosition="left"
          >
            Save Rules
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative cursor-move"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasPan}
          style={{
            backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
          }}
        >
          {/* Canvas Content */}
          <div
            style={{
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {/* Connection Lines */}
            {connections.map(connection => {
              const fromBlock = blocks.find(b => b.id === connection.from);
              const toBlock = blocks.find(b => b.id === connection.to);
              if (!fromBlock || !toBlock) return null;

              return (
                <ConnectionLine
                  key={connection.id}
                  from={{
                    x: fromBlock.position.x + 192, // Block width
                    y: fromBlock.position.y + 40   // Half block height
                  }}
                  to={{
                    x: toBlock.position.x,
                    y: toBlock.position.y + 40
                  }}
                  type={connection.type}
                  onDelete={() => onConnectionDelete(connection.id)}
                />
              );
            })}

            {/* Rule Blocks */}
            {blocks.map(block => (
              <div
                key={block.id}
                onMouseDown={(e) => handleBlockDragStart(block, e)}
                onMouseMove={handleBlockDrag}
                onMouseUp={handleBlockDragEnd}
                onClick={(e) => {
                  e.stopPropagation();
                  onBlockSelect([block.id]);
                }}
              >
                <RuleBlock
                  block={block}
                  isSelected={selectedBlocks.includes(block.id)}
                  isDragging={draggedBlock?.id === block.id}
                  position={block.position}
                  onEdit={(block) => console.log('Edit block:', block)}
                  onDelete={onBlockDelete}
                  onConnect={handleConnection}
                />
              </div>
            ))}

            {/* Connection Preview */}
            {isConnecting && connectionStart && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
                  <div className="bg-primary/10 px-4 py-2 rounded-lg">
                    <p className="text-primary font-medium">
                      Click another block to create connection
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {blocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Icon name="Puzzle" size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Start Building Rules
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag rule blocks from the library to create scheduling constraints. 
                  Connect blocks with logic operators to build complex rules.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="MousePointer" size={16} />
                    <span>Drag to add</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="GitBranch" size={16} />
                    <span>Click to connect</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Canvas: {Math.round(canvasOffset.x)}, {Math.round(canvasOffset.y)}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
        <div className="flex items-center space-x-4">
          {isConnecting && (
            <span className="text-primary font-medium">Connection mode active</span>
          )}
          <span>Last saved: 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default RuleCanvas;