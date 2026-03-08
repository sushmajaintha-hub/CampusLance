
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/profile";
import EditProfile from "./pages/EditProfile";
import PostProject from "./pages/PostProject";
import ProjectProgress from "./pages/ProjectProgress";
import Projects from "./pages/Projects";
import ChatPage from "./pages/ChatPage";
import Notifications from "./pages/Notifications";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/:id" element={<profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/project/:id" element={<ProjectProgress />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/chat/:projectId" element={<ChatPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;