import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RuleBlock = ({ 
  block, 
  onEdit, 
  onDelete, 
  onConnect, 
  isSelected = false,
  isDragging = false,
  position = { x: 0, y: 0 }
}) => {
  const getBlockColor = (type) => {
    const colorMap = {
      'time': 'bg-blue-50 border-blue-200 text-blue-800',
      'teacher': 'bg-green-50 border-green-200 text-green-800',
      'subject': 'bg-purple-50 border-purple-200 text-purple-800',
      'grouping': 'bg-orange-50 border-orange-200 text-orange-800',
      'logic': 'bg-gray-50 border-gray-200 text-gray-800'
    };
    return colorMap[type] || colorMap.logic;
  };

  const getBlockIcon = (type) => {
    const iconMap = {
      'time': 'Clock',
      'teacher': 'User',
      'subject': 'BookOpen',
      'grouping': 'Users',
      'logic': 'GitBranch'
    };
    return iconMap[type] || 'Square';
  };

  return (
    <div 
      className={`
        relative p-4 rounded-lg border-2 cursor-move transition-all duration-200
        ${getBlockColor(block.type)}
        ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
        ${isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'}
        min-w-48 max-w-64
      `}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 1000 : 1
      }}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={getBlockIcon(block.type)} size={16} />
          <span className="font-medium text-sm">{block.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onEdit(block)}
            className="h-6 w-6 p-0 hover:bg-white/50"
          >
            <Icon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onDelete(block.id)}
            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      </div>

      {/* Block Content */}
      <div className="space-y-2 text-xs">
        {block.parameters?.map((param, index) => (
          <div key={index} className="flex justify-between">
            <span className="opacity-70">{param.label}:</span>
            <span className="font-medium">{param.value}</span>
          </div>
        ))}
      </div>

      {/* Connection Points */}
      {block.type !== 'logic' && (
        <>
          <div 
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-current rounded-full cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onConnect(block.id, 'output')}
          />
          <div 
            className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-current rounded-full cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onConnect(block.id, 'input')}
          />
        </>
      )}

      {/* Block ID for debugging */}
      <div className="absolute -top-2 -left-2 w-5 h-5 bg-gray-800 text-white text-xs rounded-full flex items-center justify-center">
        {block.id}
      </div>
    </div>
  );
};

export default RuleBlock;