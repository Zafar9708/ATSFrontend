// import { Routes, Route } from 'react-router-dom';
// import ProtectedRoute from '../ProtectedRoute';
// import LoginForm from '..../pages/Auth/LoginForm';
// // import RegisterForm from '..../pages/Auth/RegisterForm';
// import Home from '..../pages/Home';
// import DashboardPage from '..../pages/Dashboard';
// import JobsPage from '..../pages/JobsPage';
// import MainLayout from '..../layout/MainLayout';
// import JobCreationPage from '..../pages/JobCreationPage';
// import JobDetail from '..../pages/JobDetail';
// import CandidateDetailsPage from '..../pages/Candidate/CandidateDetailsPage';
// // import CandidatesTab from '..../pages/Candidate/TotalCandidates';
// import { CandidatesTab } from '..../pages/Candidate/TotalCandidates';
// import ForgotPasswordForm from '..../components/ForgotPassword';
// import RegisterForm from '..../components/Register';
// import FirstLogin from '..../components/FirstLogin';
// import FeedbackForm from '..../pages/Interview/FeedBackForm';
// import TotalInterviews from '..../pages/Interview/TotalInterview';
// import TaskPage from '..../pages/Task';
// import AdminDashboard from '..../pages/Admin/AdminDashboard';

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<LoginForm />} />
//       {/* <Route path="/register" element={<RegisterForm />} /> */}
//       <Route path="/forgot-password" element={<ForgotPasswordForm />} />
//       <Route path="/first-login" element={<FirstLogin />} />
//       <Route path="/register" element={<RegisterForm />} />
//       <Route path="/jobs" element={<JobsPage />} />
//       <Route path="/feedback/:interviewId/:interviewerId" element={<FeedbackForm />} />



//       {/* Protected role-based routes */}
//       <Route path="/superadmin/*" element={
//         <ProtectedRoute>
//           <DashboardPage />
//         </ProtectedRoute>
//       } />

//       <Route path="/tenant/:tenantId/*" element={
//         <ProtectedRoute>
//           <DashboardPage />
//         </ProtectedRoute>
//       } />

//       <Route path="/recruiter/:tenantId/*" element={
//         <ProtectedRoute>
//           <DashboardPage />
//         </ProtectedRoute>
//       } />
//       <Route
//         path="/jobs"
//         element={
//           <ProtectedRoute>
//             <MainLayout userName={JSON..parse(localStorage..getItem('userData'))?..name || 'User'}>
//               <JobsPage />
//               <JobDetail />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/dashboard/jobs/:id/*"
//         element={
//           <ProtectedRoute>
//             <MainLayout userName={JSON..parse(localStorage..getItem('userData'))?..name || 'User'}>
//               <JobDetail />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />



//       <Route
//         path='/dashboard/jobs/createJob'
//         element={
//           <ProtectedRoute>
//             <JobCreationPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path='/jobs/update/:id'
//         element={
//           <ProtectedRoute>
//             <JobCreationPage />
//           </ProtectedRoute>
//         }
//       />


//       <Route
//         path="/candidates/:id/*"
//         element={
//           <ProtectedRoute>
//             <MainLayout userName={JSON..parse(localStorage..getItem('userData'))?..name || 'User'}>
//               <CandidateDetailsPage />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/all/candidates/*"
//         element={
//           <ProtectedRoute>
//             <MainLayout userName={JSON..parse(localStorage..getItem('userData'))?..name || 'User'}>
//               <CandidatesTab />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />

//        <Route
//         path="/total-interviews"
//         element={
//           <ProtectedRoute>
//             <MainLayout userName={JSON..parse(localStorage..getItem('userData'))?..name || 'User'}>
//               <TotalInterviews />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />

//        <Route
//         path="/tasks"
//         element={
//           <ProtectedRoute>
//             <MainLayout userName={JSON..parse(localStorage..getItem('userData'))?..name || 'User'}>
//               <TaskPage />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />

