
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar(){

return(

<nav className="navbar">

<h2 className="logo">CampusLance</h2>

<div className="nav-links">

<Link to="/student-dashboard">Student</Link>

<Link to="/client-dashboard">Client</Link>

<Link to="/projects">Projects</Link>

<Link to="/admin">Admin</Link>

</div>

</nav>

)

}

export default Navbar;