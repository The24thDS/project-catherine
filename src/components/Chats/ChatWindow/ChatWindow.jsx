import React, { useState, useEffect } from "react";
import { EuiAvatar, EuiIcon, EuiPopover } from "@elastic/eui";
import moment from "moment";
import Picker from "react-emojipicker";
import TextareaAutosize from "react-autosize-textarea";
import { emojify } from "react-emojione";
import AutoScroll from "@brianmcallister/react-auto-scroll";

import styles from "./ChatWindow.module.sass";

function ChatWindow(props) {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [grabAttention, setGrabAttention] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const sendMessage = () => {
    if (message.trim().split("/n").join(" ") !== "") {
      setMessages([
        ...messages,
        {
          you: true,
          content: message.trim(),
          date: moment().format("YYYY-MM-DD HH:mm"),
        },
      ]);
      props.sendMessage({ message, toUser: props.email });
      setMessage("");
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.shortname);
  };

  useEffect(() => {
    if (props.receivedMessage) {
      setMessages((messages) => [
        ...messages,
        {
          you: false,
          content: props.receivedMessage.content,
          date: moment(props.receivedMessage.moment).format("YYYY-MM-DD HH:mm"),
        },
      ]);
      setGrabAttention(true);
    }
  }, [props.receivedMessage]);

  return (
    <div
      className={
        styles["chat-window"] +
        " " +
        (grabAttention ? styles["attention-grabber"] : null)
      }
      onClick={() => setGrabAttention(false)}
    >
      <header onClick={() => setIsOpen(!isOpen)}>
        <EuiAvatar
          name={`${props.firstName} ${props.lastName}`}
          imageUrl={props.profilePicture}
          className={styles["friend-avatar"]}
          data-private
        />
        <span className={styles["friend-name"]} data-private>
          {props.firstName} {props.lastName}
        </span>
        <span
          className={`${styles["status-dot"]} ${
            props.online ? styles.online : styles.offline
          }`}
        ></span>
        <EuiIcon
          className={styles["close-window"]}
          type="cross"
          color="danger"
          onClick={() => props.closeWindow(props.email)}
        />
      </header>

      {/* <div
        className={styles["messages-container"]}
        style={{ height: isOpen ? "200px" : "0px" }}
      > */}
      <AutoScroll
        showOption={false}
        className={styles["messages-container"]}
        height={isOpen ? 200 : 0}
      >
        {messages.map((message, id) => {
          if (message.you) {
            return (
              <div
                key={"message" + id}
                className={styles["my-message"]}
                data-private
              >
                {emojify(message.content)}
                <time className={styles.date}>{message.date}</time>
              </div>
            );
          } else {
            return (
              <div
                key={"message" + id}
                className={styles["friend-message"]}
                data-private
              >
                {emojify(message.content)}
                <time className={styles.date}>{message.date}</time>
              </div>
            );
          }
        })}
      </AutoScroll>
      {/* </div> */}
      <div
        className={styles["input-container"]}
        style={{ height: isOpen ? "auto" : "0px" }}
      >
        <TextareaAutosize
          value={emojify(message, { output: "unicode" })}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              sendMessage();
            }
          }}
          onChange={(ev) => {
            setMessage(ev.target.value);
          }}
          className={styles.input}
          data-private="lipsum"
        />
        <EuiPopover
          button={
            <span
              className={
                styles["emoji-button"] +
                " " +
                (isEmojiPickerOpen ? styles["emoji-active"] : null)
              }
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              role="img"
              aria-label="emoji picker"
            >
              😊
            </span>
          }
          isOpen={isEmojiPickerOpen}
          closePopover={() => setIsEmojiPickerOpen(false)}
          anchorPosition="upCenter"
          panelPaddingSize="none"
          repositionOnScroll={true}
          zIndex={4}
          panelClassName={styles["emoji-picker"]}
        >
          <Picker onEmojiSelected={onEmojiClick} />
        </EuiPopover>
      </div>
    </div>
  );
}

export default ChatWindow;
