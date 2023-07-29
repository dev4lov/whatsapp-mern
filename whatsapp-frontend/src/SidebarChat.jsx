import React from "react";
import "./SidebarChat.css";
import { Avatar } from "@mui/material";

export default function SidebarChat() {
  return (
    <div className="sidebarChat">
      <Avatar />
      <div className="sidebarChat__info">
        <h2>Room Name</h2>
        <p>This is message</p>
      </div>
    </div>
  );
}
