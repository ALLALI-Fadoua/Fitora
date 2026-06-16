import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Logout from './pages/auth/Logout';
import Signup from './pages/auth/Signup';
import AdminLogin from './pages/auth/AdminLogin';
import Homepage from './pages/public/home/Homepage';
import ProtectedRoute from './components/ProtectedRoute';
import LearnerLayout from './pages/LearnerSpace/LearnerLayout';
import CoachLayout from './pages/CoachSpace/CoachLayout';
import AdminLayout from './pages/AdminSpace/AdminLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-access" element={<AdminLogin />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coach/*"
        element={
          <ProtectedRoute allowedRoles={['COACH']}>
            <CoachLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learner/*"
        element={
          <ProtectedRoute allowedRoles={['LEARNER']}>
            <LearnerLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;