//        <Route
//         path="/admin/dashboard"
//         element={
//           <ProtectedRoute>
//             <MainLayout userName={JSON..parse(localStorage..getItem('userData'))?..name || 'User'}>
//               <AdminDashboard />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />

//     </Routes>
//   );
// };

// export default AppRoutes;

//--------

// src/AppRoutes..js
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
import FirstLogin from '../components/FirstLogin';
import FeedbackForm from '../pages/Interview/FeedBackForm';
import TotalInterviews from '../pages/Interview/TotalInterview';
import TaskPage from '../pages/Task';
import AdminDashboard from '../pages/Admin/AdminDashboard';
// import Unauthorized from '../pages/Unauthorized';
import Unauthorized from '../pages/Unauthorized';
import { useUser } from '../contexts/UserContext';
import Profile from '../pages/Profile';
// import VendorLogin from '../pages/Vendor/vendorLogin';
import VendorRegister from '../pages/Vendor/VendorRegister';
import NotificationCenter from '../pages/NotificationCenter';
import VendorUploadPage from '../services/Vendor/VendorUploadPage';
import VendorCandidatesPage from '../pages/Vendor/VendorCandidates';
// Create a wrapper component for routes that need MainLayout
const LayoutWrapper = ({ children,width }) => {
 
  return (
    <MainLayout width={width}  >
      {children}
      
    </MainLayout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      {/* <Route path="/vendor-login" element={<VendorLogin />} /> */}
      <Route path="/vendor/register" element={<VendorRegister />} />
      <Route path="/vendor/upload/:token" element={<VendorUploadPage />} />


      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/first-login" element={<FirstLogin />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/feedback/:interviewId/:interviewerId" element={<FeedbackForm />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/reset-password" element={<ForgotPasswordForm/>} />
      {/* <Route path="/profile" element={<Profile />} /> */}


      
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Profile />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />


     

      {/* Superadmin routes */}
      <Route path="/superadmin/*" element={
        <ProtectedRoute allowedRoles={['superadmin']}>
          <LayoutWrapper width={35}>
            <DashboardPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/tenant/:tenantId/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper width={20}>
            <DashboardPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />

      {/* Recruiter routes */}
      <Route path="/recruiter/:tenantId/*" element={
        <ProtectedRoute allowedRoles={['recruiter']}>
          <LayoutWrapper width={20}>
            <DashboardPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      {/* Job routes - accessible to admin and recruiter */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
            <LayoutWrapper>
              <JobsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/jobs/:id/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
            <LayoutWrapper>
              <JobDetail />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path='/dashboard/jobs/createJob'
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
            <LayoutWrapper>
              <JobCreationPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path='/jobs/update/:id'
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
            <LayoutWrapper>
              <JobCreationPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Candidate routes - accessible to admin and recruiter */}
      <Route
        path="/candidates/:id/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
            <LayoutWrapper>
              <CandidateDetailsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/all/candidates/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
            <LayoutWrapper >
              <CandidatesTab  />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Interview routes - accessible to admin and recruiter */}
      <Route
        path="/total-interviews"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
            <LayoutWrapper>
              <TotalInterviews />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Task routes - accessible to admin and recruiter */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter']}>
            <LayoutWrapper>
              <TaskPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard - accessible only to admin */}
      <Route
        path="/admin/dashboard"
        element={

          <ProtectedRoute >
            <LayoutWrapper  >
              <AdminDashboard />
            </LayoutWrapper>
          </ProtectedRoute>

        }
       
      />

       <Route
        path="/notifications"
        element={

          <ProtectedRoute >
            <LayoutWrapper  >
              <NotificationCenter />
            </LayoutWrapper>
          </ProtectedRoute>

        }
       
      />
      <Route
        path="/total-vendors"
        element={

          <ProtectedRoute >
            <LayoutWrapper  >
              <VendorCandidatesPage />
            </LayoutWrapper>
          </ProtectedRoute>

        }
       
      />
      
      
    </Routes>
  );
};

export default AppRoutes;