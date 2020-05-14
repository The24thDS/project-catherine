import React, { useState } from "react";
import { EuiAvatar } from "@elastic/eui";

import styles from "./ChatWindow.module.sass";

function ChatWindow(props) {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { you: false, content: "You looking nice" },
  ]);

  const sendMessage = () => {
    setMessages([...messages, { you: true, content: message }]);
    setMessage("");
  };

  return (
    <div className={styles["chat-window"]}>
      <header onClick={() => setIsOpen(!isOpen)}>
        <EuiAvatar
          name={`${props.name}`}
          imageUrl={props.profilePicture}
          className={styles["friend-avatar"]}
        />
        {props.name}
      </header>
      <div
        className={styles["messages-container"]}
        style={{ height: isOpen ? "200px" : "0px" }}
      >
        {messages.map((message) => {
          if (message.you) {
            return (
              <div className={styles["my-message"]}>{message.content}</div>
            );
          } else {
            return (
              <div className={styles["friend-message"]}>{message.content}</div>
            );
          }
        })}
      </div>
      <div
        className={styles["input-container"]}
        style={{ height: isOpen ? "auto" : "0px" }}
      >
        <input
          type="text"
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
        />
        <input type="button" value=">" onClick={sendMessage} />
      </div>
    </div>
  );
}

export default ChatWindow;
