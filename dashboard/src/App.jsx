import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import { getUser } from './store/userSlice.js';
import { getAllProjects } from './store/projectSlice.js';
import { getAllSkills } from './store/skillSlice.js';
import { getTimeline } from './store/timelineSlice.js';
import { getSoftwareApps } from './store/softwareSlice.js';
import { getMessages } from './store/messageSlice.js';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardHome } from './pages/DashboardHome.jsx';
import { ManageProjects } from './pages/ManageProjects.jsx';
import { ManageSkills } from './pages/ManageSkills.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) return <p className="center">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser())
      .unwrap()
      .then(() => {
        dispatch(getAllProjects());
        dispatch(getAllSkills());
        dispatch(getTimeline());
        dispatch(getSoftwareApps());
        dispatch(getMessages());
      })
      .catch(() => {});
  }, [dispatch]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2 className="logo">Portfolio Admin</h2>
        <nav>
          <ul>
            <li><Link to="/">Overview</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/skills">Skills</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <DashboardHome />
              </PrivateRoute>
            )}
          />
          <Route
            path="/projects"
            element={(
              <PrivateRoute>
                <ManageProjects />
              </PrivateRoute>
            )}
          />
          <Route
            path="/skills"
            element={(
              <PrivateRoute>
                <ManageSkills />
              </PrivateRoute>
            )}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
