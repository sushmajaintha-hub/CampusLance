
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/admin.css";

function AdminDashboard(){

const [users,setUsers] = useState([]);
const [projects,setProjects] = useState([]);

useEffect(()=>{
fetchUsers();
fetchProjects();
},[]);

const fetchUsers = async()=>{

try{

const res = await API.get("/admin/users");

setUsers(res.data);

}catch(error){

alert("Error loading users");

}

};

const fetchProjects = async()=>{

try{

const res = await API.get("/admin/projects");

setProjects(res.data);

}catch(error){

alert("Error loading projects");

}

};

const deleteUser = async(id)=>{

try{

await API.delete(`/admin/users/${id}`);

fetchUsers();

}catch(error){

alert("Error deleting user");

}

};

const deleteProject = async(id)=>{

try{

await API.delete(`/admin/projects/${id}`);

fetchProjects();

}catch(error){

alert("Error deleting project");

}

};

return(

<div className="admin-container">

<h2>Admin Dashboard</h2>

<h3>Users</h3>

{users.map((user)=>(
<div key={user._id} className="admin-card">

<p>{user.name} - {user.email}</p>

<button onClick={()=>deleteUser(user._id)}>
Delete
</button>

</div>
))}

<h3>Projects</h3>

{projects.map((project)=>(
<div key={project._id} className="admin-card">

<p>{project.title}</p>

<button onClick={()=>deleteProject(project._id)}>
Delete
</button>

</div>
))}

</div>

)

}

export default AdminDashboard;