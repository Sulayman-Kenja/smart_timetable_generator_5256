import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';

const ExportFilters = ({ onFiltersChange, onReset }) => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [includeOptions, setIncludeOptions] = useState({
    teacherPhotos: false,
    roomNumbers: true,
    breakTimes: true,
    notes: false,
    watermarks: true
  });

  const teachers = [
    { value: 'teacher-1', label: 'Dr. Sarah Johnson - Mathematics' },
    { value: 'teacher-2', label: 'Prof. Michael Chen - Physics' },
    { value: 'teacher-3', label: 'Ms. Emily Davis - English Literature' },
    { value: 'teacher-4', label: 'Mr. David Wilson - Chemistry' },
    { value: 'teacher-5', label: 'Dr. Lisa Anderson - Biology' },
    { value: 'teacher-6', label: 'Mr. James Brown - History' },
    { value: 'teacher-7', label: 'Ms. Maria Garcia - Spanish' },
    { value: 'teacher-8', label: 'Prof. Robert Taylor - Computer Science' }
  ];

  const classes = [
    { value: 'grade-9a', label: 'Grade 9A (32 students)' },
    { value: 'grade-9b', label: 'Grade 9B (30 students)' },
    { value: 'grade-10a', label: 'Grade 10A (28 students)' },
    { value: 'grade-10b', label: 'Grade 10B (31 students)' },
    { value: 'grade-11a', label: 'Grade 11A (25 students)' },
    { value: 'grade-11b', label: 'Grade 11B (27 students)' },
    { value: 'grade-12a', label: 'Grade 12A (24 students)' },
    { value: 'grade-12b', label: 'Grade 12B (26 students)' }
  ];

  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'english', label: 'English Literature' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'physical-education', label: 'Physical Education' }
  ];

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    updateFilters({ dateRange: newDateRange });
  };

  const handleIncludeOptionChange = (option, checked) => {
    const newOptions = { ...includeOptions, [option]: checked };
    setIncludeOptions(newOptions);
    updateFilters({ includeOptions: newOptions });
  };

  const updateFilters = (updates) => {
    const filters = {
      dateRange,
      selectedTeachers,
      selectedClasses,
      selectedSubjects,
      includeOptions,
      ...updates
    };
    
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  const handleReset = () => {
    setDateRange({ start: '', end: '' });
    setSelectedTeachers([]);
    setSelectedClasses([]);
    setSelectedSubjects([]);
    setIncludeOptions({
      teacherPhotos: false,
      roomNumbers: true,
      breakTimes: true,
      notes: false,
      watermarks: true
    });
    
    if (onReset) {
      onReset();
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (dateRange.start || dateRange.end) count++;
    if (selectedTeachers.length > 0) count++;
    if (selectedClasses.length > 0) count++;
    if (selectedSubjects.length > 0) count++;
    return count;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Export Filters</h3>
          <p className="text-sm text-muted-foreground">Customize what to include in your exports</p>
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center space-x-2 text-sm text-primary">
              <Icon name="Filter" size={16} />
              <span>{getActiveFiltersCount()} active</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Date Range */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Date Range</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
        </div>

        {/* Teacher Selection */}
        <div>
          <Select
            label="Filter by Teachers"
            description="Select specific teachers to include"
            options={teachers}
            value={selectedTeachers}
            onChange={(value) => {
              setSelectedTeachers(value);
              updateFilters({ selectedTeachers: value });
            }}
            multiple
            searchable
            clearable
            placeholder="All teachers"
          />
        </div>

        {/* Class Selection */}
        <div>
          <Select
            label="Filter by Classes"
            description="Select specific classes to include"
            options={classes}
            value={selectedClasses}
            onChange={(value) => {
              setSelectedClasses(value);
              updateFilters({ selectedClasses: value });
            }}
            multiple
            searchable
            clearable
            placeholder="All classes"
          />
        </div>

        {/* Subject Selection */}
        <div>
          <Select
            label="Filter by Subjects"
            description="Select specific subjects to include"
            options={subjects}
            value={selectedSubjects}
            onChange={(value) => {
              setSelectedSubjects(value);
              updateFilters({ selectedSubjects: value });
            }}
            multiple
            searchable
            clearable
            placeholder="All subjects"
          />
        </div>

        {/* Include Options */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Include in Export</h4>
          <CheckboxGroup>
            <Checkbox
              label="Teacher Photos"
              description="Include teacher profile pictures in schedules"
              checked={includeOptions.teacherPhotos}
              onChange={(e) => handleIncludeOptionChange('teacherPhotos', e.target.checked)}
            />
            <Checkbox
              label="Room Numbers"
              description="Show classroom and lab assignments"
              checked={includeOptions.roomNumbers}
              onChange={(e) => handleIncludeOptionChange('roomNumbers', e.target.checked)}
            />
            <Checkbox
              label="Break Times"
              description="Include lunch and break periods"
              checked={includeOptions.breakTimes}
              onChange={(e) => handleIncludeOptionChange('breakTimes', e.target.checked)}
            />
            <Checkbox
              label="Additional Notes"
              description="Include special instructions and notes"
              checked={includeOptions.notes}
              onChange={(e) => handleIncludeOptionChange('notes', e.target.checked)}
            />
            <Checkbox
              label="School Watermark"
              description="Add school logo and branding"
              checked={includeOptions.watermarks}
              onChange={(e) => handleIncludeOptionChange('watermarks', e.target.checked)}
            />
          </CheckboxGroup>
        </div>

        {/* Filter Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Active Filters Summary</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              {(dateRange.start || dateRange.end) && (
                <div>Date range: {dateRange.start || 'Start'} to {dateRange.end || 'End'}</div>
              )}
              {selectedTeachers.length > 0 && (
                <div>Teachers: {selectedTeachers.length} selected</div>
              )}
              {selectedClasses.length > 0 && (
                <div>Classes: {selectedClasses.length} selected</div>
              )}
              {selectedSubjects.length > 0 && (
                <div>Subjects: {selectedSubjects.length} selected</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportFilters;