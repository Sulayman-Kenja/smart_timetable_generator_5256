import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const TeacherTable = ({ 
  teachers = [], 
  selectedTeachers = [], 
  onSelectTeacher, 
  onSelectAll, 
  onEditTeacher, 
  onDeleteTeacher,
  searchTerm = '',
  onSearchChange,
  sortConfig,
  onSort
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedAndFilteredTeachers = useMemo(() => {
    let filtered = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'subjects') {
          aValue = a.subjects.length;
          bValue = b.subjects.length;
        } else if (sortConfig.key === 'utilization') {
          aValue = (a.currentHours / a.maxHours) * 100;
          bValue = (b.currentHours / b.maxHours) * 100;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [teachers, searchTerm, sortConfig]);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredTeachers, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredTeachers.length / itemsPerPage);

  const getAvailabilityStatus = (teacher) => {
    const utilization = (teacher.currentHours / teacher.maxHours) * 100;
    if (utilization >= 100) return { status: 'unavailable', color: 'bg-error', text: 'Full' };
    if (utilization >= 80) return { status: 'limited', color: 'bg-warning', text: 'Limited' };
    return { status: 'available', color: 'bg-success', text: 'Available' };
  };

  const handleSort = (key) => {
    onSort(key);
  };

  const isAllSelected = selectedTeachers.length === paginatedTeachers.length && paginatedTeachers.length > 0;
  const isIndeterminate = selectedTeachers.length > 0 && selectedTeachers.length < paginatedTeachers.length;

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Table Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Teachers ({sortedAndFilteredTeachers.length})</h3>
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search teachers or subjects..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="font-medium text-foreground hover:text-primary"
                >
                  Teacher Name
                  <Icon 
                    name={sortConfig.key === 'name' ? 
                      (sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 
                      'ChevronsUpDown'
                    } 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="p-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('subjects')}
                  className="font-medium text-foreground hover:text-primary"
                >
                  Subjects
                  <Icon 
                    name={sortConfig.key === 'subjects' ? 
                      (sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 
                      'ChevronsUpDown'
                    } 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="p-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('maxHours')}
                  className="font-medium text-foreground hover:text-primary"
                >
                  Max Hours
                  <Icon 
                    name={sortConfig.key === 'maxHours' ? 
                      (sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 
                      'ChevronsUpDown'
                    } 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="p-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('utilization')}
                  className="font-medium text-foreground hover:text-primary"
                >
                  Utilization
                  <Icon 
                    name={sortConfig.key === 'utilization' ? 
                      (sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 
                      'ChevronsUpDown'
                    } 
                    size={16} 
                    className="ml-1" 
                  />
                </Button>
              </th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTeachers.map((teacher) => {
              const availability = getAvailabilityStatus(teacher);
              const utilization = (teacher.currentHours / teacher.maxHours) * 100;
              const isSelected = selectedTeachers.includes(teacher.id);

              return (
                <tr key={teacher.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => onSelectTeacher(teacher.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {teacher.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.slice(0, 3).map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md"
                        >
                          {subject}
                        </span>
                      ))}
                      {teacher.subjects.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                          +{teacher.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-foreground">{teacher.maxHours}h/week</span>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{teacher.currentHours}h / {teacher.maxHours}h</span>
                        <span className="font-medium text-foreground">{Math.round(utilization)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            utilization >= 100 ? 'bg-error' :
                            utilization >= 80 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${availability.color}`} />
                      <span className="text-sm font-medium text-foreground">{availability.text}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditTeacher(teacher)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteTeacher(teacher.id)}
                        className="text-muted-foreground hover:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedAndFilteredTeachers.length)} of {sortedAndFilteredTeachers.length} teachers
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={16} />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTable;