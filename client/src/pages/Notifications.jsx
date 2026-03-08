
import { useEffect, useState } from "react";
import API from "../services/api";

function Notifications() {

const [notifications, setNotifications] = useState([]);

useEffect(() => {
fetchNotifications();
}, []);

const fetchNotifications = async () => {

try {

const res = await API.get("/notifications");

setNotifications(res.data);

} catch (error) {

alert("Error loading notifications");

}

};

const markRead = async (id) => {

try {

await API.put(`/notifications/${id}/read`);

fetchNotifications();

} catch (error) {

alert("Error updating");

}

};

return (

<div style={{padding:"30px"}}>

<h2>Notifications</h2>

{notifications.length === 0 ? (

<p>No notifications</p>

) : (

notifications.map((n)=> (

<div key={n._id} style={{
border:"1px solid #ddd",
padding:"10px",
marginBottom:"10px"
}}>

<p>{n.message}</p>

<button onClick={()=>markRead(n._id)}>
Mark as Read
</button>

</div>

))

)}

</div>

);

}

export default Notifications;