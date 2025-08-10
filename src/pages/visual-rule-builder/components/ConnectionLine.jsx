import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionLine = ({ from, to, type = 'and', onDelete }) => {
  // Calculate line path
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  // Create SVG path for curved connection
  const path = `M ${from.x} ${from.y} Q ${midX} ${from.y} ${midX} ${midY} Q ${midX} ${to.y} ${to.x} ${to.y}`;

  const getConnectionColor = (type) => {
    const colorMap = {
      'and': '#3b82f6', // blue
      'or': '#f59e0b',  // amber
      'not': '#ef4444'  // red
    };
    return colorMap[type] || colorMap.and;
  };

  const getConnectionIcon = (type) => {
    const iconMap = {
      'and': 'Plus',
      'or': 'GitBranch',
      'not': 'X'
    };
    return iconMap[type] || iconMap.and;
  };

  return (
    <g>
      {/* Connection Line */}
      <path
        d={path}
        stroke={getConnectionColor(type)}
        strokeWidth="2"
        fill="none"
        strokeDasharray={type === 'not' ? '5,5' : 'none'}
        className="hover:stroke-width-3 transition-all duration-200"
      />
      
      {/* Logic Operator Badge */}
      <g transform={`translate(${midX - 15}, ${midY - 15})`}>
        <circle
          cx="15"
          cy="15"
          r="15"
          fill={getConnectionColor(type)}
          className="hover:r-18 transition-all duration-200 cursor-pointer"
          onClick={onDelete}
        />
        <foreignObject x="3" y="3" width="24" height="24">
          <div className="w-6 h-6 flex items-center justify-center">
            <Icon 
              name={getConnectionIcon(type)} 
              size={12} 
              color="white" 
            />
          </div>
        </foreignObject>
        
        {/* Delete Button (appears on hover) */}
        <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
          <circle
            cx="25"
            cy="5"
            r="8"
            fill="#ef4444"
            className="cursor-pointer"
            onClick={onDelete}
          />
          <foreignObject x="21" y="1" width="8" height="8">
            <div className="w-2 h-2 flex items-center justify-center">
              <Icon name="X" size={6} color="white" />
            </div>
          </foreignObject>
        </g>
      </g>
      
      {/* Connection Points */}
      <circle
        cx={from.x}
        cy={from.y}
        r="4"
        fill={getConnectionColor(type)}
        className="hover:r-6 transition-all duration-200"
      />
      <circle
        cx={to.x}
        cy={to.y}
        r="4"
        fill={getConnectionColor(type)}
        className="hover:r-6 transition-all duration-200"
      />
    </g>
  );
};

export default ConnectionLine;