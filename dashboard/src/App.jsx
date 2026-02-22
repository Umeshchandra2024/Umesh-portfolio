import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { getUser, clearSession } from './store/userSlice.js';
import { getAllProjects } from './store/projectSlice.js';
import { getAllSkills } from './store/skillSlice.js';
import { getTimeline } from './store/timelineSlice.js';
import { getSoftwareApps } from './store/softwareSlice.js';
import { getMessages } from './store/messageSlice.js';
import { getResume } from './store/resumeSlice.js';
import { logout } from './store/userSlice.js';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardHome } from './pages/DashboardHome.jsx';
import { ManageProjects } from './pages/ManageProjects.jsx';
import { ManageSkills } from './pages/ManageSkills.jsx';
import { ManageTimeline } from './pages/ManageTimeline.jsx';
import { ViewProject } from './pages/ViewProject.jsx';
import { UpdateProject } from './pages/UpdateProject.jsx';
import { ManageMessages } from './pages/ManageMessages.jsx';
import { ManageResume } from './pages/ManageResume.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllProjects());
    dispatch(getAllSkills());
    dispatch(getTimeline());
    dispatch(getSoftwareApps());
    dispatch(getMessages());
    dispatch(getResume());
  }, [dispatch]);

  useEffect(() => {
    const onSessionExpired = (e) => {
      dispatch(clearSession());
      toast.info(e.detail || 'Session expired. Please log in again.');
    };
    window.addEventListener('auth:sessionExpired', onSessionExpired);
    return () => window.removeEventListener('auth:sessionExpired', onSessionExpired);
  }, [dispatch]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`app-shell ${isAuthPage ? 'app-shell--auth' : ''}`}>
      {!isAuthPage && (
        <aside className="sidebar">
          <h2 className="sidebar-logo">Portfolio Admin</h2>
          <nav className="sidebar-nav">
            <NavLink to="/" className="sidebar-link" end>
              Overview
            </NavLink>
            <NavLink to="/manage/project" className="sidebar-link">
              Projects
            </NavLink>
            <NavLink to="/manage/skills" className="sidebar-link">
              Skills
            </NavLink>
            <NavLink to="/manage/timeline" className="sidebar-link">
              Timeline
            </NavLink>
            <NavLink to="/manage/messages" className="sidebar-link">
              Messages
            </NavLink>
            <NavLink to="/manage/resume" className="sidebar-link">
              Resume
            </NavLink>
          </nav>
          <div className="sidebar-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </div>
        </aside>
      )}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage/project"
            element={
              <PrivateRoute>
                <ManageProjects />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage/skills"
            element={
              <PrivateRoute>
                <ManageSkills />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage/timeline"
            element={
              <PrivateRoute>
                <ManageTimeline />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage/messages"
            element={
              <PrivateRoute>
                <ManageMessages />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage/resume"
            element={
              <PrivateRoute>
                <ManageResume />
              </PrivateRoute>
            }
          />
          <Route
            path="/views/project/:id"
            element={
              <PrivateRoute>
                <ViewProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/update/project/:id"
            element={
              <PrivateRoute>
                <UpdateProject />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <AppContent />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}

export default App;
