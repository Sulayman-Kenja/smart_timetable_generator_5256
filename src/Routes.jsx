import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import TeacherManagement from "pages/teacher-management";
import VisualRuleBuilder from "pages/visual-rule-builder";
import TimetableGenerator from "pages/timetable-generator";
import ClassSubjectConfiguration from "pages/class-subject-configuration";
import ExportReports from "pages/export-reports";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher-management" element={<TeacherManagement />} />
        <Route path="/visual-rule-builder" element={<VisualRuleBuilder />} />
        <Route path="/timetable-generator" element={<TimetableGenerator />} />
        <Route path="/class-subject-configuration" element={<ClassSubjectConfiguration />} />
        <Route path="/export-reports" element={<ExportReports />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;