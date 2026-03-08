
import { useEffect, useState } from "react";
import API from "../services/api";

function Chat({ projectId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await API.get(`/messages/${projectId}`);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!text) return;

    await API.post("/messages", {
      projectId,
      receiverId,
      message: text,
    });

    setText("");
    fetchMessages();
  };

  return (
    <div>
      <h2>Project Chat</h2>

      <div>
        {messages.map((msg) => (
          <p key={msg._id}>
            <strong>{msg.sender.name}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;