import React from "react";
import { emojify } from "react-emojione";

import { EuiCallOut, EuiButtonIcon } from "@elastic/eui";

import styles from "./NewFeaturesWindow.module.sass";

function NewFeaturesWindow({ closeWindow, ...rest }) {
  const emojiOptions = {
    style: { height: 22, width: 22 },
  };
  return (
    <div className={styles.container} {...rest}>
      <EuiButtonIcon
        iconType="cross"
        className={styles.close}
        onClick={closeWindow}
      />
      <h1>
        <span className={styles["special-title"]} data-text="EXPRESS YOURSELF">
          EXPRESS YOURSELF
        </span>{" "}
        update
      </h1>
      <h2>WHAT'S NEW</h2>
      <time dateTime="2020-05-26">May 26, 2020</time>
      <EuiCallOut
        title="We added a few things"
        color="success"
        iconType="gear"
        className={styles.features}
      >
        <ul>
          <li>
            <span>
              <b>Emojis are here!</b> You can use them in chat, comments and
              posts. Isn't this amazing?{emojify(":heart:", emojiOptions)}
            </span>
          </li>
          <li>
            <span>
              <b>Chat auto-scrolling!</b> Keep chatting while we scroll the chat
              for you.
            </span>
          </li>
          <li>
            <span>
              <b>Text input auto-resize!</b> Are you one of those people that
              write long messages? If you are, then no matter how long the input
              is, you'll always need more space. That's why we hired an elf to
              resize the comment and chat inputs vertically while you type. We
              are waiting for your novel!{emojify(":hugging:", emojiOptions)}
            </span>
          </li>
          <li>
            <span>
              <b>Chat history! Kind of {emojify("xD", emojiOptions)}.</b> We
              value privacy, that's why we don't save chat messages on a server.
              But we also value user experience, so we are now storing your
              messages on your computer while you're logged in. Once you logout,
              the messages are gone.{emojify(":D", emojiOptions)}
            </span>
          </li>
          <li>
            <span>
              <b>Your posts on the main feed.</b> Most people want to see their
              posts on the feed. We figured that we should give them this
              opportunity.
            </span>
          </li>
        </ul>
      </EuiCallOut>
      <EuiCallOut
        title="We fixed some other things"
        color="warning"
        iconType="alert"
        className={styles.fixes}
      >
        <ul>
          <li>
            <span>
              <b>
                Your new posts appear right away on the feed and profile page!
              </b>{" "}
              Even we were confused by this bug.
            </span>
          </li>
          <li>
            <span>
              <b>We restored the order in the chat land!</b> The chat windows
              are now correctly ordered.
            </span>
          </li>
          <li>
            <span>
              <b>We fixed the lying comments.</b> The counter will always tell
              the truth now and the comments won't get lost in the coding land.
            </span>
          </li>
          <li>
            <span>
              <b>The post date just got a buff!</b> We changed it to be smarter
              and to take into consideration the amount of time that passed. It
              also shows a tooltip when you hover it.
            </span>
          </li>
          <li>
            <span>
              <b>Logout twins are gone!</b> Only one of them is now present in
              the user popover.
            </span>
          </li>
        </ul>
      </EuiCallOut>
    </div>
  );
}

export default NewFeaturesWindow;
