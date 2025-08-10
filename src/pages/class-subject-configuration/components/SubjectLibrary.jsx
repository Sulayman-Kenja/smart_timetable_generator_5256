import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SubjectLibrary = ({ 
  subjects, 
  onAddSubject, 
  onEditSubject, 
  onDeleteSubject,
  selectedSubjects = {},
  onQuickAdd 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    category: 'Core',
    defaultHours: 3,
    description: ''
  });

  const categories = [
    { id: 'all', label: 'All Subjects', count: subjects.length },
    { id: 'Core', label: 'Core Subjects', count: subjects.filter(s => s.category === 'Core').length },
    { id: 'Science', label: 'Science', count: subjects.filter(s => s.category === 'Science').length },
    { id: 'Arts', label: 'Arts & Humanities', count: subjects.filter(s => s.category === 'Arts').length },
    { id: 'Physical', label: 'Physical Education', count: subjects.filter(s => s.category === 'Physical').length },
    { id: 'Elective', label: 'Electives', count: subjects.filter(s => s.category === 'Elective').length }
  ];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || subject.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSubject = () => {
    if (newSubject.name.trim()) {
      const subject = {
        id: `subject-${Date.now()}`,
        ...newSubject,
        createdAt: new Date().toISOString()
      };
      onAddSubject(subject);
      setNewSubject({ name: '', category: 'Core', defaultHours: 3, description: '' });
      setShowAddForm(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Core': 'bg-primary/10 text-primary border-primary/20',
      'Science': 'bg-success/10 text-success border-success/20',
      'Arts': 'bg-accent/10 text-accent border-accent/20',
      'Physical': 'bg-warning/10 text-warning border-warning/20',
      'Elective': 'bg-secondary/10 text-secondary border-secondary/20'
    };
    return colors[category] || colors['Core'];
  };

  const isSubjectSelected = (subjectId) => selectedSubjects[subjectId];

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Subject Library</h3>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add Subject
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {/* Category Filter */}
        <div className="space-y-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="w-full justify-between h-8"
            >
              <span className="text-xs">{category.label}</span>
              <span className="text-xs opacity-70">({category.count})</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="space-y-3">
            <Input
              label="Subject Name"
              type="text"
              value={newSubject.name}
              onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter subject name"
              required
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Category</label>
                <select
                  value={newSubject.category}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
                >
                  <option value="Core">Core</option>
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Physical">Physical</option>
                  <option value="Elective">Elective</option>
                </select>
              </div>
              
              <Input
                label="Default Hours"
                type="number"
                value={newSubject.defaultHours}
                onChange={(e) => setNewSubject(prev => ({ ...prev, defaultHours: parseInt(e.target.value) || 3 }))}
                min="1"
                max="10"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleAddSubject}
                disabled={!newSubject.name.trim()}
                className="flex-1"
              >
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subject List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {filteredSubjects.map((subject) => {
            const isSelected = isSubjectSelected(subject.id);
            
            return (
              <div
                key={subject.id}
                className={`
                  p-3 border rounded-lg transition-all duration-150
                  ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm text-foreground truncate">
                        {subject.name}
                      </h4>
                      {isSelected && (
                        <Icon name="Check" size={14} className="text-success flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className={`
                      inline-flex items-center px-2 py-1 rounded text-xs font-medium border
                      ${getCategoryColor(subject.category)}
                    `}>
                      {subject.category}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onQuickAdd(subject)}
                      className="w-6 h-6 text-muted-foreground hover:text-foreground"
                      title="Quick add to current class"
                    >
                      <Icon name="Plus" size={12} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditSubject(subject)}
                      className="w-6 h-6 text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="Edit2" size={12} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{subject.defaultHours} hrs/week default</span>
                  {subject.description && (
                    <span className="truncate ml-2" title={subject.description}>
                      {subject.description}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'No subjects found matching your search' : 'No subjects in this category'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground text-center">
          {filteredSubjects.length} of {subjects.length} subjects shown
        </div>
      </div>
    </div>
  );
};

export default SubjectLibrary;