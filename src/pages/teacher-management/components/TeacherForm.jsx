import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const TeacherForm = ({ 
  teacher = null, 
  onSave, 
  onCancel, 
  availableSubjects = [],
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    maxHours: 25,
    subjects: [],
    unavailableSlots: []
  });

  const [errors, setErrors] = useState({});

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        employeeId: teacher.employeeId || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        maxHours: teacher.maxHours || 25,
        subjects: teacher.subjects || [],
        unavailableSlots: teacher.unavailableSlots || []
      });
    } else {
      // Generate new employee ID for new teacher
      const newId = `TCH${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, employeeId: newId }));
    }
  }, [teacher]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Teacher name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (formData.subjects.length === 0) {
      newErrors.subjects = 'At least one subject must be selected';
    }

    if (formData.maxHours < 5 || formData.maxHours > 40) {
      newErrors.maxHours = 'Weekly hours must be between 5 and 40';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleSubjectChange = (subject, checked) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked 
        ? [...prev.subjects, subject]
        : prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleUnavailableSlotToggle = (day, time) => {
    const slotKey = `${day}-${time}`;
    setFormData(prev => ({
      ...prev,
      unavailableSlots: prev.unavailableSlots.includes(slotKey)
        ? prev.unavailableSlots.filter(slot => slot !== slotKey)
        : [...prev.unavailableSlots, slotKey]
    }));
  };

  const isSlotUnavailable = (day, time) => {
    return formData.unavailableSlots.includes(`${day}-${time}`);
  };

  const getSubjectHours = (subject) => {
    // Mock calculation - in real app, this would come from actual assignments
    return Math.floor(Math.random() * 8) + 2;
  };

  const totalAssignedHours = formData.subjects.reduce((total, subject) => {
    return total + getSubjectHours(subject);
  }, 0);

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          {teacher ? 'Edit Teacher' : 'Add New Teacher'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {teacher ? 'Update teacher information and assignments' : 'Create a new teacher profile with subject assignments'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Basic Information</h4>
          
          <Input
            label="Full Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            placeholder="Enter teacher's full name"
          />

          <Input
            label="Employee ID"
            type="text"
            value={formData.employeeId}
            onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
            placeholder="Auto-generated ID"
            disabled
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              error={errors.email}
              placeholder="teacher@school.edu"
            />

            <Input
              label="Phone Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Weekly Hours */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Weekly Schedule</h4>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Maximum Weekly Hours: {formData.maxHours}h
            </label>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={formData.maxHours}
              onChange={(e) => setFormData(prev => ({ ...prev, maxHours: parseInt(e.target.value) }))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5h</span>
              <span>40h</span>
            </div>
            {errors.maxHours && (
              <p className="text-sm text-error">{errors.maxHours}</p>
            )}
          </div>

          {formData.subjects.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated assigned hours:</span>
                <span className="font-medium text-foreground">{totalAssignedHours}h / {formData.maxHours}h</span>
              </div>
              <div className="w-full bg-background rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    totalAssignedHours > formData.maxHours ? 'bg-error' :
                    totalAssignedHours > formData.maxHours * 0.8 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min((totalAssignedHours / formData.maxHours) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Subject Assignment */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Subject Assignment</h4>
            <span className="text-sm text-muted-foreground">
              {formData.subjects.length} of {availableSubjects.length} selected
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableSubjects.map((subject) => {
              const isSelected = formData.subjects.includes(subject);
              const estimatedHours = isSelected ? getSubjectHours(subject) : 0;
              
              return (
                <div
                  key={subject}
                  className={`p-3 border rounded-lg transition-all duration-150 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Checkbox
                    label={subject}
                    checked={isSelected}
                    onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                  />
                  {isSelected && (
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      ~{estimatedHours}h/week estimated
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          
          {errors.subjects && (
            <p className="text-sm text-error">{errors.subjects}</p>
          )}
        </div>

        {/* Availability Grid */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Availability Schedule</h4>
          <p className="text-sm text-muted-foreground">
            Click on time slots to mark as unavailable (red = unavailable, green = available)
          </p>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-6 gap-1">
                {/* Header */}
                <div className="p-2 text-center font-medium text-foreground">Time</div>
                {weekDays.map(day => (
                  <div key={day} className="p-2 text-center font-medium text-foreground text-sm">
                    {day.slice(0, 3)}
                  </div>
                ))}
                
                {/* Time slots */}
                {timeSlots.map(time => (
                  <React.Fragment key={time}>
                    <div className="p-2 text-center text-sm text-muted-foreground bg-muted/30 rounded">
                      {time}
                    </div>
                    {weekDays.map(day => (
                      <button
                        key={`${day}-${time}`}
                        type="button"
                        onClick={() => handleUnavailableSlotToggle(day, time)}
                        className={`p-2 text-xs rounded transition-all duration-150 hover:scale-105 ${
                          isSlotUnavailable(day, time)
                            ? 'bg-error/20 text-error border border-error/30' :'bg-success/20 text-success border border-success/30 hover:bg-success/30'
                        }`}
                      >
                        {isSlotUnavailable(day, time) ? 'X' : '✓'}
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
          >
            {teacher ? 'Update Teacher' : 'Add Teacher'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;