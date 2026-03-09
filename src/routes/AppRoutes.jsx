import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginForm from '../pages/Auth/LoginForm';
import Home from '../pages/Home';
import DashboardPage from '../pages/Dashboard';
import JobsPage from '../pages/JobsPage';
import MainLayout from '../layout/MainLayout';
import JobCreationPage from '../pages/JobCreationPage';
import JobDetail from '../pages/JobDetail';
import CandidateDetailsPage from '../pages/Candidate/CandidateDetailsPage';
import { CandidatesTab } from '../pages/Candidate/TotalCandidates';
import ForgotPasswordForm from '../components/ForgotPassword';
import RegisterForm from '../components/Register';
import FirstLogin from '../components/FirstLogin'; // Make sure this path is correct
import FeedbackForm from '../pages/Interview/FeedBackForm';
import TotalInterviews from '../pages/Interview/TotalInterview';
import TaskPage from '../pages/Task';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import Unauthorized from '../pages/Unauthorized';
import Profile from '../pages/Profile';
import VendorRegister from '../pages/Vendor/VendorRegister';
import NotificationCenter from '../pages/NotificationCenter';
import VendorUploadPage from '../services/Vendor/VendorUploadPage';
import VendorCandidatesPage from '../pages/Vendor/VendorCandidates';
import ReportsPage from '../pages/Reports';
import HelpPage from '../pages/Help';

// Layout wrapper component
const LayoutWrapper = ({ children }) => {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES (NO AUTH REQUIRED) ========== */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/first-login" element={<FirstLogin />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/vendor/register" element={<VendorRegister />} />
      <Route path="/vendor/upload/:token" element={<VendorUploadPage />} />
      <Route path="/feedback/:interviewId/:interviewerId" element={<FeedbackForm />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* ========== PROTECTED ROUTES (AUTH REQUIRED) ========== */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Profile />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Superadmin routes */}
      <Route
        path="/superadmin/*"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <LayoutWrapper>
              <DashboardPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/tenant/:tenantId/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <LayoutWrapper>
              <DashboardPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Recruiter routes */}
      <Route
        path="/recruiter/:tenantId/*"
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <LayoutWrapper>
              <DashboardPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <LayoutWrapper>
              <AdminDashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      {/* Job routes */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'superadmin']}>
            <LayoutWrapper>
              <JobsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/jobs/:id/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'superadmin']}>
            <LayoutWrapper>
              <JobDetail />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/jobs/createJob"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'superadmin']}>
            <LayoutWrapper>
              <JobCreationPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/jobs/update/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'superadmin']}>
            <LayoutWrapper>
              <JobCreationPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Candidate routes */}
      <Route
        path="/candidates/:id/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'superadmin']}>
            <LayoutWrapper>
              <CandidateDetailsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/all/candidates/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'superadmin']}>
            <LayoutWrapper>
              <CandidatesTab />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      
      <Route
        path="/reports"
        element={
            <LayoutWrapper>
              <ReportsPage />
            </LayoutWrapper>
        }
      />

       <Route
        path="/help"
        element={
            <LayoutWrapper>
              <HelpPage />
            </LayoutWrapper>
        }
      />

      {/* Interview routes */}
      <Route
        path="/total-interviews"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'superadmin']}>
            <LayoutWrapper>
              <TotalInterviews />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Task routes */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'superadmin']}>
            <LayoutWrapper>
              <TaskPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Notification routes */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <NotificationCenter />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Vendor routes */}
      <Route
        path="/total-vendors"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <VendorCandidatesPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Reports routes */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <ReportsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      {/* 404 Fallback - Keep this at the end */}
      <Route 
        path="*" 
        element={
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            textAlign: 'center',
            padding: '20px'
          }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <p>Path: {window.location.pathname}</p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Go Home
            </button>
          </div>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;