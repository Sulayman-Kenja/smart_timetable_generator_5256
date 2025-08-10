import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimetableGrid = ({ 
  viewMode = 'class',
  timetableData = {},
  onCellEdit = () => {},
  onDragDrop = () => {},
  violations = []
}) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const dragRef = useRef(null);

  const timeSlots = [
    '08:00 - 08:45',
    '08:45 - 09:30',
    '09:30 - 10:15',
    '10:15 - 10:30', // Break
    '10:30 - 11:15',
    '11:15 - 12:00',
    '12:00 - 12:45',
    '12:45 - 13:30', // Lunch
    '13:30 - 14:15',
    '14:15 - 15:00',
    '15:00 - 15:45'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const mockTimetableData = {
    'Grade 10A': {
      'Monday': {
        '08:00 - 08:45': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', color: 'bg-blue-100 text-blue-800' },
        '08:45 - 09:30': { subject: 'Physics', teacher: 'Prof. Johnson', room: 'Lab 1', color: 'bg-green-100 text-green-800' },
        '09:30 - 10:15': { subject: 'English', teacher: 'Ms. Davis', room: 'Room 203', color: 'bg-purple-100 text-purple-800' },
        '10:15 - 10:30': { subject: 'Break', teacher: '', room: '', color: 'bg-gray-100 text-gray-600' },
        '10:30 - 11:15': { subject: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab 2', color: 'bg-orange-100 text-orange-800' },
        '11:15 - 12:00': { subject: 'History', teacher: 'Mr. Brown', room: 'Room 105', color: 'bg-red-100 text-red-800' }
      },
      'Tuesday': {
        '08:00 - 08:45': { subject: 'Physics', teacher: 'Prof. Johnson', room: 'Lab 1', color: 'bg-green-100 text-green-800' },
        '08:45 - 09:30': { subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', color: 'bg-blue-100 text-blue-800' },
        '09:30 - 10:15': { subject: 'Geography', teacher: 'Ms. Taylor', room: 'Room 204', color: 'bg-yellow-100 text-yellow-800' }
      }
    }
  };

  const currentData = Object.keys(timetableData).length > 0 ? timetableData : mockTimetableData;
  const entities = Object.keys(currentData);

  const getViolation = (entity, day, time) => {
    return violations.find(v => 
      v.entity === entity && v.day === day && v.time === time
    );
  };

  const handleCellClick = (entity, day, time, data) => {
    setSelectedCell({ entity, day, time, data });
  };

  const handleDragStart = (e, entity, day, time, data) => {
    setDraggedItem({ entity, day, time, data });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetEntity, targetDay, targetTime) => {
    e.preventDefault();
    if (draggedItem) {
      onDragDrop(draggedItem, { entity: targetEntity, day: targetDay, time: targetTime });
      setDraggedItem(null);
    }
  };

  const renderCell = (entity, day, time) => {
    const cellData = currentData[entity]?.[day]?.[time];
    const violation = getViolation(entity, day, time);
    const isBreakTime = time.includes('10:15') || time.includes('12:45');
    
    if (isBreakTime) {
      return (
        <td key={`${entity}-${day}-${time}`} className="p-2 border border-border bg-muted/50">
          <div className="text-center text-xs text-muted-foreground">
            {time.includes('10:15') ? 'Break' : 'Lunch'}
          </div>
        </td>
      );
    }

    return (
      <td 
        key={`${entity}-${day}-${time}`}
        className={`p-1 border border-border cursor-pointer transition-all duration-150 hover:bg-muted/50 ${
          violation ? 'border-red-500 bg-red-50' : ''
        }`}
        onClick={() => handleCellClick(entity, day, time, cellData)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, entity, day, time)}
      >
        {cellData ? (
          <div 
            className={`p-2 rounded text-xs ${cellData.color} relative group`}
            draggable
            onDragStart={(e) => handleDragStart(e, entity, day, time, cellData)}
          >
            <div className="font-medium truncate">{cellData.subject}</div>
            <div className="text-xs opacity-75 truncate">{cellData.teacher}</div>
            <div className="text-xs opacity-60 truncate">{cellData.room}</div>
            
            {violation && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={8} className="text-white" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded flex items-center justify-center">
              <Icon name="Move" size={16} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center text-muted-foreground">
            <Icon name="Plus" size={16} />
          </div>
        )}
      </td>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {viewMode === 'class' ? 'Class Timetables' : 'Teacher Schedules'}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Download">
              Export Grid
            </Button>
            <Button variant="ghost" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {entities.map((entity) => (
          <div key={entity} className="border-b border-border last:border-b-0">
            <div className="bg-muted/30 px-4 py-2 border-b border-border">
              <h4 className="font-medium text-foreground">{entity}</h4>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="bg-muted/20">
                  <th className="p-3 text-left text-sm font-medium text-foreground border-r border-border w-32">
                    Time
                  </th>
                  {weekDays.map((day) => (
                    <th key={day} className="p-3 text-center text-sm font-medium text-foreground border-r border-border last:border-r-0 min-w-40">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time} className="hover:bg-muted/20">
                    <td className="p-3 text-sm font-medium text-muted-foreground border-r border-border bg-muted/10">
                      {time}
                    </td>
                    {weekDays.map((day) => renderCell(entity, day, time))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {selectedCell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Edit Period</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedCell(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Time Slot</label>
                <p className="text-sm text-muted-foreground">{selectedCell.time}</p>
              </div>
              
              {selectedCell.data && (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground">Subject</label>
                    <p className="text-sm text-muted-foreground">{selectedCell.data.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Teacher</label>
                    <p className="text-sm text-muted-foreground">{selectedCell.data.teacher}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Room</label>
                    <p className="text-sm text-muted-foreground">{selectedCell.data.room}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedCell(null)}>
                Cancel
              </Button>
              <Button variant="default">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableGrid;