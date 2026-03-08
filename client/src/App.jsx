
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PostProject from "./pages/PostProject";
import ProjectProgress from "./pages/ProjectProgress";
import Projects from "./pages/Projects";
import ChatPage from "./pages/ChatPage";
import Notifications from "./pages/Notifications";

import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>

      {/* Navbar visible on all pages except login */}
      <Navbar />

      <Routes>

        <Route path="/" element={<Login />} />

        {/* CLIENT DASHBOARD */}
        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* EDIT PROFILE */}
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* POST PROJECT */}
        <Route
          path="/post-project"
          element={
            <ProtectedRoute allowedRole="client">
              <PostProject />
            </ProtectedRoute>
          }
        />

        {/* PROJECT PROGRESS */}
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectProgress />
            </ProtectedRoute>
          }
        />

        {/* PROJECT LIST */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat/:projectId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;