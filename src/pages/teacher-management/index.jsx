import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TeacherTable from './components/TeacherTable';
import TeacherForm from './components/TeacherForm';
import FilterBar from './components/FilterBar';
import TeacherStats from './components/TeacherStats';

const TeacherManagement = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    availability: '',
    utilization: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for teachers
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      employeeId: "TCH001",
      email: "sarah.johnson@school.edu",
      phone: "+1 (555) 123-4567",
      maxHours: 30,
      currentHours: 24,
      subjects: ["Mathematics", "Statistics", "Calculus"],
      unavailableSlots: ["Monday-9:00 AM", "Wednesday-2:00 PM"],
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      employeeId: "TCH002",
      email: "michael.chen@school.edu",
      phone: "+1 (555) 234-5678",
      maxHours: 25,
      currentHours: 25,
      subjects: ["Physics", "Chemistry", "Science"],
      unavailableSlots: ["Friday-1:00 PM"],
      createdAt: "2024-01-20"
    },
    {
      id: 3,
      name: "Ms. Emily Rodriguez",
      employeeId: "TCH003",
      email: "emily.rodriguez@school.edu",
      phone: "+1 (555) 345-6789",
      maxHours: 28,
      currentHours: 18,
      subjects: ["English Literature", "Creative Writing", "Grammar"],
      unavailableSlots: ["Tuesday-10:00 AM", "Thursday-3:00 PM"],
      createdAt: "2024-02-01"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      employeeId: "TCH004",
      email: "james.wilson@school.edu",
      phone: "+1 (555) 456-7890",
      maxHours: 32,
      currentHours: 20,
      subjects: ["History", "Social Studies", "Geography"],
      unavailableSlots: ["Monday-11:00 AM"],
      createdAt: "2024-02-10"
    },
    {
      id: 5,
      name: "Ms. Lisa Thompson",
      employeeId: "TCH005",
      email: "lisa.thompson@school.edu",
      phone: "+1 (555) 567-8901",
      maxHours: 26,
      currentHours: 22,
      subjects: ["Art", "Music", "Drama"],
      unavailableSlots: ["Wednesday-9:00 AM", "Friday-2:00 PM"],
      createdAt: "2024-02-15"
    },
    {
      id: 6,
      name: "Mr. David Kumar",
      employeeId: "TCH006",
      email: "david.kumar@school.edu",
      phone: "+1 (555) 678-9012",
      maxHours: 30,
      currentHours: 15,
      subjects: ["Computer Science", "Programming", "Web Development"],
      unavailableSlots: ["Tuesday-1:00 PM"],
      createdAt: "2024-02-20"
    }
  ]);

  // Available subjects for assignment
  const availableSubjects = [
    "Mathematics", "Statistics", "Calculus", "Algebra",
    "Physics", "Chemistry", "Biology", "Science",
    "English Literature", "Creative Writing", "Grammar", "Reading",
    "History", "Social Studies", "Geography", "Civics",
    "Art", "Music", "Drama", "Physical Education",
    "Computer Science", "Programming", "Web Development", "Digital Literacy",
    "French", "Spanish", "German", "Foreign Languages"
  ];

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setShowForm(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
      setSelectedTeachers(prev => prev.filter(id => id !== teacherId));
    }
  };

  const handleSaveTeacher = async (formData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingTeacher) {
      // Update existing teacher
      setTeachers(prev => prev.map(teacher => 
        teacher.id === editingTeacher.id 
          ? { ...teacher, ...formData, currentHours: teacher.currentHours }
          : teacher
      ));
    } else {
      // Add new teacher
      const newTeacher = {
        ...formData,
        id: Date.now(),
        currentHours: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTeachers(prev => [...prev, newTeacher]);
    }
    
    setIsLoading(false);
    setShowForm(false);
    setEditingTeacher(null);
  };

  const handleSelectTeacher = (teacherId, selected) => {
    setSelectedTeachers(prev => 
      selected 
        ? [...prev, teacherId]
        : prev.filter(id => id !== teacherId)
    );
  };

  const handleSelectAll = (selected) => {
    setSelectedTeachers(selected ? teachers.map(t => t.id) : []);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      subject: '',
      availability: '',
      utilization: ''
    });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'add':
        handleAddTeacher();
        break;
      case 'export':
        if (selectedTeachers.length > 0) {
          console.log('Exporting teachers:', selectedTeachers);
          // Implement export functionality
        }
        break;
      case 'duplicate':
        if (selectedTeachers.length > 0) {
          console.log('Duplicating teachers:', selectedTeachers);
          // Implement duplicate functionality
        }
        break;
      case 'delete':
        if (selectedTeachers.length > 0 && window.confirm(`Delete ${selectedTeachers.length} selected teachers?`)) {
          setTeachers(prev => prev.filter(teacher => !selectedTeachers.includes(teacher.id)));
          setSelectedTeachers([]);
        }
        break;
      default:
        break;
    }
  };

  // Filter teachers based on current filters
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = !searchTerm || 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = !filters.subject || teacher.subjects.includes(filters.subject);

    const utilization = (teacher.currentHours / teacher.maxHours) * 100;
    let matchesAvailability = true;
    if (filters.availability === 'available') matchesAvailability = utilization < 80;
    if (filters.availability === 'limited') matchesAvailability = utilization >= 80 && utilization < 100;
    if (filters.availability === 'unavailable') matchesAvailability = utilization >= 100;

    let matchesUtilization = true;
    if (filters.utilization === '0-25') matchesUtilization = utilization <= 25;
    if (filters.utilization === '26-50') matchesUtilization = utilization > 25 && utilization <= 50;
    if (filters.utilization === '51-75') matchesUtilization = utilization > 50 && utilization <= 75;
    if (filters.utilization === '76-100') matchesUtilization = utilization > 75;

    return matchesSearch && matchesSubject && matchesAvailability && matchesUtilization;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Teacher Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage teacher profiles, subject assignments, and availability schedules
            </p>
          </div>

          <TeacherStats teachers={filteredTeachers} />

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            availableSubjects={availableSubjects}
            selectedCount={selectedTeachers.length}
            onBulkAction={handleBulkAction}
          />

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Teacher Table */}
            <div className={showForm ? "xl:col-span-3" : "xl:col-span-5"}>
              <TeacherTable
                teachers={filteredTeachers}
                selectedTeachers={selectedTeachers}
                onSelectTeacher={handleSelectTeacher}
                onSelectAll={handleSelectAll}
                onEditTeacher={handleEditTeacher}
                onDeleteTeacher={handleDeleteTeacher}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>

            {/* Teacher Form */}
            {showForm && (
              <div className="xl:col-span-2">
                <TeacherForm
                  teacher={editingTeacher}
                  onSave={handleSaveTeacher}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTeacher(null);
                  }}
                  availableSubjects={availableSubjects}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherManagement;