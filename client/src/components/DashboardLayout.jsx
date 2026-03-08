
import "./DashboardLayout.css";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2 className="logo">CampusLance</h2>

        <ul>
          <li>Dashboard</li>
          <li>My Applications</li>
          <li>Profile</li>
          <li
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;