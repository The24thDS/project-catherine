import React, { useState, useEffect } from "react";
import { EuiAvatar } from "@elastic/eui";
import moment from "moment";

import styles from "./ChatWindow.module.sass";

function ChatWindow(props) {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    setMessages([
      ...messages,
      {
        you: true,
        content: message,
        date: moment().format("YYYY-MM-DD HH:mm"),
      },
    ]);
    setMessage("");
    props.sendMessage({ message, toUser: props.email });
  };

  useEffect(() => {
    if (props.receivedMessage) {
      setMessages((m) => [
        ...messages,
        {
          you: false,
          content: props.receivedMessage.content,
          date: moment(props.receivedMessage.moment).format("YYYY-MM-DD HH:mm"),
        },
      ]);
    }
  }, [props.receivedMessage]);

  return (
    <div className={styles["chat-window"]}>
      <header onClick={() => setIsOpen(!isOpen)}>
        <EuiAvatar
          name={`${props.firstName} ${props.lastName}`}
          imageUrl={props.profilePicture}
          className={styles["friend-avatar"]}
        />
        <span className={styles["friend-name"]}>
          {props.firstName} {props.lastName}
        </span>
        <span
          className={`${styles["status-dot"]} ${
            props.online ? styles.online : styles.offline
          }`}
        ></span>
      </header>
      <div
        className={styles["messages-container"]}
        style={{ height: isOpen ? "200px" : "0px" }}
      >
        {messages.map((message, id) => {
          if (message.you) {
            return (
              <div key={"message" + id} className={styles["my-message"]}>
                {message.content}
                <time className={styles.date}>{message.date}</time>
              </div>
            );
          } else {
            return (
              <div key={"message" + id} className={styles["friend-message"]}>
                {message.content}
                <time className={styles.date}>{message.date}</time>
              </div>
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
          onKeyDown={(ev) => (ev.key === "Enter" ? sendMessage() : null)}
          onChange={(ev) => {
            setMessage(ev.target.value);
          }}
        />
        <input type="button" value=">" onClick={sendMessage} />
      </div>
    </div>
  );
}

export default ChatWindow;
