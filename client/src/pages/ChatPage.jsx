
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/chat.css";

function ChatPage() {

  const { projectId } = useParams();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {

    try {

      const res = await API.get(`/chat/${projectId}`);

      setMessages(res.data);

    } catch (error) {
      alert("Error loading chat");
    }

  };

  const sendMessage = async () => {

    if (!message) return;

    try {

      await API.post(`/chat/${projectId}`, { message });

      setMessage("");

      fetchMessages();

    } catch (error) {
      alert("Error sending message");
    }

  };

  return (
    <div className="chat-container">

      <h2>Project Chat</h2>

      <div className="chat-box">

        {messages.map((msg) => (

          <div key={msg._id} className="chat-message">

            <strong>{msg.sender?.name}</strong>: {msg.message}

          </div>

        ))}

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatPage;