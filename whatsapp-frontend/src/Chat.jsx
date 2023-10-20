import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { useEffect, useRef, useState } from "react";
import axios from "./axios";

export default function Chat() {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get("messages/sync")
      .then((response) => setMessages(response.data))
      .then(() => scrollToBottom());
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const msg = input;

    if (!msg) return;
    setInput("");

    const newMessage = { message: msg, name: "Beluga", received: false, timestamp: new Date().toLocaleString() };

    messages.push(newMessage);
    scrollToBottom();
    
    await axios.post("/messages/new", newMessage);
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>Room Name</h3>
          <p>last seen at....</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <div key={message.timestamp}>
            <p className={`chat__message ${!message.received && "chat__reciever"}`}>
              <span className="chat__name">{message.name}</span>
              {message.message}
              <span className="chat__timestamp">{message.timestamp}</span>
            </p>
          </div>
        ))}
        <div className="scroll__end" ref={messagesEndRef} />
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form action="">
          <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" />
          <button onClick={sendMessage} type="submit">
            Submit
          </button>
        </form>
        <MicNoneIcon />
      </div>
    </div>
  );
}
